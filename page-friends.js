import { auth } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { searchUsers, sendFriendRequest, listFriends, listRequestsFor, acceptRequest, declineRequest } from './friends_api.js';

let me=null;
onAuthStateChanged(auth, async (u)=>{ me=u; if(!u) return; await render(); });

async function render(){
  const fl = document.getElementById('friendsList'); fl.innerHTML='';
  const friends = await listFriends(me.uid);
  friends.forEach(u=>{
    const c=document.createElement('div'); c.className='card';
    c.innerHTML=`<div class="row"><img class="avatar" src="${u.photoBase64||''}" onerror="this.style.visibility='hidden'"> <div class="col" style="flex:1"><strong>${(u.name||u.email)}</strong><small class="muted">${(u.email||'')}</small></div><a class="btn" href="chat.html">Pogovor</a></div>`;
    fl.appendChild(c);
  });

  const box = document.getElementById('requestsList'); box.innerHTML='';
  const reqs = await listRequestsFor(me.uid);
  reqs.forEach(r=>{
    const c=document.createElement('div'); c.className='card';
    c.innerHTML=`<div class="row"><img class="avatar" src="${r.user?.photoBase64||''}" onerror="this.style.visibility='hidden'"> <div class="col" style="flex:1"><strong>${(r.user?.name||r.user?.email||'')}</strong><small class="muted">želi biti prijatelj</small></div><div class="row" style="gap:6px"><button class="btn primary" data-acc="${r.id}" data-from="${r.from}">Sprejmi</button><button class="btn ghost" data-dec="${r.id}">Zavrni</button></div></div>`;
    box.appendChild(c);
  });
  box.querySelectorAll('[data-acc]').forEach(b=> b.addEventListener('click', async ()=>{ await acceptRequest(b.dataset.acc, me.uid, b.dataset.from); await render(); }));
  box.querySelectorAll('[data-dec]').forEach(b=> b.addEventListener('click', async ()=>{ await declineRequest(b.dataset.dec); await render(); }));
}

document.getElementById('searchUser').addEventListener('input', async (e)=>{
  const term = e.target.value.trim(); const box = document.getElementById('searchResults'); box.innerHTML=''; if(!term) return;
  const results = await searchUsers(term);
  const seen=new Set();
  results.forEach(u=>{
    if(seen.has(u.uid) || u.uid === me?.uid) return; seen.add(u.uid);
    const c=document.createElement('div'); c.className='card';
    c.innerHTML=`<div class="row"><img class="avatar" src="${u.photoBase64||''}" onerror="this.style.visibility='hidden'"> <div class="col" style="flex:1"><strong>${(u.name||u.email)}</strong><small class="muted">${(u.email||'')}</small></div><button class="btn" data-add="${u.uid}">Dodaj</button></div>`;
    box.appendChild(c);
  });
  box.querySelectorAll('[data-add]').forEach(b=> b.addEventListener('click', async ()=>{ await sendFriendRequest(me.uid, b.dataset.add); alert('Prošnja poslana.'); }));
});
