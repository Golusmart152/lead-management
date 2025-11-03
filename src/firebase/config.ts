// src/firebase/config.ts

// 1. Import the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 2. Your Firebase Configuration Object
const firebaseConfig = {
  "projectId": "licencning",
  "appId": "1:941304879321:web:60bf473af225fadb3106c8",
  "storageBucket": "licencning.firebasestorage.app",
  "apiKey": "AIzaSyASblu1Utxbtu_u19_ZH54IVEonZeZrO5I",
  "authDomain": "licencning.firebaseapp.com",
  "messagingSenderId": "941304879321",
  "measurementId": "G-SNK233BQN1"
};

// 3. Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// 4. Export the services for use throughout the application
export { app, auth, db, analytics };
