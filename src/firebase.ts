import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  signInWithCustomToken,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

// TODO: Thay bằng config thực tế từ Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBV5Csy05F1yWX430takRudXwkr73CJMC0",
  authDomain: "web-api-664b2.firebaseapp.com",
  projectId: "web-api-664b2",
  storageBucket: "web-api-664b2.firebasestorage.app",
  messagingSenderId: "335040543175",
  appId: "1:335040543175:web:7c91115d8ed403cdda81e2",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {
  auth,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  signInWithCustomToken,
  updateProfile,
  onAuthStateChanged,
};
