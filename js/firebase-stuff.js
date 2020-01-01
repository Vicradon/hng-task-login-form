const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

var firebaseConfig = {
  
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
