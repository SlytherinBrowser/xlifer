import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { $ } from './ui.js';

$('#loginBtn').addEventListener('click', async ()=>{
  const email = $('#loginEmail').value.trim();
  const pass = $('#loginPass').value.trim();
  try{ await signInWithEmailAndPassword(auth, email, pass); location.replace('feed.html'); }
  catch(e){ alert(e.message); }
});
