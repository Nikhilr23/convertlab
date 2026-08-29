# ConvertLab

### Private, browser-first conversion and file utilities

**Live:** https://nikhilr23.github.io/convertlab/

ConvertLab is a lightweight conversion toolkit for common image and structured-data tasks that can be handled locally in a modern browser. The current release intentionally avoids accounts, databases, file-upload APIs, and a conversion backend.

> **Your file → your browser → your download**

## Available now

### Image tools
- PNG / JPG / WebP / SVG input
- PNG, JPG, or WebP output
- Image resizing
- Adjustable JPG/WebP quality

### Data tools
- CSV → JSON
- JSON → CSV
- Copy converted output directly from the browser

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

## Technical decisions

ConvertLab deliberately starts small:

- **Vanilla JavaScript** keeps the first release lightweight.
- **Canvas API** handles supported raster image conversion and resizing.
- **File / Blob / Object URL APIs** enable local file handling and downloads.
- **GitHub Pages** provides static hosting.
- **No AI or backend** is used where deterministic browser APIs already solve the problem.

## Tech stack

`HTML` · `CSS` · `JavaScript` · `Canvas API` · `File API` · `Blob API` · `GitHub Pages`

## Run locally

Clone or download the repository and open `index.html` in a modern browser. No build step or API key is required.

## Current limitations

- Large images can consume significant browser memory.
- SVG rendering can vary by browser and SVG contents.
- Resizing currently accepts explicit width and height values rather than automatically locking aspect ratio.
- CSV parsing supports quoted fields and escaped quotes but is not intended to replace a full spreadsheet parser.
- JSON → CSV expects a non-empty array of objects; nested values are serialized as JSON strings.
- Complex Office document, PDF, audio, video, OCR, and generative-AI workflows are not part of this release.

## Roadmap

Potential additions should be validated before implementation:

- Drag-and-drop and batch image conversion
- Aspect-ratio lock
- Downloadable CSV/JSON output files
- TXT ↔ Markdown utilities
- Additional image optimization controls
- Browser-local PDF utilities where conversion is reliable
- Separate document, audio/video, and AI tool tracks only when their infrastructure requirements justify them

## Product principle

**Use local browser capabilities first. Add server infrastructure only when the conversion actually requires it.**

## Author

Built by [Nikhil Reddy Chitkula](https://github.com/Nikhilr23) as part of a portfolio of healthcare IT, cybersecurity, browser-first products, and practical utility tools.