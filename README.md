# ConvertLab

**Private, browser-first file conversion utilities.**

ConvertLab is a lightweight toolkit for common conversions that can be handled locally in a modern browser. The MVP intentionally avoids accounts, a database, file-upload APIs, and a conversion backend.

## V1 tools

- PNG / JPG / WebP / SVG input → PNG, JPG, or WebP output
- Image resizing
- Adjustable JPG/WebP quality
- CSV → JSON
- JSON → CSV

## Product idea

Many conversion sites require users to upload a file even when the browser itself can perform the conversion. ConvertLab explores a simpler model:

**Your file → your browser → your download**

For the current tools, selected files are processed locally by client-side JavaScript and are not intentionally sent to a conversion server.

## Why the scope is intentionally small

Complex Word/PDF conversion, arbitrary audio/video transcoding, OCR, and generative AI require different libraries or server infrastructure. V1 does not claim to support formats it cannot convert reliably in-browser.

## Tech

- HTML
- CSS
- Vanilla JavaScript
- Canvas API
- File / Blob / Object URL browser APIs
- GitHub Pages

## Run locally

Open `index.html` in a modern browser. No build step or API key is required.

## Limitations

- Large images can consume significant browser memory.
- SVG rendering support can vary by browser and SVG contents.
- Image resizing uses explicit width and height values; it does not currently lock aspect ratio automatically.
- CSV parsing supports quoted fields and escaped quotes, but this is a focused utility rather than a full spreadsheet engine.
- JSON → CSV expects a non-empty array of objects. Nested values are serialized as JSON strings.

## Roadmap

Potential additions should be validated before implementation:

- Aspect-ratio lock for image resizing
- Drag-and-drop and batch image conversion
- TXT ↔ Markdown utilities
- Additional image optimization controls
- Downloadable CSV/JSON files
- PDF utilities where browser-local processing is reliable

AI image/audio/video generation is deliberately considered a separate future product area because it requires model APIs, cost controls, and server-side secrets.

## Privacy

ConvertLab V1 has no application backend. Do not add analytics, third-party upload services, or external processing without updating the privacy messaging to match the actual architecture.

## License

Built as a portfolio and product experiment by Nikhil Reddy Chitkula.