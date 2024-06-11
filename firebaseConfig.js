import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDmfZ2aQb34C2CiABuQC7J_ZsiEJMeQVkI",
    authDomain: "euro24bet-3eb04.firebaseapp.com",
    databaseURL: "https://euro24bet-3eb04-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "euro24bet-3eb04",
    storageBucket: "euro24bet-3eb04.appspot.com",
    messagingSenderId: "372184030843",
    appId: "1:372184030843:web:033f46db9543cb53f14cde",
    measurementId: "G-KN4VD9RPBP"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db }
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
