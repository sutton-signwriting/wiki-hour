# Why Written Sign Language Matters

**Writing, readers, and tools**

Valerie Sutton and Steve Slevinski · Workshop 1 · Presentation draft 0.5 · 9 October 2026

A note to a friend, a reminder, a story, or an encyclopedia article can be written
directly in a signed language. Valerie Sutton begins with that everyday purpose:
people should have a way to write what they want to say in their own language.

SignWriting is a script used to write signed languages. The languages differ across
communities and regions; a shared script supports that variety. International Sign
is a separate form of communication across language backgrounds. The
[SignWriting introduction](https://www.signwriting.org/about/what/what02.html)
and [Val's history answers](https://www.signwriting.org/symposium/presentation0097.html)
provide background.

## The writer composes in two dimensions

Valerie created the symbols. The writer chooses which symbols to use and their
two-dimensional arrangement. The signbox is the composed written unit: selected
symbols and their spatial relationships form a written sign. Spatial composition
is part of the spelling.

Steve's forthcoming *Written Language & Literacy* article, *Plane-Based Writing:
Sutton SignWriting and the Organizational Axis in Writing-System Typology*, makes
this an explicit theoretical question. Writing-system typology needs to describe
both what a script represents and how its written unit is organized. SignWriting's
signbox brings the organizational question into focus: readers work with a composed
field whose relationships must remain recoverable.

Software that stores, exchanges, searches, or renders the writing needs to preserve
that composition. The reader should be able to recover what the writer wrote.

## Orthography develops through use

The writing system offers symbols and composition principles. The encoding defines
the structure software can process. Within those rules, writers can produce clear
writing, awkward writing, ambiguous writing, and nonsense. Experienced readers judge
how well a composition communicates what its writer intended.

Orthography develops as readers and writers use, compare, correct, and teach written
forms. Conventions take time to grow. Language, regional variety, and the purpose of
a text matter to judgments about writing. Val's perspective on literacy leaves room
for learning at different stages and for the value of knowledge gained along the way.

There are two possible routes to developing a body of reviewed writing. An editor
and a small team can select, refine, and publish forms. A broader community can
contribute many forms, followed by readers comparing, rating, and categorizing them.
The routes can work together: community contributions provide material, and editorial
work makes selected examples useful for publication and teaching.

Good examples show what works. An original form, its correction, and an explanation
show what to avoid and why. Over time, active readers and writers can build a
continuing resource for their language. A useful review records the language and
variety, intended reading, author and source, revision, and reader's explanation.
Such collections can support lessons and, where reuse is agreed, research datasets.

## Earlier tools and Steve's role today

SignPuddle supported dictionaries and documents. Custom software supported
experimental written sign-language articles in Wikimedia Incubator. Val's recollection
of the 2016 San Diego conference brings that teamwork and its significance to readers
into the conversation. The [Wikimedia Brief](https://github.com/sutton-signwriting/unicode-and-signwriting/blob/main/entries/wikimedia-brief/essay.md)
records the earlier technical work.

The separate SignWriting Cloud VPS servers used for that work went down, and the
Incubator integration needs redesign. Steve's present role is supplying SignWriting
tools that other developers can integrate. Wikimedia developers
would build and maintain a redesigned implementation.

The reusable foundation is written-sign data. Dictionaries, editors, teaching
applications, publications, and research pipelines can share that foundation.

## FSW and SWU encode the composition

**Formal SignWriting in ASCII (FSW)** is the canonical encoding string for spelling
a sign. **SignWriting in Unicode (SWU)** is an experimental encoding design, 100%
compatible with FSW through lossless correspondence. SWU is not part of the Unicode
standard. Both encodings are incompatible with the official SignWriting design
introduced in Unicode 8.

FSW and SWU preserve the selected production symbols and their positions. Their
correspondence gives compatible applications two representations of the same
composition. Canonical encoding leaves room for different linguistic spellings and
readers' judgments. See [Formal SignWriting](https://formal.signwriting.org/) and
the [Developer Notes](https://github.com/sutton-signwriting/unicode-and-signwriting/blob/main/entries/developer-notes/essay.md).

Steve's [Facial Orthography Boundary](https://github.com/sutton-signwriting/unicode-and-signwriting/blob/main/entries/facial-orthography-boundary/essay.md)
explains his recommendation to use FSW/SWU for complete production writing. The
official facial model fails to store the authored facial symbols and arrangement.
Display improvements cannot recover missing written information. That preservation
assessment supplies the technical boundary for the tools described here.

## Reusable tools and a growing ecosystem

Steve supplies core text-processing libraries for JavaScript, Python, and PHP,
rendering libraries, web components, and SignMaker. Core libraries parse, convert,
and query writing; font libraries render it; browser components and the editor
connect it to application interfaces. The [resource guide](RESOURCES.md) maps the
packages to their purposes and environments.

Other maintainers are extending the ecosystem. The
[sign-language-processing utilities](https://github.com/sign-language-processing/signwriting)
provide structured FSW data, conversion, and tokenization for NLP workflows. Their
[evaluation project](https://github.com/sign-language-processing/signwriting-evaluation)
compares machine-generated writing with several metrics.
[SignBank+](https://arxiv.org/abs/2309.11566) is a research example of multilingual
translation-dataset preparation using large language models.

Preserved compositions and explained reader judgments give this work a richer
resource. Automatic measures compare particular features; experienced readers
evaluate meaning and writing quality in the relevant language and context.

## SignMaker exchanges editable writing

[SignMaker](https://www.sutton-signwriting.io/signmaker/) provides a visual editor
for choosing and arranging symbols. An application can embed the editor and send it
FSW or SWU. The writer edits the composition; Save returns both encodings to the host.
The application can then retain the editable writing.

The [messaging demo](https://www.sutton-signwriting.io/signmaker/demo.html)
and [integration documentation](https://github.com/sutton-signwriting/signmaker#readme)
show that exchange. The SignMaker 2 web implementation is credited to Amit Moryossef.
This provides a practical interface for developers building dictionaries, teaching
applications, or contribution workflows.

## A redesigned route for Wikimedia

A proposed Incubator redesign can use the current browser libraries for display and
editing without depending on the old Cloud VPS servers. The integration would need
to connect composed text to Wikimedia's editing, publication, and revision workflows.
Articles could use reviewed forms while a related writing collection retains
alternatives, corrections, and reader explanations.

For suitable companion tools that need hosted processing, Steve recommends
[Toolforge](https://wikitech.wikimedia.org/wiki/Portal:Toolforge/About_Toolforge).
It is part of Wikimedia Cloud Services, with administrators managing the server
pool. This shifts virtual-server operating-system upkeep away from individual tool
maintainers. Maintainers still look after their applications and runtime updates.
The recommendation is a hosting route for others to evaluate, rather than a deployed
SignWriting integration. [Toolforge's web-service documentation](https://wikitech.wikimedia.org/wiki/Help:Toolforge/Web)
provides implementation guidance.

The enduring relationship is straightforward. Writers compose the signs. Readers
develop orthography through use and judgment. Steve supplies tools that preserve
the writing and let other developers carry it into applications, research, and
future Wikimedia work.
