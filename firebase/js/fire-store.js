
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, doc, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRY35NBHgtGCZ2TsGsfg7NevGpYGr28zA",
    authDomain: "fir-it-e3f8b.firebaseapp.com",
    projectId: "fir-it-e3f8b",
    storageBucket: "fir-it-e3f8b.appspot.com",
    messagingSenderId: "178676252737",
    appId: "1:178676252737:web:a0160848a80b687da586c0",
    measurementId: "G-JNGRT256T4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
