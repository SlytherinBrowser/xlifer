import { auth } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { db } from './firebase-init.js';
import { doc, getDoc, onSnapshot, collection, where, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { fileToBase64, $, escapeHtml, timeago } from './ui.js';
import { subscribeStories, addStory } from './stories.js';
import { createPost, subscribePublicPosts, subscribeUserPosts } from './posts.js';
import { getFriendUids as getFriendUidsPosts } from './posts.js';

let currentUser=null, userDoc=null;
onAuthStateChanged(auth, async (u)=>{
  currentUser = u;
  if(!u) return;
  const us = await getDoc(doc(db,'users',u.uid)); userDoc = us.data();
  document.getElementById('sideName').textContent = userDoc?.name || u.displayName || 'Uporabnik';
  document.getElementById('sideEmail').textContent = userDoc?.email || u.email || '';
  document.getElementById('sideAvatar').src = userDoc?.photoBase64 || u.photoURL || 'avatar-placeholder.svg';
  document.getElementById('countPosts').textContent = userDoc?.postsCount || 0;
  document.getElementById('countFriends').textContent = userDoc?.friendsCount || 0;

  subscribeStories(stories=>{
    const host = document.getElementById('storiesStrip'); host.innerHTML='';
    stories.forEach(st=>{ const el=document.createElement('div'); el.className='story'; el.innerHTML=`<img class="story-img" src="${st.imageBase64}"><div class="muted" style="margin-top:4px">${escapeHtml(st.authorName||'')}</div>`; host.appendChild(el); });
  });

  const feedMap = new Map();
  const render = ()=>{
    const list = Array.from(feedMap.values()).sort((a,b)=> (b.createdAt?.toMillis?.()||0)-(a.createdAt?.toMillis?.()||0));
    const host = document.getElementById('feedList'); host.innerHTML='';
    const onlyPublic = document.getElementById('showPublicOnly').checked;
    list.filter(p=> !onlyPublic || p.public).forEach(p=>{
      const card=document.createElement('div'); card.className='card';
      card.innerHTML = `
        <div class="row">
          <img class="avatar" src="${p.authorPhoto||''}" onerror="this.style.visibility='hidden'">
          <div class="col" style="flex:1;gap:2px">
            <strong>${escapeHtml(p.authorName||'Uporabnik')}</strong>
            <small class="muted">${timeago(p.createdAt)}</small>
          </div>
          ${p.public?'<span class="pill">Javno</span>':'<span class="pill">Samo prijatelji</span>'}
        </div>
        ${p.text?`<p style="white-space:pre-wrap">${escapeHtml(p.text)}</p>`:''}
        ${p.imageBase64?`<img class="feed-img" src="${p.imageBase64}">`:''}
      `;
      host.appendChild(card);
    });
  };

  subscribePublicPosts(items=>{ items.forEach(p=>feedMap.set(p.id,p)); render(); });
  subscribeUserPosts(u.uid, items=>{ items.forEach(p=>feedMap.set(p.id,p)); render(); });
  const friendUids = await getFriendUidsPosts(u.uid);
  friendUids.forEach(fuid=>{
    onSnapshot(query(collection(db,'posts'), where('uid','==',fuid), orderBy('createdAt','desc')), s=>{
      s.forEach(d=> feedMap.set(d.id, {id:d.id,...d.data()})); render();
    });
  });

  document.getElementById('addStoryBtn').addEventListener('click', async ()=>{
    const f = document.getElementById('storyImage').files?.[0]; if(!f) return alert('Izberi sliko.');
    const b64 = await fileToBase64(f); await addStory(currentUser, userDoc, b64); document.getElementById('storyImage').value='';
  });

  document.getElementById('createPostBtn').addEventListener('click', async ()=>{
    const text = document.getElementById('postText').value.trim(); let img=''; const f=document.getElementById('postImage').files?.[0]; if(f) img=await fileToBase64(f);
    await createPost(currentUser, userDoc, text, img); document.getElementById('postText').value=''; document.getElementById('postImage').value='';
  });

  document.getElementById('showPublicOnly').addEventListener('change', ()=> render());
});
