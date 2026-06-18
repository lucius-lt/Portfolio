import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5uuQM5zUWlNstlP_sxETY7gZ4WaerB3w",
  authDomain: "niyatisoni-portfolio.firebaseapp.com",
  databaseURL: "https://niyatisoni-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "niyatisoni-portfolio",
  storageBucket: "niyatisoni-portfolio.firebasestorage.app",
  messagingSenderId: "868885085741",
  appId: "1:868885085741:web:e69c7d4563d4c791b742a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
