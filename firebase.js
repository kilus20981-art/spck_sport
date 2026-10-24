// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7-FDVQDT8lnkPcOBYOfb0dpYw3j7z204",
  authDomain: "thinh-6935f.firebaseapp.com",
  projectId: "thinh-6935f",
  storageBucket: "thinh-6935f.firebasestorage.app",
  messagingSenderId: "27008285781",
  appId: "1:27008285781:web:5ed8b6a0c8fb427aa9a8dc",
  measurementId: "G-04ML4ZY58M"
};


// khoi tao firebase
firebase.initializeApp(firebaseConfig);
const app = firebase.app();

console.log(app.name);


/* Khởi tạo Firestore */
const db = firebase.firestore();

/* Khởi tạo Firebase Authentication */
const auth = firebase.auth();

