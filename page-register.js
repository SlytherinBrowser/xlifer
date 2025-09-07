import { auth } from './firebase-init.js';
import { createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { ensureUserDoc } from './users.js';
import { fileToBase64, $ } from './ui.js';

$('#registerBtn').addEventListener('click', async ()=>{
  const name = $('#regName').value.trim();
  const email = $('#regEmail').value.trim();
  const pass = $('#regPass').value.trim();
  const pass2 = $('#regPass2').value.trim();
  if(!name||!email||!pass||pass!==pass2) return alert('Preveri polja.');
  try{
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    let photoBase64=''; const f = $('#regAvatar').files?.[0]; if(f) photoBase64 = await fileToBase64(f);
    await updateProfile(cred.user, { displayName:name, photoURL:photoBase64||null });
    await ensureUserDoc(cred.user, { photoBase64 });
    location.replace('feed.html');
  }catch(e){ alert(e.message); }
});
