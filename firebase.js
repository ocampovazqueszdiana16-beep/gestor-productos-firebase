// Inicialización de Firebase: Authentication + Cloud Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfV5l2X5X6um0JFX4m3_1cAxJ3m8MIAiU",
  authDomain: "dk028-fcbfc.firebaseapp.com",
  projectId: "dk028-fcbfc",
  storageBucket: "dk028-fcbfc.firebasestorage.app",
  messagingSenderId: "88597066654",
  appId: "1:88597066654:web:1a975d2e98a3016a5a1c8f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Conexión a Firestore
