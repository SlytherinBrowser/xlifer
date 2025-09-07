import { auth } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { db } from './firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { fileToBase64 } from './ui.js';
import { subscribeChats, openChat, subscribeMessages, sendMessage, startDirectChat, startGroupChat } from './chat_api.js';

let me=null, userDoc=null, activeChatId=null;
onAuthStateChanged(auth, async (u)=>{
  me=u; if(!u) return;
  userDoc = (await getDoc(doc(db,'users',u.uid))).data();
  subscribeChats(me.uid, (chats)=>{
    const box = document.getElementById('chatList'); box.innerHTML='';
    chats.forEach(c=>{
      const el=document.createElement('div'); el.className='card';
      el.innerHTML=`<div class="row" style="cursor:pointer"><strong>${(c.name||'Pogovor')}</strong><small class="muted" style="margin-left:auto">${new Date(c.updatedAt?.toMillis?.()||Date.now()).toLocaleString()}</small></div>`;
      el.addEventListener('click', ()=> openChatView(c.id, c.name||'Pogovor'));
      box.appendChild(el);
    });
  });
});

async function openChatView(chatId, title){
  activeChatId = chatId; document.getElementById('chatTitle').textContent = title; document.getElementById('messages').innerHTML='';
  const cdata = await openChat(chatId); document.getElementById('chatMembers').textContent = 'Člani: '+(cdata?.members?.length||1);
  subscribeMessages(chatId, msgs=>{
    const box = document.getElementById('messages'); box.innerHTML='';
    msgs.forEach(m=>{
      const row=document.createElement('div'); row.className='card';
      row.innerHTML = `<div class="row"><span class="pill">${(m.fromName||m.from)}</span></div>${m.text?`<div style="margin-top:6px">${(m.text)}</div>`:''}${m.imageBase64?`<img class="feed-img" src="${m.imageBase64}">`:''}`;
      box.appendChild(row); box.scrollTop = box.scrollHeight;
    });
  });
}

document.getElementById('sendMsgBtn').addEventListener('click', async ()=>{
  if(!activeChatId) return;
  const text = document.getElementById('msgInput').value.trim(); let img=''; const f=document.getElementById('msgImage').files?.[0]; if(f) img = await fileToBase64(f);
  await sendMessage(activeChatId, me.uid, userDoc?.name||me.displayName||'', text, img);
  document.getElementById('msgInput').value=''; document.getElementById('msgImage').value='';
});

document.getElementById('newDirectBtn').addEventListener('click', async ()=>{
  const email = prompt('Vnesi email osebe:'); if(!email) return;
  const { collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
  const q = await getDocs(query(collection(db,'users'), where('email','==',email)));
  if(q.empty) return alert('Ni uporabnika.');
  const other = q.docs[0].data();
  const id = await startDirectChat(me.uid, other.uid);
  openChatView(id, '1‑na‑1');
});

document.getElementById('newGroupBtn').addEventListener('click', async ()=>{
  const emailsStr = prompt('Vnesi emaile članov, ločene z vejicami:'); if(!emailsStr) return;
  const id = await startGroupChat(me.uid, emailsStr.split(',').map(s=>s.trim()).filter(Boolean));
  openChatView(id, 'Skupinski chat');
});
