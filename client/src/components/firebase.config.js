import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD52gqWM-MGkTuc_SadcxchcAe3E5M0vtY",
  authDomain: "testcode-a5dfb.firebaseapp.com",
  databaseURL: "https://testcode-a5dfb-default-rtdb.firebaseio.com",
  projectId: "testcode-a5dfb",
  storageBucket: "testcode-a5dfb.appspot.com",
  messagingSenderId: "1031865281124",
  appId: "1:1031865281124:web:4d8bd429e9afadea3e8d71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;