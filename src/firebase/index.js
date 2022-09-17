// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBb4Gkore_4ESL0G2_cDf1S_G1vLqd-Dz0",
  authDomain: "appvue-b0f61.firebaseapp.com",
  projectId: "appvue-b0f61",
  storageBucket: "appvue-b0f61.appspot.com",
  messagingSenderId: "988581432940",
  appId: "1:988581432940:web:44240d7f6cd1b7bb93d249",
  measurementId: "G-BKH3SCZ12H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
