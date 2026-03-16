import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBxQPl7RzS0cIyBgmWmAOVksb4zynv-EG8",
    authDomain: "kbeautymart-auth.firebaseapp.com",
    projectId: "kbeautymart-auth",
    storageBucket: "kbeautymart-auth.firebasestorage.app",
    messagingSenderId: "906715399643",
    appId: "1:906715399643:web:f6f8aa33a68204f84ad3fe",
    measurementId: "G-FFE2X1YQHY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };