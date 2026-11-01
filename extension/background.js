const api=browser;
api.runtime.onInstalled.addListener(()=>{
 api.contextMenus.removeAll().then(()=>{
  for(const [id,title] of [['copy','Copy clean link'],['quote','Copy quotation with source'],['edit','Edit link before copying'],['settings','Clean Copy settings']])
   api.contextMenus.create({id,title,contexts:id==='quote'?['selection']:['page','selection','link']});
 });
});
async function editor(data,error=''){
 const id=crypto.randomUUID();
 await api.storage.local.set({['draft-'+id]:{...data,error}});
 await api.tabs.create({url:api.runtime.getURL('editor.html')+'?draft='+id});
}
async function run(tab,action='copy',info={}){
 let data;
 try{
  const settings={...CleanCopy.defaults,...(await api.storage.local.get('settings')).settings};
  let capture={};
  try{ [capture]=await api.tabs.executeScript(tab.id,{code:'({title:document.title,url:location.href,quote:window.getSelection().toString()})'}); }catch{}
  const raw=info.linkUrl||capture.url||tab.url;
  const linkTitle=info.linkUrl?(info.linkText||info.linkUrl):(capture.title||tab.title);
  data={title:CleanCopy.title(linkTitle,raw),url:CleanCopy.cleanURL(raw,settings.clean),quote:action==='quote'?(info.selectionText||capture.quote||''):(settings.selection&&!info.linkUrl?(capture.quote||''):''),format:settings.format};
  if(action==='edit') return editor(data);
  const payload=CleanCopy.format(data,settings.format);
  const code=`(${function(payload){
   const focused=document.activeElement, selection=window.getSelection();
   const ranges=[]; for(let i=0;i<selection.rangeCount;i++) ranges.push(selection.getRangeAt(i).cloneRange());
   const box=document.createElement('textarea');box.value=payload.text;box.style.cssText='position:fixed;left:-10000px;top:0';document.documentElement.appendChild(box);box.select();
   const handler=e=>{e.clipboardData.setData('text/plain',payload.text);if(payload.html)e.clipboardData.setData('text/html',payload.html);e.preventDefault();};
   document.addEventListener('copy',handler,true);
   let ok=false;try{ok=document.execCommand('copy');}finally{document.removeEventListener('copy',handler,true);box.remove();focused?.focus({preventScroll:true});selection.removeAllRanges();ranges.forEach(r=>selection.addRange(r));}
   return ok;
  }.toString()})(${JSON.stringify(payload)})`;
  const [ok]=await api.tabs.executeScript(tab.id,{code});
  if(!ok)throw Error('Safari needs a direct Copy click. Your link is ready below.');
  await api.browserAction.setBadgeText({tabId:tab.id,text:'✓'});
  setTimeout(()=>api.browserAction.setBadgeText({tabId:tab.id,text:''}).catch(()=>{}),1400);
 }catch(e){await editor(data||{title:tab.title||'',url:tab.url||'',quote:''},e.message);}
}
api.browserAction.onClicked.addListener(tab=>run(tab));
api.commands.onCommand.addListener(async command=>{const [tab]=await api.tabs.query({active:true,currentWindow:true});if(tab)run(tab,command==='edit-clean'?'edit':'copy');});
api.contextMenus.onClicked.addListener((info,tab)=>{if(info.menuItemId==='settings')api.runtime.openOptionsPage();else run(tab,info.menuItemId,info);});
