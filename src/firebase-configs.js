// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6udNUpIXnFTUNExZ9zdfazGz4M2x9VL8",
  authDomain: "pretty-skin-shop.firebaseapp.com",
  projectId: "pretty-skin-shop",
  storageBucket: "pretty-skin-shop.firebasestorage.app",
  messagingSenderId: "967575597982",
  appId: "1:967575597982:web:d9c1ec7c0df1c9ecd61c8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized services to use in your app
export { auth, db };

