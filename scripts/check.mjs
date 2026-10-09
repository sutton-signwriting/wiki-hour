import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const walk = async directory => (await Promise.all(await readdir(directory).then(names => names.map(async name => {
  const target = path.join(directory, name);
  return (await stat(target)).isDirectory() ? walk(target) : [target];
})))).flat();
const files = await walk(dist);
assert.ok(files.length > 0, 'Run the build and PDF export first.');
let checkedLinks = 0;
for (const filename of files.filter(name => name.endsWith('.html'))) {
  const html = await readFile(filename, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate ID in ' + filename);
  assert.ok(!/<aside class="speaker-notes"|id="notes"/.test(html), 'Presenter-only content emitted: ' + filename);
  for (const [, href] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(href)) continue;
    const [relative, fragment] = href.split('#');
    const target = relative ? path.resolve(path.dirname(filename), relative) : filename;
    assert.ok(target.startsWith(dist + path.sep), 'Local link escapes output: ' + href);
    await stat(target).catch(() => assert.fail('Missing local link: ' + filename + ' → ' + href));
    if (fragment && target.endsWith('.html')) {
      assert.ok((await readFile(target, 'utf8')).includes('id="' + fragment + '"'), 'Missing anchor: ' + href);
    }
    checkedLinks++;
  }
}
const slides = await readFile(path.join(dist, 'slides.html'), 'utf8');
assert.equal((slides.match(/class="slide(?: title-slide)?"/g) || []).length, 12);
assert.equal((slides.match(/class="val-question"/g) || []).length, 5);
assert.ok(!slides.includes('Speaker notes'), 'Public deck has presenter controls.');
const audience = await readFile(path.join(dist, 'downloads/slides-standalone.html'), 'utf8');
assert.ok(!audience.includes('<aside'), 'Audience download contains speaker notes.');
assert.ok(!/href="assets\/|src="assets\//.test(audience), 'Offline asset dependency.');
for (const filename of files) {
  assert.ok(!/\/private\/|\/TASKS\.md|\/AGENTS\.md|val-qa|organizer-reply/.test(filename), 'Private source emitted.');
  if (!/\.(html|md|js|css)$/.test(filename)) continue;
  const content = await readFile(filename, 'utf8');
  assert.ok(!/mail\.google\.com|\.codex\/attachments|\/(?:home|Users)\/[^/]+\/Projects|192\.168\./.test(content), 'Private provenance emitted.');
}
await stat(path.join(dist, '.nojekyll'));
for (const pdf of ['paper.pdf', 'resources.pdf', 'slides.pdf']) {
  assert.ok((await stat(path.join(dist, 'downloads', pdf))).size > 1000, 'Missing PDF: ' + pdf);
}
console.log(`PASS: ${checkedLinks} local links; 12 slides; 5 Val prompts; offline audience deck; private-source exclusion; PDFs.`);
