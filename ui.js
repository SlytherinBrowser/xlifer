export const $ = (sel)=> document.querySelector(sel);
export const $$ = (sel)=> Array.from(document.querySelectorAll(sel));

export function setTheme(t){ document.body.setAttribute('data-theme', t); localStorage.setItem('xlifer-theme', t); }
export function getTheme(){ return localStorage.getItem('xlifer-theme')||'dark'; }
document.body.setAttribute('data-theme', getTheme());
const themeSel = document.getElementById('themeSelect');
if(themeSel){ themeSel.value = getTheme(); themeSel.addEventListener('change', e=> setTheme(e.target.value)); }

export function fileToBase64(file){
  return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });
}
export function escapeHtml(s){ return s?.replace(/[&<>\'\"]/g, c=>(({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"})[c]))||'' }
export function timeago(ts){
  const d = ts?.toDate ? ts.toDate() : (ts instanceof Date? ts : new Date(ts));
  const diff = Math.floor((Date.now()-d.getTime())/1000);
  const units=[[31536000,'leto'],[2592000,'mesec'],[604800,'teden'],[86400,'dan'],[3600,'ura'],[60,'min'],[1,'s']];
  for(const [sec,label] of units){ if(diff>=sec) return Math.floor(diff/sec)+" "+label+(Math.floor(diff/sec)>1&&label!=='s'?'i':'')+" nazaj"; }
  return 'zdaj';
}