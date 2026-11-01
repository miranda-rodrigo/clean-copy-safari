(function(root){
 const defaults={format:'markdown',clean:true,selection:true};
 function cleanURL(raw,enabled=true){
  const u=new URL(raw);
  if(!['https:','http:'].includes(u.protocol)) throw Error('Open a regular HTTP or HTTPS webpage first.');
  // Signed URLs must retain their exact query encoding and parameters.
  if(!enabled || [...u.searchParams.keys()].some(k=>/^(x-amz-|x-goog-|signature$|sig$|token$)/i.test(k))) return raw;
  const kept=u.search.slice(1).split('&').filter(Boolean).filter(pair=>{
   let key;try{key=decodeURIComponent(pair.split('=')[0].replace(/\+/g,' '));}catch{return true;}
   return !/^(utm_.+|fbclid|gclid|dclid|msclkid|igshid|mc_cid|mc_eid)$/i.test(key);
  });
  // Retain original encoding, order and fragment for every remaining field.
  return raw.split(/[?#]/)[0]+(kept.length?'?'+kept.join('&'):'')+u.hash;
 }
 function title(text,url){
  const host=new URL(url).hostname;
  let t=(text||host).trim();
  if(/(^|\.)bibliaonline\.com\.br$/.test(host)) t=t.replace(/\s*\|\s*Bíblia Online\s*$/i,'').replace(/\s*\|\s*/g,' · ');
  return t;
 }
 const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const md=s=>s.replace(/[\\\[\]*_`]/g,'\\$&').replace(/\r?\n/g,' ');
 function format(data,mode='markdown'){
  const url=cleanURL(data.url,false), t=data.title||url,q=data.quote||'';
  const dest=url.replace(/</g,'%3C').replace(/>/g,'%3E').replace(/\(/g,'%28').replace(/\)/g,'%29').replace(/ /g,'%20');
  const link=`[${md(t)}](<${dest}>)`;
  const plain=q?`${q}\n\n${t}\n${url}`:`${t}\n${url}`;
  const html=(q?`<blockquote>${esc(q).replace(/\n/g,'<br>')}</blockquote>`:'')+`<p><a href="${esc(url)}">${esc(t)}</a></p>`;
  return {text:mode==='markdown'?(q?q.split('\n').map(l=>'> '+l).join('\n')+'\n\n— '+link:link):plain,html:mode==='rich'?html:null};
 }
 const api={defaults,cleanURL,title,format};root.CleanCopy=api;
 if(typeof module!=='undefined') module.exports=api;
})(globalThis);
