import { auth } from './firebase-init.js';
import { onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { db } from './firebase-init.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { fileToBase64 } from './ui.js';

let currentUser=null, userDoc=null;
onAuthStateChanged(auth, async (u)=>{
  currentUser = u; if(!u) return;
  userDoc = (await getDoc(doc(db,'users',u.uid))).data();
  document.getElementById('profileName').value = userDoc?.name||'';
  document.getElementById('profileBio').value = userDoc?.bio||'';
  document.getElementById('profilePublic').checked = userDoc?.publicProfile !== false;
  document.getElementById('profileAvatar').src = userDoc?.photoBase64 || u.photoURL || 'avatar-placeholder.svg';
});

document.getElementById('saveProfileBtn').addEventListener('click', async ()=>{
  if(!currentUser) return;
  const name = document.getElementById('profileName').value.trim();
  const bio = document.getElementById('profileBio').value.trim();
  const publicProfile = document.getElementById('profilePublic').checked;
  let photoBase64=null; const f=document.getElementById('profilePicFile').files?.[0]; if(f) photoBase64 = await fileToBase64(f);
  const upd={ name, bio, publicProfile }; if(photoBase64) upd.photoBase64 = photoBase64;
  await updateDoc(doc(db,'users',currentUser.uid), upd);
  await updateProfile(currentUser,{ displayName:name, photoURL: photoBase64 || currentUser.photoURL || null });
  alert('Profil shranjen.');
});
