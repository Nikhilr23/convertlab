# ConvertLab

### Private, browser-first conversion and file utilities

**Live:** https://nikhilr23.github.io/convertlab/

ConvertLab is a lightweight conversion toolkit for common image, structured-data, and PDF-generation tasks that can be handled locally in a modern browser.

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
- Sequential processing to reduce avoidable memory spikes
- Independent status and download per file
- Per-file failure isolation

### Images → PDF — Stage 4
- Combine up to 30 JPG / PNG / WebP / SVG images into one PDF
- Reorder pages before generation
- A4 or US Letter page size
- Portrait or landscape orientation
- Fit-entire-image or fill-page/crop behavior
- Standard, small, or zero margins
- Sequential source-image processing
- Local PDF generation in the page using jsPDF
- Single downloadable PDF output

### Data tools
- CSV → JSON and JSON → CSV
- Copy output or download `.json` / `.csv`
- 1 MB pasted-data guardrail

## Privacy architecture

For the current conversion workflows, selected source files are processed by client-side JavaScript and are not intentionally uploaded to a ConvertLab conversion server. ConvertLab has no application backend, account system, or database.

Stage 4 adds a third-party JavaScript dependency: **jsPDF 2.5.2**, loaded in the browser from jsDelivr with Subresource Integrity and CORS attributes. The library code is fetched from the CDN; selected source images are processed locally by the page and are not sent to that CDN by ConvertLab.

Privacy messaging must be revisited if analytics, uploads, external processing, or server-side conversion are added later.

## QA & defensive behavior

The implementation includes MIME-type checks, 25 MB per-image limits, 12,000 px source/output dimension checks, sequential batch/PDF processing, safe text-only filename rendering, temporary object-URL cleanup, and defensive CSV/JSON validation.

For PDF generation, source images are rasterized to JPEG with a longest-side working resolution capped at 2,400 px before insertion. This reduces PDF size and browser-memory pressure, but it also means Stage 4 is designed for convenient image PDFs rather than archival or print-production fidelity.

Stage 3's main batch workflow has been manually exercised with representative real images. Stage 4 should receive the same real-file browser QA before broader PDF features are added.

## Technical decisions

- **Vanilla JavaScript** for the application logic
- **Canvas API** for raster conversion/resizing
- **File / Blob / Object URL APIs** for local files/downloads
- **jsPDF 2.5.2** for browser-side PDF generation
- **Sequential processing** instead of full-resolution parallel processing
- **GitHub Pages** for static hosting

## Tech stack

`HTML` · `CSS` · `JavaScript` · `Canvas API` · `File API` · `Blob API` · `jsPDF` · `GitHub Pages`

## Current limitations

- Stage 4 requires the jsPDF CDN script to load before PDF generation is available.
- Images are rasterized for PDF output; SVG/vector fidelity is not preserved.
- The PDF working raster is capped at 2,400 px on the longest side.
- Fill-page mode can intentionally crop image edges.
- Up to 30 source images are accepted per generated PDF.
- Large decoded images can still consume substantial browser memory even when compressed files are below 25 MB.
- SVG rendering can vary by browser and SVG contents.
- PDF → image, PDF merging, splitting, Office documents, audio/video, OCR, and generative AI are not implemented.

## Feature sequence

### 1. Better image workflow — shipped
Drag-and-drop, aspect-ratio lock, file/dimension guardrails, safer URL cleanup.

### 2. Real data downloads — shipped
Download converted JSON and CSV files.

### 3. Batch image conversion — shipped & manually exercised
Multiple images, sequential processing, per-file status/download, failure isolation.

### 4. Images → PDF — shipped, QA next
Ordered image pages, A4/Letter, portrait/landscape, contain/cover, margin controls, local PDF output.

### Next PDF candidates — only after Stage 4 QA
1. PDF → images
2. Merge PDFs
3. Split/extract pages

Each should be evaluated for browser memory, dependency size, compatibility, and privacy behavior before implementation.

## Product principle

**Use local browser capabilities first. Add server infrastructure only when the conversion actually requires it.**

## Author

Built by [Nikhil Reddy Chitkula](https://github.com/Nikhilr23).