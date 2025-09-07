import { db } from './firebase-init.js';
import { collection, addDoc, query, where, orderBy, onSnapshot, doc, getDoc, serverTimestamp, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

export function subscribeChats(myUid, cb){
  return onSnapshot(query(collection(db,'chats'), where('members','array-contains', myUid), orderBy('updatedAt','desc')), s=>{
    const arr=[]; s.forEach(d=>arr.push({id:d.id, ...d.data()})); cb(arr);
  });
}

export async function openChat(chatId){
  return (await getDoc(doc(db,'chats', chatId))).data();
}

export function subscribeMessages(chatId, cb){
  return onSnapshot(query(collection(db,'chats',chatId,'messages'), orderBy('createdAt','asc')), s=>{
    const arr=[]; s.forEach(d=>arr.push(d.data())); cb(arr);
  });
}

export async function sendMessage(chatId, fromUid, fromName, text, imageBase64){
  await addDoc(collection(db,'chats',chatId,'messages'),{ from: fromUid, fromName, text, imageBase64, createdAt: serverTimestamp() });
  await updateDoc(doc(db,'chats',chatId),{ updatedAt: serverTimestamp() });
}

export async function startDirectChat(myUid, otherUid){
  const ref = await addDoc(collection(db,'chats'),{ name:'1‑na‑1', isGroup:false, members:[myUid, otherUid], updatedAt: serverTimestamp() });
  return ref.id;
}

export async function startGroupChat(myUid, emails){
  const members=[myUid];
  for(const e of emails){ const q=await getDocs(query(collection(db,'users'), where('email','==',e))); if(!q.empty) members.push(q.docs[0].data().uid); }
  const name = prompt('Ime skupine?') || 'Skupinski chat';
  const ref = await addDoc(collection(db,'chats'),{ name, isGroup:true, members: Array.from(new Set(members)), updatedAt: serverTimestamp() });
  return ref.id;
}
