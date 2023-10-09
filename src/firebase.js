// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXxSYau7edKYvVmgNTg3feZRT0PBG74mQ",
  authDomain: "vet-clinic-app-8203d.firebaseapp.com",
  databaseURL: "https://vet-clinic-app-8203d-default-rtdb.firebaseio.com",
  projectId: "vet-clinic-app-8203d",
  storageBucket: "vet-clinic-app-8203d.appspot.com",
  messagingSenderId: "946182137618",
  appId: "1:946182137618:web:daff4aa3b9f20dda8cb5cb",
  measurementId: "G-QRYVH0Z92P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app)

export { db, auth, storage };

//THIS PROJECT WAS MADE BY PROMETHEUS
