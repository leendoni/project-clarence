import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHlLxXBl3OrKBAaNbjNJKw7KyN7zlqa0E",
    authDomain: "project-claire-demo.firebaseapp.com",
    projectId: "project-claire-demo",
    storageBucket: "project-claire-demo.appspot.com",
    messagingSenderId: "52063288707",
    appId: "1:52063288707:web:4e49d903d9b61dec1dcab6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };