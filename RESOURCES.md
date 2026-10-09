# Writing, readers, and tools: resource guide

Companion to Valerie Sutton and Steve Slevinski's Workshop 1 presentation.

Presentation draft 0.5 · Sources checked 8 October 2026.

## Writing and history

- [What is SignWriting?](https://www.signwriting.org/about/what/what02.html): the script and the languages it can write.
- [Val's seven history answers, Presentation 0097](https://www.signwriting.org/symposium/presentation0097.html): extended history, with ASL and Libras interpretation material.
- [Wikimedia technical history](https://github.com/sutton-signwriting/unicode-and-signwriting/blob/main/entries/wikimedia-brief/essay.md): earlier experimental Incubator work and its tools.
- [Public Office](https://office.signwriting.org/): people, contact, and the publication library.

## The writing model

The writer chooses symbols and their two-dimensional arrangement. FSW and SWU
preserve that composition. Encoding rules define well-formed text; experienced
readers judge writing quality and develop orthography through use.

**Formal SignWriting in ASCII (FSW)** is the canonical encoding string for spelling
a sign. **SignWriting in Unicode (SWU)** is an experimental encoding design, 100%
compatible with FSW. SWU is not part of the Unicode standard. Both are incompatible
with the official SignWriting design introduced in Unicode 8.

- [Formal SignWriting specification](https://formal.signwriting.org/).
- [Formal SignWriting archival record](https://doi.org/10.5281/zenodo.20074767).
- [FSW/SWU developer guidance](https://github.com/sutton-signwriting/unicode-and-signwriting/blob/main/entries/developer-notes/essay.md).
- [Facial Orthography Boundary](https://github.com/sutton-signwriting/unicode-and-signwriting/blob/main/entries/facial-orthography-boundary/essay.md): Steve's assessment of authored facial-data loss in the official model.

## Tools Steve supplies

| Purpose | Environment | Package / documentation |
|---|---|---|
| Parse, validate, convert, query | JavaScript / browser / Node.js | [core](https://github.com/sutton-signwriting/core) |
| Render SVG or PNG | JavaScript / browser | [font-ttf](https://github.com/sutton-signwriting/font-ttf) |
| Render with the symbol database | Node.js | [font-db](https://github.com/sutton-signwriting/font-db) |
| Build browser interfaces | Browser | [sgnw-components](https://github.com/sutton-signwriting/sgnw-components) |
| Compose and edit signs | Browser | [SignMaker](https://github.com/sutton-signwriting/signmaker) |
| Process text | Python | [core-py](https://github.com/sutton-signwriting/core-py) |
| Render SVG or PNG | Python | [font-py](https://github.com/sutton-signwriting/font-py) |
| Process text | PHP | [core-php](https://github.com/sutton-signwriting/core-php) |

Each project's documentation carries its installation and release details.

## Using SignMaker in another application

Load a sign, edit it, and save it back. Another application can embed SignMaker,
load a written sign using FSW or SWU, and receive the updated writing in both
encodings when the writer saves.

- [Online editor](https://www.sutton-signwriting.io/signmaker/).
- [Application demo](https://www.sutton-signwriting.io/signmaker/demo.html).
- [Integration protocol and source](https://github.com/sutton-signwriting/signmaker#readme).

The SignMaker 2 web implementation is credited to Amit Moryossef.

## Community software and research

| Project | Contribution |
|---|---|
| [SignWriting utilities](https://github.com/sign-language-processing/signwriting) | Structured FSW objects, format conversion, tokenization, and images. |
| [SignWriting evaluation](https://github.com/sign-language-processing/signwriting-evaluation) | Automatic comparisons using token, character, image, and symbol-distance metrics. |
| [SignBank+](https://arxiv.org/abs/2309.11566) | Multilingual translation-dataset preparation using large language models. |

These projects have independent maintainers and tool-specific input formats.
Automatic metrics compare particular features; readers evaluate meaning and writing
quality in the relevant language and context. Reviewed examples and explained
corrections can support teaching and research when their reuse is agreed.

Steve's forthcoming WLL article, *Plane-Based Writing: Sutton SignWriting and the
Organizational Axis in Writing-System Typology*, asks how a script's written unit
is organized as well as what it represents. The
[publication library](https://steveslevinski.me/#section/publications)
provides the released research record.

## Wikimedia integration and hosting

The earlier SignWriting Cloud VPS servers went down, and the Incubator integration
needs redesign. Steve supplies the SignWriting tools; Wikimedia developers would
build and maintain the integration. The proposed browser display and editing path
can avoid dependency on the old VPS servers.

For suitable companion tools needing hosted processing, Steve recommends Toolforge.
It is part of Wikimedia Cloud Services: administrators manage the server pool, and
tool maintainers manage their applications and runtime updates.

- [About Toolforge](https://wikitech.wikimedia.org/wiki/Portal:Toolforge/About_Toolforge): the managed hosting model and maintainer roles.
- [Toolforge web services](https://wikitech.wikimedia.org/wiki/Help:Toolforge/Web): hosting implementation documentation.
- [Toolforge help](https://wikitech.wikimedia.org/wiki/Help:Toolforge): entry point for developers evaluating a tool's fit.

These are integration and hosting recommendations. An Incubator redesign, related
writing-review collections, and future API or AI-assisted drafting connections are
proposed work. The [technology website](https://www.sutton-signwriting.io/)
links the current development tools; this guide points directly to their documentation.
