import { auth } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
onAuthStateChanged(auth, (u)=>{ if(u) location.replace('feed.html'); else location.replace('login.html'); });
