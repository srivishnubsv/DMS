import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbjuL_aLAjnQMeyMMRuLTIjtOXj_rIpHw",
  authDomain: "survey-mage-82da1.firebaseapp.com",
  projectId: "survey-mage-82da1",
  storageBucket: "survey-mage-82da1.firebasestorage.app",
  messagingSenderId: "513540768730",
  appId: "1:513540768730:web:290399b73585181f73b6e3",
  measurementId: "G-R7XWRZTX1B",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);