const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

var firebaseConfig = {
  apiKey: "AIzaSyAg7S6-WdJhc0QCX-aTeJT6ts8FNVXiIa0",
  authDomain: "hng-first-task.firebaseapp.com",
  databaseURL: "https://hng-first-task.firebaseio.com",
  projectId: "hng-first-task",
  storageBucket: "",
  messagingSenderId: "380526995854",
  appId: "1:380526995854:web:fcfd270b120ab0758a5cdf"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();