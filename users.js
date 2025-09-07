import { db } from './firebase-init.js';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

export async function ensureUserDoc(u, extra={}){
  const ref = doc(db,'users', u.uid);
  const snap = await getDoc(ref);
  if(!snap.exists()){
    await setDoc(ref,{
      uid: u.uid, name: u.displayName || u.email, email: u.email,
      photoBase64: u.photoURL || '', bio:'', publicProfile:true,
      friendsCount:0, postsCount:0, createdAt: serverTimestamp(), ...extra
    });
  }
  return ref;
}
export async function getUser(uid){ return (await getDoc(doc(db,'users',uid))).data(); }
export async function updateUser(uid, data){ return updateDoc(doc(db,'users',uid), data); }
