const firebase = require('firebase');

firebase.initializeApp({
  apiKey: "AIzaSyCowZ59Ms9TjrDru1Tz40e8fh2KtlHZlFo",
  authDomain: "goal-coach-953d0.firebaseapp.com",
  databaseURL: "https://goal-coach-953d0.firebaseio.com",
  projectId: "goal-coach-953d0",
  storageBucket: "goal-coach-953d0.appspot.com",
  messagingSenderId: "41868907638"
});


const todoRef = firebase.database().ref('todos');
module.exports = todoRef;
