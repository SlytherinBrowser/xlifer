import { db } from './firebase-init.js';
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

export async function searchUsers(term){
  const results=[]; const seen=new Set();
  const byEmail = await getDocs(query(collection(db,'users'), where('email','==',term)));
  byEmail.forEach(d=>{ const u=d.data(); if(!seen.has(u.uid)){ seen.add(u.uid); results.push(u);} });
  const byName = await getDocs(query(collection(db,'users'), where('name','>=',term), where('name','<=',term+'\uf8ff')));
  byName.forEach(d=>{ const u=d.data(); if(!seen.has(u.uid)){ seen.add(u.uid); results.push(u);} });
  return results;
}

export async function sendFriendRequest(fromUid, toUid){
  await addDoc(collection(db,'friendRequests'),{ from: fromUid, to: toUid, createdAt: serverTimestamp(), status:'pending' });
}

export async function getFriendUids(uid){
  const q1 = await getDocs(query(collection(db,'friends'), where('a','==',uid)));
  const q2 = await getDocs(query(collection(db,'friends'), where('b','==',uid)));
  const ids = new Set(); q1.forEach(d=>ids.add(d.data().b)); q2.forEach(d=>ids.add(d.data().a));
  return Array.from(ids);
}

export async function listFriends(uid){
  const ids = await getFriendUids(uid); const out=[];
  for(const id of ids){ const u=(await getDoc(doc(db,'users',id))).data(); if(u) out.push(u); }
  return out;
}

export async function listRequestsFor(uid){
  const rq = await getDocs(query(collection(db,'friendRequests'), where('to','==',uid), where('status','==','pending')));
  const arr=[]; for(const d of rq.docs){ const r=d.data(); const u=(await getDoc(doc(db,'users',r.from))).data(); arr.push({id:d.id, from:r.from, user:u}); }
  return arr;
}

export async function acceptRequest(reqId, meUid, otherUid){
  await addDoc(collection(db,'friends'),{ a: meUid, b: otherUid, createdAt: serverTimestamp() });
  await updateDoc(doc(db,'friendRequests',reqId),{ status:'accepted' });
}
export async function declineRequest(reqId){ await updateDoc(doc(db,'friendRequests',reqId),{ status:'declined' }); }
