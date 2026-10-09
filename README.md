# Wiki Hour: writing, readers, and tools

Workshop materials for the Wiki Hour Initiative, presented by **Valerie Sutton and
Steve Slevinski**. Workshop 1 explores why written signed languages matter, how
writers compose signs in two dimensions, how readers develop orthography, and what
current SignWriting tools make possible for Wikimedia developers and researchers.

**Presentation draft 0.5 · 9 October 2026 · Final presenter review pending.**
Workshop 1 is scheduled for 10 October 2026. The organizers provide the time and
joining details. The proposed programme is forty minutes of presentation and
twenty minutes of audience questions.

Publication target: **https://www.sutton-signwriting.io/wiki-hour/**

Repository: **https://github.com/sutton-signwriting/wiki-hour**

## Materials

- [Presentation](slides.html): eleven presentation slides and an audience discussion slide.
- [Paper](paper.md): the connected argument about writing, orthography, and tools.
- [Session outline](SESSION.md): the proposed programme and access arrangements.
- [Resource guide](RESOURCES.md): tools, research, history, and hosting documentation.
- [Sources](SOURCES.md): supporting references and their scope.

International Sign is relevant to interpretation and cross-language communication.
The project itself concerns written signed languages and SignWriting in the Wiki Hour
context.

## Build

Requires Node.js 22 or later. The build uses the locked `marked` dependency to render
Markdown and packages the slideshow for offline use.

```bash
npm ci
npm run build
```

This creates the static website in `dist/` and self-contained audience decks in
`exports/`. Following external links and using the hosted SignMaker demo require
internet access.

Generate downloadable PDFs with Chrome or Chromium:

```bash
WORKSHOP_CHROME_PATH=/path/to/chrome npm run export:pdf
npm run check
WORKSHOP_CHROME_PATH=/path/to/chrome npm run check:browser
```

The PDF and browser checks use isolated browser profiles. Generated output is not
an editing source. Edit the HTML, Markdown, and assets, then regenerate it.

## Publishing

The GitHub Pages workflow builds the static site and PDFs from `main` and deploys
only `dist/`. Configure the repository's Pages source as **GitHub Actions**.
Leave the repository-specific custom domain unset: the project inherits the
organization site's `www.sutton-signwriting.io` domain at `/wiki-hour/`.

All navigation and asset links are relative, so the site works at its project path
and when previewed locally. There is no dependency on the older Wikimedia Cloud VPS
servers and no server-side application in this repository.

## Contributions and examples

The writer chooses symbols and their spatial arrangement. FSW/SWU preserve that
composition; experienced readers judge writing quality. A sign-language example or
translation presented as teaching material needs review by a fluent reader.

The presentation source is audience-facing. Local presenter notes, correspondence,
and operating records are excluded from version control and deployment.
