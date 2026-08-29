# ConvertLab

### Private, browser-first conversion and file utilities

**Live:** https://nikhilr23.github.io/convertlab/

ConvertLab is a lightweight conversion toolkit for common image and structured-data tasks that can be handled locally in a modern browser. The current release intentionally avoids accounts, databases, file-upload APIs, and a conversion backend.

> **Your file → your browser → your download**

## Available now

### Image tools
- PNG / JPG / WebP / SVG input
- PNG, JPG, or WebP output
- Drag-and-drop or file picker
- Image resizing
- Optional aspect-ratio lock
- Adjustable JPG/WebP quality
- 25 MB input guardrail and 12,000 px dimension guardrail

### Batch image tools
- Select or drag multiple supported images
- Convert PNG / JPG / WebP / SVG inputs to one chosen raster output format
- Optional batch resize settings
- Preserve each source image's aspect ratio
- Sequential processing to reduce avoidable browser-memory spikes
- Independent status for each file
- Independent download for every successful conversion
- Unsupported, oversized, or corrupt files do not stop the rest of the batch

### Data tools
- CSV → JSON
- JSON → CSV
- Copy converted output
- Download converted `.json` and `.csv` files
- 1 MB pasted-data guardrail for browser responsiveness

## Why I built it

Many conversion websites upload files to a remote service even when a browser can perform a lightweight conversion itself. ConvertLab explores a local-first alternative for supported formats.

The goal is not to claim support for every possible file type. It is to make common conversions fast, understandable, and privacy-conscious when client-side processing is practical.

## Privacy architecture

For the current tools:
- selected files are processed by client-side JavaScript;
- there is no ConvertLab application backend;
- there is no account system or database;
- selected files are not intentionally sent to a ConvertLab conversion server.

The privacy messaging must be updated if future versions add analytics, third-party processing, uploads, or server-side conversion.

## QA & defensive behavior

The current implementation includes:
- MIME-type checks for supported images;
- image-size and output-dimension limits to reduce browser memory risk;
- sequential batch conversion instead of parallel full-resolution conversion;
- independent per-file batch errors so one bad file does not abort the queue;
- cleanup of temporary object URLs when results are cleared or the page unloads;
- safe text-only filename, status, and error rendering;
- filename sanitization for generated image downloads;
- CSV checks for unclosed quoted fields, empty/duplicate headers, and rows wider than the header;
- JSON validation requiring a non-empty array of objects;
- graceful clipboard fallback when the Clipboard API is unavailable.

This is static code QA and defensive validation. Cross-browser interactive testing with representative real files is still recommended before treating every edge case as verified.

## Technical decisions

- **Vanilla JavaScript** keeps the release lightweight.
- **Canvas API** handles supported raster image conversion and resizing.
- **File / Blob / Object URL APIs** enable local file handling and downloads.
- **Sequential batch processing** favors browser stability over maximum parallel throughput.
- **GitHub Pages** provides static hosting.
- **No AI or backend** is used where deterministic browser APIs already solve the problem.

## Tech stack

`HTML` · `CSS` · `JavaScript` · `Canvas API` · `File API` · `Blob API` · `GitHub Pages`

## Run locally

Clone or download the repository and open `index.html` in a modern browser. No build step or API key is required.

## Current limitations

- Large decoded images can still consume substantial browser memory even when the source file is under 25 MB.
- Batch processing is sequential, but successful output blobs remain available until the batch is cleared or the page unloads so users can download them individually.
- Browsers may limit or prompt around many separate downloads; ConvertLab does not silently auto-download every batch result.
- Duplicate source basenames can produce duplicate suggested output filenames; each result remains a separate download.
- SVG rendering can vary by browser and SVG contents.
- Aspect-ratio lock uses the source image ratio; turning it off allows deliberate stretching.
- CSV parsing supports quoted fields and escaped quotes but is not intended to replace a full spreadsheet parser.
- JSON → CSV expects a non-empty array of objects; nested values are serialized as JSON strings.
- Complex Office document, PDF, audio, video, OCR, and generative-AI workflows are not part of this release.

## Feature sequence

### 1. Better image workflow — shipped
- Drag-and-drop
- Aspect-ratio lock
- File-size and dimension guardrails
- Safer temporary URL cleanup

### 2. Real data downloads — shipped
- Download CSV → JSON output as `.json`
- Download JSON → CSV output as `.csv`

### 3. Batch image conversion — shipped
- Multiple compatible images in one session
- Per-file status and download
- Sequential memory-aware processing
- Per-file failure isolation

### 4. PDF & image utilities — later
- Research image → PDF using browser-local libraries
- Validate memory, browser compatibility, and bundle-size tradeoffs before shipping

### 5. Heavier conversion tracks — only if justified
Office documents, audio/video, OCR, and AI tools should be separate capability tracks because they may require WebAssembly, server infrastructure, third-party APIs, usage limits, or cost controls.

## Product principle

**Use local browser capabilities first. Add server infrastructure only when the conversion actually requires it.**

## Author

Built by [Nikhil Reddy Chitkula](https://github.com/Nikhilr23) as part of a portfolio of healthcare IT, cybersecurity, browser-first products, and practical utility tools.