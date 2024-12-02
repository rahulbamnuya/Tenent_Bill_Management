// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebase=require("firebase")
const firebaseConfig = {
  apiKey: "AIzaSyBv9RHjDFdFq65sB44KX8n_dljQlOyID_g",
  authDomain: "billcalculation-92aee.firebaseapp.com",
  projectId: "billcalculation-92aee",
  storageBucket: "billcalculation-92aee.appspot.com",
  messagingSenderId: "335723350129",
  appId: "1:335723350129:web:4a97e30abc56f1f09f33d0",
  measurementId: "G-PW0903N348"
};
firebase.initializeApp(firebaseConfig)
const db=firebase.firestore()
const User=db.collection("Users"
)
module.exports=Users;
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);