# ConvertLab

### Private, browser-first conversion and file utilities

**Live:** https://nikhilr23.github.io/convertlab/

ConvertLab is a lightweight conversion toolkit for common image, structured-data, and PDF tasks handled locally in a modern browser.

> **Your file → your browser → your download**

## Available now

### Image tools
- PNG / JPG / WebP / SVG input
- PNG, JPG, or WebP output
- Drag-and-drop or file picker
- Image resizing and optional aspect-ratio lock
- Adjustable JPG/WebP quality
- 25 MB input guardrail and 12,000 px dimension guardrail

### Batch image tools
- Multiple supported images per session
- Shared format/resize settings
- Sequential processing
- Independent status and download per file

### Images → PDF — Stage 4
- Up to 30 JPG / PNG / WebP / SVG images
- Reorder/remove pages
- A4 or Letter, portrait or landscape
- Contain/cover and margin controls
- Local generation with jsPDF

### PDF → Images — Stage 4.2 (shipped; manually exercised)
- One local PDF up to 30 MB and 60 pages
- Render all pages or ranges such as `1-3,5`
- PNG or JPG output
- Standard, high, or very-high raster scale
- Adjustable JPG quality
- Sequential page rendering with independent downloads
- Duplicate-safe page-number filenames such as `document-page-001.png`
- 24-million-pixel per-render guardrail
- Clear corrupt/password-protected PDF handling
- Local PDF parsing/rendering using PDF.js

**Manual QA:** the PDF → PNG conversion path was exercised successfully in the live tool. This records the tested path only; it is not a claim of a complete browser/device matrix.

### Data tools
- CSV → JSON and JSON → CSV
- Copy or download `.json` / `.csv`
- 1 MB pasted-data guardrail

## Privacy architecture

Selected source files are processed by client-side JavaScript and are not intentionally uploaded to a ConvertLab conversion server. ConvertLab has no application backend, account system, or database.

PDF workflows load pinned browser libraries from jsDelivr: **jsPDF 2.5.2** for Images → PDF and **PDF.js 4.10.38** for PDF → Images. Library code/worker code is fetched from the CDN; the selected source files remain local to the page.

## Stage 4.2 defensive behavior

PDF → Images limits input to 30 MB and 60 pages, validates PDF-like input, parses page ranges, renders requested pages sequentially, caps each rendered canvas at 24 million pixels, cleans temporary object URLs, cleans PDF.js pages after rendering, and destroys the loaded PDF when cleared/unloaded.

Password-protected PDFs are explicitly unsupported in this MVP. OCR, password removal, text editing, merge, and split are not part of Stage 4.2.

## Technical decisions

- Vanilla HTML/CSS/JavaScript
- Canvas API for raster image output
- File / Blob / Object URL APIs
- jsPDF 2.5.2 for Images → PDF
- PDF.js 4.10.38 for PDF → Images
- Sequential processing rather than parallel full-resolution work
- GitHub Pages static hosting

## Feature sequence

1. Better image workflow — **shipped**
2. Real data downloads — **shipped**
3. Batch image conversion — **shipped**
4. Images → PDF — **shipped**
5. PDF → Images — **shipped; PDF → PNG manually exercised**

Next candidate: evaluate **Merge PDFs** as a separate stage rather than bundling merge/split together.

## Current limitations

- PDF features require their CDN libraries/worker to load.
- PDF → Images rasterizes pages; it does not preserve editable/vector PDF structure.
- Password-protected PDFs are not supported.
- Maximum PDF input is 30 MB / 60 pages.
- Very complex PDFs can still use substantial browser memory.
- PDF → Images has not been certified across a full browser/device matrix.
- Merge/split, Office documents, audio/video, OCR, and generative AI are not implemented.

## Product principle

**Use local browser capabilities first. Add server infrastructure only when the conversion actually requires it.**

## Author

Built by [Nikhil Reddy Chitkula](https://github.com/Nikhilr23).