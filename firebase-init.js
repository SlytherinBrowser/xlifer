// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAhA1s2iiJDMMeqoOrp1asJO1eha_R0ivg",
  authDomain: "slychat1-b76db.firebaseapp.com",
  projectId: "slychat1-b76db",
  storageBucket: "slychat1-b76db.appspot.com", // ✅ popravljeno
  messagingSenderId: "508879069664",
  appId: "1:508879069664:web:ce963d111297cd3480cb85",
  measurementId: "G-D34XJNNGNQ"
};

// Inicializacija
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
