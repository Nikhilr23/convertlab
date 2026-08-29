const $ = (id) => document.getElementById(id);

const imageInput = $('imageInput');
const imageFormat = $('imageFormat');
const imageWidth = $('imageWidth');
const imageHeight = $('imageHeight');
const imageQuality = $('imageQuality');
const qualityValue = $('qualityValue');
const imageResult = $('imageResult');
const imageDownload = $('imageDownload');
const imageError = $('imageError');
let currentDownloadUrl = null;

imageQuality.addEventListener('input', () => {
  qualityValue.textContent = `${Math.round(Number(imageQuality.value) * 100)}%`;
});

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  const label = document.querySelector('.file-zone strong');
  if (file) label.textContent = file.name;
});

$('convertImageBtn').addEventListener('click', async () => {
  imageError.textContent = '';
  imageResult.classList.add('hidden');
  const file = imageInput.files[0];
  if (!file) {
    imageError.textContent = 'Choose an image first.';
    return;
  }
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
    imageError.textContent = 'Unsupported image type. Try PNG, JPG, WebP, or SVG.';
    return;
  }

  try {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.decoding = 'async';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = objectUrl;
    });

    const requestedWidth = Number(imageWidth.value) || img.naturalWidth;
    const requestedHeight = Number(imageHeight.value) || img.naturalHeight;
    if (requestedWidth < 1 || requestedHeight < 1 || requestedWidth > 12000 || requestedHeight > 12000) {
      URL.revokeObjectURL(objectUrl);
      throw new Error('Use dimensions between 1 and 12,000 pixels.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = requestedWidth;
    canvas.height = requestedHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas processing is not available in this browser.');

    if (imageFormat.value === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, requestedWidth, requestedHeight);
    URL.revokeObjectURL(objectUrl);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, imageFormat.value, Number(imageQuality.value)));
    if (!blob) throw new Error('This browser could not create the requested output format.');

    if (currentDownloadUrl) URL.revokeObjectURL(currentDownloadUrl);
    currentDownloadUrl = URL.createObjectURL(blob);
    const extension = imageFormat.value === 'image/jpeg' ? 'jpg' : imageFormat.value.split('/')[1];
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'converted-image';
    const outputName = `${baseName}.${extension}`;

    imageDownload.href = currentDownloadUrl;
    imageDownload.download = outputName;
    $('imageResultName').textContent = outputName;
    $('imageMeta').textContent = `${requestedWidth} × ${requestedHeight} · ${formatBytes(blob.size)}`;
    imageResult.classList.remove('hidden');
  } catch (error) {
    imageError.textContent = error instanceof Error ? error.message : 'Could not convert this image.';
  }
});

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error('CSV contains an unclosed quoted field.');
  row.push(field);
  if (row.some((value) => value.length > 0)) rows.push(row);
  return rows;
}

$('csvToJsonBtn').addEventListener('click', () => {
  $('csvError').textContent = '';
  $('jsonOutput').value = '';
  try {
    const rows = parseCsv($('csvInput').value.trim());
    if (rows.length < 2) throw new Error('Add a header row and at least one data row.');
    const headers = rows[0].map((h) => h.trim());
    if (headers.some((h) => !h)) throw new Error('Every CSV column needs a header.');
    if (new Set(headers).size !== headers.length) throw new Error('CSV headers must be unique.');
    const data = rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])));
    $('jsonOutput').value = JSON.stringify(data, null, 2);
  } catch (error) {
    $('csvError').textContent = error.message || 'Could not parse the CSV.';
  }
});

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

$('jsonToCsvBtn').addEventListener('click', () => {
  $('jsonError').textContent = '';
  $('csvOutput').value = '';
  try {
    const parsed = JSON.parse($('jsonInput').value);
    if (!Array.isArray(parsed) || parsed.length === 0 || parsed.some((item) => !item || Array.isArray(item) || typeof item !== 'object')) {
      throw new Error('Use a non-empty JSON array of objects.');
    }
    const headers = [...new Set(parsed.flatMap((item) => Object.keys(item)))];
    const lines = [headers.map(csvEscape).join(',')];
    parsed.forEach((item) => lines.push(headers.map((header) => csvEscape(item[header])).join(',')));
    $('csvOutput').value = lines.join('\n');
  } catch (error) {
    $('jsonError').textContent = error.message || 'Could not parse the JSON.';
  }
});

async function copyOutput(id, buttonId, defaultLabel) {
  const value = $(id).value;
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    $(buttonId).textContent = 'Copied ✓';
    setTimeout(() => { $(buttonId).textContent = defaultLabel; }, 1300);
  } catch {
    $(id).focus();
    $(id).select();
    $(buttonId).textContent = 'Select & copy';
  }
}

$('copyJsonBtn').addEventListener('click', () => copyOutput('jsonOutput', 'copyJsonBtn', 'Copy JSON'));
$('copyCsvBtn').addEventListener('click', () => copyOutput('csvOutput', 'copyCsvBtn', 'Copy CSV'));

window.addEventListener('beforeunload', () => {
  if (currentDownloadUrl) URL.revokeObjectURL(currentDownloadUrl);
});