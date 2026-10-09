import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const exportsDir = path.join(root, 'exports');
const packageInfo = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const draft = packageInfo.version.replace(/\.0$/, '');
const publicBase = 'https://www.sutton-signwriting.io/wiki-hour/';
await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets'), { recursive: true });
await mkdir(path.join(dist, 'downloads'), { recursive: true });
await mkdir(exportsDir, { recursive: true });

const shell = (title, content, route) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Wiki Hour</title><meta name="description" content="Wiki Hour materials with Valerie Sutton and Steve Slevinski: written signed languages, orthography, and reusable SignWriting tools.">
<link rel="canonical" href="${publicBase}${route === 'index.html' ? '' : route}"><link rel="stylesheet" href="assets/preview.css"></head><body>
<nav aria-label="Wiki Hour"><a class="brand" href="index.html">Wiki Hour</a><a href="slides.html">Presentation</a><a href="paper.html">Paper</a><a href="session.html">Session</a><a href="resources.html">Resources</a></nav>
<main>${content}</main><footer><p>Valerie Sutton and Steve Slevinski · Presentation draft ${draft} · 9 October 2026 · Final presenter review pending.</p><a href="sources.html">Sources</a> · <a href="https://github.com/sutton-signwriting/wiki-hour">Source repository</a> · <a href="https://office.signwriting.org/">Sutton SignWriting Office</a></footer></body></html>\n`;

const renderMarkdown = markdown => marked.parse(markdown)
  .replaceAll('href="RESOURCES.md"', 'href="resources.html"')
  .replaceAll('<table>', '<div class="table-scroll"><table>')
  .replaceAll('</table>', '</table></div>');
for (const [source, output, title] of [
  ['paper.md', 'paper.html', 'Why Written Sign Language Matters'],
  ['SESSION.md', 'session.html', 'Workshop 1 programme'],
  ['RESOURCES.md', 'resources.html', 'Writing, readers, and tools'],
  ['SOURCES.md', 'sources.html', 'Sources']
]) {
  const markdown = await readFile(path.join(root, source), 'utf8');
  await writeFile(path.join(dist, output), shell(title, renderMarkdown(markdown), output));
  await writeFile(path.join(dist, 'downloads', source), markdown);
}

const slides = await readFile(path.join(root, 'slides.html'), 'utf8');
if (/class="speaker-notes"|id="notes"/.test(slides)) throw new Error('The public presentation source contains presenter-only notes or controls.');
await cp(path.join(root, 'slides.html'), path.join(dist, 'slides.html'));
for (const name of ['slides.css', 'slides.js', 'preview.css']) await cp(path.join(root, 'assets', name), path.join(dist, 'assets', name));
const css = await readFile(path.join(root, 'assets/slides.css'), 'utf8');
const js = await readFile(path.join(root, 'assets/slides.js'), 'utf8');
const makeStandalone = html => html
  .replace('<link rel="stylesheet" href="assets/slides.css">', '<style>\n' + css + '</style>')
  .replace('<script src="assets/slides.js" defer></script>', '')
  .replace('</body>', '<script>\n' + js + '</script>\n</body>');
const audience = makeStandalone(slides);
if (audience.includes('href="assets/') || audience.includes('src="assets/')) throw new Error('Standalone slides retain an asset dependency');
for (const name of ['slides-standalone.html', 'slides-audience.html']) await writeFile(path.join(exportsDir, name), audience);
await writeFile(path.join(dist, 'downloads', 'slides-standalone.html'), audience);

// Optional local presenter output is never included in the public site artifact.
let notes;
try { notes = JSON.parse(await readFile(path.join(root, 'private/speaker-notes.json'), 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (notes) {
  let presenter = slides.replace('<button id="print"', '<label><input type="checkbox" id="notes"> Speaker notes</label>\n    <button id="print"');
  for (const [id, content] of Object.entries(notes)) {
    const section = new RegExp('(<section class="slide(?: title-slide)?" id="' + id + '"[\\s\\S]*?)(</section>)');
    if (!section.test(presenter)) throw new Error('Unknown presenter note target: ' + id);
    presenter = presenter.replace(section, (_, start, end) => start + '<aside class="speaker-notes" hidden>' + content + '</aside>\n    ' + end);
  }
  await writeFile(path.join(exportsDir, 'slides-presenter.html'), makeStandalone(presenter));
} else {
  await rm(path.join(exportsDir, 'slides-presenter.html'), { force: true });
}

await writeFile(path.join(dist, '.nojekyll'), '');
await writeFile(path.join(dist, 'index.html'), shell('Written signed languages on Wikimedia', `
<section class="hero">
<p class="eyebrow">Wiki Hour Initiative · Workshop 1</p>
<h1>Writing signed languages<br>for Wikimedia</h1>
<p class="lede">Valerie Sutton and Steve Slevinski explore the writer’s composition, the reader’s judgment, and the tools that preserve written signs.</p>
<p class="draft-status">Presentation draft ${draft} · Final presenter review pending</p>
<div class="actions"><a class="button" href="slides.html">View the presentation</a><a class="button secondary" href="resources.html">Explore the tools</a></div>
</section>
<section class="intro"><h2>Writing, readers, and tools</h2>
<p>Valerie created the symbols. Writers choose symbols and arrange them in two dimensions. Readers develop orthography through use, comparison, and correction. SignWriting software preserves that composition and gives developers a foundation for applications, research, and Wikimedia integration.</p></section>
<div class="cards">
  <section class="card"><h2><a href="slides.html">Presentation</a></h2><p>Spatial writing, orthography, FSW/SWU, the SignMaker exchange, and the proposed Wikimedia route.</p><a href="downloads/slides.pdf">Slide PDF</a><br><a href="downloads/slides-standalone.html" download>Offline slideshow</a></section>
  <section class="card"><h2><a href="paper.html">The argument</a></h2><p>Why the writer’s arrangement belongs to the spelling, and how readers develop a body of good writing.</p><a href="downloads/paper.pdf">Paper PDF</a></section>
  <section class="card"><h2><a href="resources.html">Tools and research</a></h2><p>Libraries, browser components, SignMaker, machine-learning research, and Toolforge documentation.</p><a href="downloads/resources.pdf">Resource guide PDF</a></section>
</div>
<section class="event"><h2>Workshop 1 · 10 October 2026</h2>
<p>The Wiki Hour Initiative hosts the online session with International Sign interpretation, live captions, and audience discussion. The organizers provide the time and joining details and plan to archive the recording on YouTube and Wikimedia Commons.</p>
<p><a href="session.html">Session outline</a> · <a href="https://www.signwriting.org/symposium/presentation0097.html">Val’s seven history answers</a></p></section>
`, 'index.html'));
console.log('Built audience-facing Wiki Hour website, downloads, and offline slideshow.');
