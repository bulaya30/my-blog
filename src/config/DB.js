// config/DB.js
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-ySo3Yrib6FoK3DBgaSJWXm7EzSjOd-0",
  authDomain: "my-blog-d8936.firebaseapp.com",
  projectId: "my-blog-d8936",
  storageBucket: "my-blog-d8936.appspot.com",
  messagingSenderId: "804156708055",
  appId: "1:804156708055:web:1885e56607d46929d24c92"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Firestore reference
const db = firebase.firestore();

// Auth reference
const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((err) => console.error('Error setting auth persistence:', err));

// Storage reference
const storage = firebase.storage();

export { firebase, db, auth, storage };
export default firebase;
