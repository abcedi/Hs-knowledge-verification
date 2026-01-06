// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYCTD2IFLLsQcWD5X1Nb-LVPI-t1DWKhI",
  authDomain: "hs-quiz-provost.firebaseapp.com",
  projectId: "hs-quiz-provost",
  storageBucket: "hs-quiz-provost.firebasestorage.app",
  messagingSenderId: "862838160420",
  appId: "1:862838160420:web:3e8c924a78fed36eeeecb1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
