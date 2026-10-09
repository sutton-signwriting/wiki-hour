import { spawn } from 'node:child_process';
import { access, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const executable = process.env.WORKSHOP_CHROME_PATH;
assert.ok(executable, 'Set WORKSHOP_CHROME_PATH.');
const output = path.join(root, 'exports/browser-review');
const hasPresenter = await access(path.join(root, 'exports/slides-presenter.html')).then(() => true, () => false);
await mkdir(output, { recursive: true });
const profile = await mkdtemp(path.join(tmpdir(), 'workshop-review-'));
const browser = spawn(executable, ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--no-first-run', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Browser startup timed out.')), 15000);
    browser.stderr.on('data', data => {
      const match = data.toString().match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    browser.on('exit', code => { clearTimeout(timer); reject(new Error('Browser exited: ' + code)); });
  });
  const tabs = await fetch('http://' + new URL(endpoint).host + '/json/list').then(response => response.json());
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    clearTimeout(request.timer);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(method + ' timed out.')); }, 20000);
    pending.set(requestId, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const navigate = async url => {
    await call('Page.navigate', { url });
    await evaluate(`new Promise((resolve,reject)=>{const deadline=Date.now()+15000;function check(){if(document.readyState==='complete'&&document.body)return resolve(true);if(Date.now()>deadline)return reject(new Error('Page load timeout'));setTimeout(check,100)}check()})`);
    await delay(150);
  };
  const capture = async name => {
    const result = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path.join(output, name + '.png'), Buffer.from(result.data, 'base64'));
  };
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  if (process.argv.includes('--inspect-signmaker')) {
    await navigate('https://www.sutton-signwriting.io/signmaker/demo.html');
    await delay(2500);
    console.log(JSON.stringify(await evaluate(`(()=>({text:document.body.innerText.slice(0,7000),buttons:[...document.querySelectorAll('button')].map(b=>({text:b.innerText,title:b.title})),inputs:[...document.querySelectorAll('input,textarea')].map(i=>({id:i.id,name:i.name,placeholder:i.placeholder,value:i.value.slice(0,250)})),frames:[...document.querySelectorAll('iframe')].map(f=>({src:f.src,text:f.contentDocument?.body?.innerText.slice(0,6000)}))}))()`), null, 2));
    await capture('signmaker-demo');
  } else {
    const report = [];
    for (const [name, width, height] of [['desktop',1280,900],['mobile',390,844]]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await navigate(pathToFileURL(path.join(root, hasPresenter ? 'exports/slides-presenter.html' : 'exports/slides-standalone.html')).href);
      assert.equal(await evaluate('document.querySelectorAll("#jump option").length'), 12);
      assert.equal(await evaluate('document.querySelector("#previous").disabled'), true);
      if (hasPresenter) assert.equal(await evaluate('getComputedStyle(document.querySelector(".speaker-notes")).display'), 'none');
      for (let index = 0; index < 12; index++) {
        await evaluate(`document.querySelector('#jump').value='${index}';document.querySelector('#jump').dispatchEvent(new Event('change'))`);
        assert.equal(await evaluate('location.hash'), '#slide-' + (index + 1));
        assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'Horizontal overflow: slide ' + (index + 1));
        if (name === 'desktop' || [0,6,8].includes(index)) await capture(`slide-${index + 1}-${name}`);
      }
      assert.equal(await evaluate('document.querySelector("#next").disabled'), true);
      if (hasPresenter) {
        await evaluate('document.querySelector("#notes").click()');
        assert.notEqual(await evaluate('getComputedStyle(document.querySelector(".active .speaker-notes")).display'), 'none');
        await evaluate('document.querySelector("#notes").click()');
      }
      await evaluate('document.querySelector("#all-slides").click()');
      assert.equal(await evaluate('[...document.querySelectorAll(".slide")].filter(s=>getComputedStyle(s).display!=="none").length'),12);
      await evaluate('document.querySelector("#all-slides").click();document.querySelector("h2").blur();document.querySelector("#slides").focus()');
      await call('Input.dispatchKeyEvent', { type:'keyDown', key:'Home', code:'Home' });
      assert.equal(await evaluate('location.hash'), '#slide-1');
      await call('Input.dispatchKeyEvent', { type:'keyDown', key:'ArrowRight', code:'ArrowRight' });
      assert.equal(await evaluate('location.hash'), '#slide-2');
      await call('Input.dispatchKeyEvent', { type:'keyDown', key:'End', code:'End' });
      assert.equal(await evaluate('location.hash'), '#slide-12');
      await call('Emulation.setEmulatedMedia', { media:'print' });
      assert.ok(await evaluate('[...document.querySelectorAll(".speaker-notes")].every(n=>getComputedStyle(n).display==="none")'));
      await call('Emulation.setEmulatedMedia', { media:'' });
      await navigate(pathToFileURL(path.join(root, 'exports/slides-audience.html')).href + '#slide-9');
      assert.equal(await evaluate('document.querySelectorAll("aside").length'),0);
      assert.equal(await evaluate('document.querySelector("#notes")'),null);
      assert.equal(await evaluate('document.querySelector(".slide.active").id'),'slide-9');
      for (const route of ['index.html','resources.html','paper.html','session.html','sources.html']) {
        await navigate(pathToFileURL(path.join(root, 'dist', route)).href);
        assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'Horizontal overflow: ' + route);
        if (route === 'index.html') await capture('wiki-hour-home-' + name);
      }
      await navigate(pathToFileURL(path.join(root, 'dist/resources.html')).href);
      await capture('resources-' + name);
      report.push({ viewport:name, slides:12, navigation:'passed', notes:'passed', print:'passed', audience:'passed', overflow:false });
    }
    assert.deepEqual(errors, [], 'Browser JavaScript exceptions');
    await writeFile(path.join(output, 'report.json'), JSON.stringify({ reviewed:'2026-10-09', report, exceptions:errors },null,2) + '\n');
    console.log('PASS: desktop/mobile slides, keyboard/selector navigation, notes, print, audience export, companion pages.');
  }
} finally {
  socket?.close();
  browser.kill();
  await new Promise(resolve => browser.exitCode !== null ? resolve() : browser.once('exit', resolve));
  await rm(profile, { recursive:true, force:true });
}
