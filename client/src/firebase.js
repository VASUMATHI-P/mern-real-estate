// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyAJZMy2DGkO84FEu9BtyQtMd49e2XskndE",

  authDomain: "mern-hotel-booking.firebaseapp.com",

  projectId: "mern-hotel-booking",

  storageBucket: "mern-hotel-booking.appspot.com",

  messagingSenderId: "987682332133",

  appId: "1:987682332133:web:c23de095acb3ba6475a30c"

};


// Initialize Firebase

export const app = initializeApp(firebaseConfig);