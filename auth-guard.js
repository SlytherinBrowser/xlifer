import { auth } from './firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

const PROTECTED = new Set(['feed.html','profile.html','friends.html','chat.html']);
function page(){ return location.pathname.split('/').pop() || 'index.html'; }
function go(url){ if(location.pathname.endsWith(url)) return; location.replace(url); }

onAuthStateChanged(auth, (user)=>{
  const p = page();
  if(PROTECTED.has(p) && !user) return go('login.html');
  if((p==='login.html' || p==='register.html' || p==='index.html') && user) return go('feed.html');
});

const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn){ logoutBtn.addEventListener('click', ()=> signOut(auth)); }
