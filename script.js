const $ = (id) => document.getElementById(id);
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const MAX_DIMENSION = 12000;
const imageInput=$('imageInput'), imageFormat=$('imageFormat'), imageWidth=$('imageWidth'), imageHeight=$('imageHeight'), imageQuality=$('imageQuality'), qualityValue=$('qualityValue'), imageResult=$('imageResult'), imageDownload=$('imageDownload'), imageError=$('imageError'), lockAspect=$('lockAspect'), dropZone=$('imageDropZone');
let currentDownloadUrl=null;
let sourceDimensions=null;
let dimensionUpdate=false;

imageQuality.addEventListener('input',()=>{qualityValue.textContent=`${Math.round(Number(imageQuality.value)*100)}%`;});

function clearImageResult(){
  imageError.textContent='';
  imageResult.classList.add('hidden');
  if(currentDownloadUrl){URL.revokeObjectURL(currentDownloadUrl);currentDownloadUrl=null;}
  imageDownload.removeAttribute('href');
}

async function readImageDimensions(file){
  const objectUrl=URL.createObjectURL(file);
  try{
    const img=new Image();
    img.decoding='async';
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('The selected image could not be decoded.'));img.src=objectUrl;});
    return {width:img.naturalWidth,height:img.naturalHeight};
  }finally{URL.revokeObjectURL(objectUrl);}
}

async function handleSelectedFile(file){
  clearImageResult();
  sourceDimensions=null;
  if(!file)return;
  if(!['image/png','image/jpeg','image/webp','image/svg+xml'].includes(file.type)){imageError.textContent='Unsupported image type. Try PNG, JPG, WebP, or SVG.';return;}
  if(file.size>MAX_IMAGE_BYTES){imageError.textContent='For browser stability, choose an image no larger than 25 MB.';return;}
  document.querySelector('.file-zone strong').textContent=file.name;
  try{sourceDimensions=await readImageDimensions(file);}catch(error){imageError.textContent=error.message||'Could not read this image.';}
}

imageInput.addEventListener('change',()=>handleSelectedFile(imageInput.files[0]));

['dragenter','dragover'].forEach(type=>dropZone.addEventListener(type,event=>{event.preventDefault();event.stopPropagation();dropZone.classList.add('drag-active');}));
['dragleave','drop'].forEach(type=>dropZone.addEventListener(type,event=>{event.preventDefault();event.stopPropagation();dropZone.classList.remove('drag-active');}));
dropZone.addEventListener('drop',event=>{
  const file=event.dataTransfer?.files?.[0];
  if(!file)return;
  const transfer=new DataTransfer();transfer.items.add(file);imageInput.files=transfer.files;handleSelectedFile(file);
});

function syncAspect(changed){
  if(dimensionUpdate||!lockAspect.checked||!sourceDimensions)return;
  const width=Number(imageWidth.value),height=Number(imageHeight.value);
  dimensionUpdate=true;
  if(changed==='width'&&width>0)imageHeight.value=Math.max(1,Math.round(width*sourceDimensions.height/sourceDimensions.width));
  if(changed==='height'&&height>0)imageWidth.value=Math.max(1,Math.round(height*sourceDimensions.width/sourceDimensions.height));
  dimensionUpdate=false;
}
imageWidth.addEventListener('input',()=>syncAspect('width'));
imageHeight.addEventListener('input',()=>syncAspect('height'));

$('convertImageBtn').addEventListener('click',async()=>{
  clearImageResult();
  const file=imageInput.files[0];
  if(!file){imageError.textContent='Choose an image first.';return;}
  if(!['image/png','image/jpeg','image/webp','image/svg+xml'].includes(file.type)){imageError.textContent='Unsupported image type. Try PNG, JPG, WebP, or SVG.';return;}
  if(file.size>MAX_IMAGE_BYTES){imageError.textContent='For browser stability, choose an image no larger than 25 MB.';return;}
  let objectUrl=null;
  try{
    objectUrl=URL.createObjectURL(file);
    const img=new Image();img.decoding='async';
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('The selected image could not be decoded.'));img.src=objectUrl;});
    const widthValue=Number(imageWidth.value),heightValue=Number(imageHeight.value);
    let requestedWidth=widthValue||img.naturalWidth;
    let requestedHeight=heightValue||img.naturalHeight;
    if(lockAspect.checked){
      if(widthValue&&!heightValue)requestedHeight=Math.round(requestedWidth*img.naturalHeight/img.naturalWidth);
      else if(heightValue&&!widthValue)requestedWidth=Math.round(requestedHeight*img.naturalWidth/img.naturalHeight);
    }
    if(!Number.isFinite(requestedWidth)||!Number.isFinite(requestedHeight)||requestedWidth<1||requestedHeight<1||requestedWidth>MAX_DIMENSION||requestedHeight>MAX_DIMENSION)throw new Error('Use dimensions between 1 and 12,000 pixels.');
    const canvas=document.createElement('canvas');canvas.width=Math.round(requestedWidth);canvas.height=Math.round(requestedHeight);
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas processing is not available in this browser.');
    if(imageFormat.value==='image/jpeg'){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);}
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,imageFormat.value,Number(imageQuality.value)));
    if(!blob)throw new Error('This browser could not create the requested output format.');
    currentDownloadUrl=URL.createObjectURL(blob);
    const extension=imageFormat.value==='image/jpeg'?'jpg':imageFormat.value.split('/')[1];
    const baseName=(file.name.replace(/\.[^.]+$/,'')||'converted-image').replace(/[\\/:*?"<>|]/g,'-');
    const outputName=`${baseName}.${extension}`;
    imageDownload.href=currentDownloadUrl;imageDownload.download=outputName;$('imageResultName').textContent=outputName;$('imageMeta').textContent=`${canvas.width} × ${canvas.height} · ${formatBytes(blob.size)}`;imageResult.classList.remove('hidden');
  }catch(error){imageError.textContent=error instanceof Error?error.message:'Could not convert this image.';}
  finally{if(objectUrl)URL.revokeObjectURL(objectUrl);}
});

function formatBytes(bytes){if(bytes<1024)return`${bytes} B`;if(bytes<1024*1024)return`${(bytes/1024).toFixed(1)} KB`;return`${(bytes/(1024*1024)).toFixed(2)} MB`;}

function parseCsv(text){
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i+=1){const char=text[i],next=text[i+1];if(char==='"'&&quoted&&next==='"'){field+='"';i+=1;}else if(char==='"'){quoted=!quoted;}else if(char===','&&!quoted){row.push(field);field='';}else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&next==='\n')i+=1;row.push(field);if(row.some(value=>value.length>0))rows.push(row);row=[];field='';}else field+=char;}
  if(quoted)throw new Error('CSV contains an unclosed quoted field.');row.push(field);if(row.some(value=>value.length>0))rows.push(row);return rows;
}

$('csvToJsonBtn').addEventListener('click',()=>{
  $('csvError').textContent='';$('jsonOutput').value='';
  try{const source=$('csvInput').value;if(source.length>1_000_000)throw new Error('Keep pasted CSV under 1 MB for this browser tool.');const rows=parseCsv(source.trim());if(rows.length<2)throw new Error('Add a header row and at least one data row.');const headers=rows[0].map(h=>h.trim());if(headers.some(h=>!h))throw new Error('Every CSV column needs a header.');if(new Set(headers).size!==headers.length)throw new Error('CSV headers must be unique.');if(rows.slice(1).some(row=>row.length>headers.length))throw new Error('A CSV row has more values than the header row.');const data=rows.slice(1).map(row=>Object.fromEntries(headers.map((header,index)=>[header,row[index]??''])));$('jsonOutput').value=JSON.stringify(data,null,2);}catch(error){$('csvError').textContent=error.message||'Could not parse the CSV.';}
});

function csvEscape(value){if(value===null||value===undefined)return'';const text=typeof value==='object'?JSON.stringify(value):String(value);return/[",\n\r]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;}
$('jsonToCsvBtn').addEventListener('click',()=>{
  $('jsonError').textContent='';$('csvOutput').value='';
  try{const source=$('jsonInput').value;if(source.length>1_000_000)throw new Error('Keep pasted JSON under 1 MB for this browser tool.');const parsed=JSON.parse(source);if(!Array.isArray(parsed)||parsed.length===0||parsed.some(item=>!item||Array.isArray(item)||typeof item!=='object'))throw new Error('Use a non-empty JSON array of objects.');const headers=[...new Set(parsed.flatMap(item=>Object.keys(item)))];if(!headers.length)throw new Error('JSON objects need at least one property.');const lines=[headers.map(csvEscape).join(',')];parsed.forEach(item=>lines.push(headers.map(header=>csvEscape(item[header])).join(',')));$('csvOutput').value=lines.join('\n');}catch(error){$('jsonError').textContent=error.message||'Could not parse the JSON.';}
});

async function copyOutput(id,buttonId,defaultLabel){const value=$(id).value;if(!value)return;try{await navigator.clipboard.writeText(value);$(buttonId).textContent='Copied ✓';setTimeout(()=>{$(buttonId).textContent=defaultLabel;},1300);}catch{$(id).focus();$(id).select();$(buttonId).textContent='Select & copy';}}
function downloadText(id,filename,type){const value=$(id).value;if(!value)return;const url=URL.createObjectURL(new Blob([value],{type}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),0);}
$('copyJsonBtn').addEventListener('click',()=>copyOutput('jsonOutput','copyJsonBtn','Copy JSON'));
$('copyCsvBtn').addEventListener('click',()=>copyOutput('csvOutput','copyCsvBtn','Copy CSV'));
$('downloadJsonBtn').addEventListener('click',()=>downloadText('jsonOutput','converted-data.json','application/json;charset=utf-8'));
$('downloadCsvBtn').addEventListener('click',()=>downloadText('csvOutput','converted-data.csv','text/csv;charset=utf-8'));
window.addEventListener('beforeunload',()=>{if(currentDownloadUrl)URL.revokeObjectURL(currentDownloadUrl);});