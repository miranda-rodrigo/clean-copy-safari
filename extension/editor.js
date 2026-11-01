const $=id=>document.getElementById(id);
function data(){return {title:$('title').value,url:$('url').value,quote:$('quote').value};}
function preview(){try{$('preview').textContent=CleanCopy.format(data(),$('format').value).text;}catch(e){$('preview').textContent=e.message;}}
async function init(){
 const settings={...CleanCopy.defaults,...(await browser.storage.local.get('settings')).settings};
 $('defaultFormat').value=settings.format;$('clean').checked=settings.clean;$('selection').checked=settings.selection;
 const id=new URL(location.href).searchParams.get('draft');
 if(id){const key='draft-'+id;const d=(await browser.storage.local.get(key))[key];
 if(d){$('editor').hidden=false;for(const k of ['title','url','quote'])$(k).value=d[k]||'';$('format').value=d.format||settings.format;$('status').textContent=d.error||'';preview();await browser.storage.local.remove(key);}}
}
for(const id of ['title','url','quote','format'])$(id).addEventListener('input',preview);
$('save').addEventListener('click',async()=>{try{await browser.storage.local.set({settings:{format:$('defaultFormat').value,clean:$('clean').checked,selection:$('selection').checked}});$('saved').textContent='Saved.';}catch(e){$('saved').textContent=e.message;}});
$('copy').addEventListener('click',async()=>{
 try{const p=CleanCopy.format(data(),$('format').value);
 if(p.html){await navigator.clipboard.write([new ClipboardItem({'text/plain':new Blob([p.text],{type:'text/plain'}),'text/html':new Blob([p.html],{type:'text/html'})})]);}
 else await navigator.clipboard.writeText(p.text);
 $('status').textContent='Copied.';
 }catch(e){$('status').textContent='Copy was blocked. Select the preview text and press Command-C, or try Markdown format.';}
});
init().catch(e=>{$('saved').textContent=e.message;});
