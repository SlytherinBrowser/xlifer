import { db } from './firebase-init.js';
import { collection, addDoc, query, where, orderBy, onSnapshot, doc, serverTimestamp, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

export async function createPost(currentUser, userDoc, text, imageBase64){
  const isPublic = userDoc?.publicProfile !== false;
  await addDoc(collection(db,'posts'),{
    uid: currentUser.uid,
    authorName: userDoc?.name || currentUser.displayName || 'Uporabnik',
    authorPhoto: userDoc?.photoBase64 || currentUser.photoURL || '',
    text, imageBase64, public: isPublic, createdAt: serverTimestamp()
  });
}

export function subscribePublicPosts(cb){
  return onSnapshot(query(collection(db,'posts'), where('public','==',true), orderBy('createdAt','desc')), s=>{
    const arr = []; s.forEach(d=>arr.push({id:d.id, ...d.data()})); cb(arr);
  });
}

export function subscribeUserPosts(uid, cb){
  return onSnapshot(query(collection(db,'posts'), where('uid','==',uid), orderBy('createdAt','desc')), s=>{
    const arr = []; s.forEach(d=>arr.push({id:d.id, ...d.data()})); cb(arr);
  });
}

export async function getFriendUids(uid){
  const q1 = await getDocs(query(collection(db,'friends'), where('a','==',uid)));
  const q2 = await getDocs(query(collection(db,'friends'), where('b','==',uid)));
  const ids = new Set(); q1.forEach(d=>ids.add(d.data().b)); q2.forEach(d=>ids.add(d.data().a));
  return Array.from(ids);
}
