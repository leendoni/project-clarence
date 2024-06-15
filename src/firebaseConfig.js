import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAL5JL1VpYJatA5B6CzLHoiuB1qBCutAHk",
    authDomain: "project-clarence.firebaseapp.com",
    projectId: "project-clarence",
    storageBucket: "project-clarence.appspot.com",
    messagingSenderId: "665706899928",
    appId: "1:665706899928:web:6017c3a06a13994496aaad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };