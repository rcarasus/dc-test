import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCSWJHYu_qskn02M-XrEjulKK9d-DnY4v4",
  authDomain: "afs-dashboard.firebaseapp.com",
  projectId: "afs-dashboard",
  storageBucket: "afs-dashboard.appspot.com",
  messagingSenderId: "1038957407294",
  appId: "1:1038957407294:web:dcb7859a6183cc3c15b56f",
  measurementId: "G-5RHT5F2Y8W"
};



var firebaseApp = firebase.initializeApp(firebaseConfig);
  export const db = firebaseApp.firestore();
  export const firebaseDb = firebase.database();
  export const auth = firebase.auth();
  //export const cuser = firebase.auth().currentUser;
  //export const GOOGLE_API_KEY = "AIzaSyC1FAmkmS6o6CU1PAiyegLxq4FfFpwLVb8"; 
  export const storage = firebase.storage();
  export const storageBucket = firebaseConfig.storageBucket

export default firebaseApp.database().ref();