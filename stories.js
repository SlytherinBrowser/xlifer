import { db } from './firebase-init.js';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

export function subscribeStories(cb){
  return onSnapshot(query(collection(db,'stories'), orderBy('createdAt','desc')), s=>{
    const now = Date.now(); const arr=[];
    s.forEach(d=>{ const st=d.data(); const exp=st.expiresAt?.toMillis?.()||0; if(!exp || exp>=now) arr.push({id:d.id, ...st}); });
    cb(arr);
  });
}

export async function addStory(currentUser, userDoc, imageBase64){
  const expires = new Date(Date.now()+24*60*60*1000);
  await addDoc(collection(db,'stories'),{
    uid: currentUser.uid,
    authorName: userDoc?.name || currentUser.displayName || '',
    imageBase64,
    createdAt: serverTimestamp(),
    expiresAt: expires
  });
}
