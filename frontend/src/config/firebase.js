import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCHKzEWZP7Hpp8VD3qvEdqR8Me5JXJkmk8",
  authDomain: "medsense-e3bce.firebaseapp.com",
  projectId: "medsense-e3bce",
  storageBucket: "medsense-e3bce.firebasestorage.app",
  messagingSenderId: "505814343562",
  appId: "1:505814343562:web:e3ff32f90f8e18c5ee7273",
  measurementId: "G-LH917K0ECY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider(app);
export const database = getFirestore(app);