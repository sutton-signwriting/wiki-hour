import { access, cp, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = process.env.WORKSHOP_CHROME_PATH;
if (!browser) throw new Error('Set WORKSHOP_CHROME_PATH to a Chrome or Chromium executable.');
await access(browser);
await mkdir(path.join(root, 'exports'), { recursive: true });
await mkdir(path.join(root, 'dist/downloads'), { recursive: true });
const profile = await mkdtemp(path.join(tmpdir(), 'workshop-pdf-'));
try {
  for (const [source, filename] of [['dist/paper.html', 'paper.pdf'], ['dist/resources.html', 'resources.pdf'], ['exports/slides-audience.html', 'slides.pdf']]) {
    await access(path.join(root, source));
    const output = path.join(root, 'exports', filename);
    const result = spawnSync(browser, [
      '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-background-networking',
      '--no-first-run', '--no-pdf-header-footer', '--user-data-dir=' + profile,
      '--print-to-pdf=' + output, pathToFileURL(path.join(root, source)).href
    ], { encoding: 'utf8', timeout: 30000 });
    if (result.error || result.status !== 0) throw result.error || new Error(result.stderr);
    await access(output);
    await cp(output, path.join(root, 'dist/downloads', filename));
    console.log('Exported ' + filename);
  }
} finally {
  await rm(profile, { recursive: true, force: true });
}
