import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

export const firebaseConfig = {
  // 🔧 ZAMENJAJ z vrednostmi iz Firebase Console → Project settings → SDK setup & config
  apiKey: "AIzaSyAhA1s2iiJDMMeqoOrp1asJO1eha_R0ivg",
  authDomain: "slychat1-b76db.firebaseapp.com",
  databaseURL: "https://slychat1-b76db-default-rtdb.firebaseio.com",
  projectId: "slychat1-b76db",
  storageBucket: "slychat1-b76db.appspot.com"
  messagingSenderId: "508879069664",
  appId: "1:508879069664:web:ce963d111297cd3480cb85",
  measurementId: "G-D34XJNNGNQ"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
