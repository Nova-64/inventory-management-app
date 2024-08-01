// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAoVffxq5VLjcDzUMKfxJ4nPyZDNBQ-A7M",
  authDomain: "inventory-management-app-4646.firebaseapp.com",
  projectId: "inventory-management-app-4646",
  storageBucket: "inventory-management-app-4646.appspot.com",
  messagingSenderId: "395544312522",
  appId: "1:395544312522:web:a6a36c9d1fd78d64185233",
  measurementId: "G-38ZTXMXBNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

