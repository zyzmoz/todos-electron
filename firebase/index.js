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

const actions = {
  save: (data) => {
    todoRef.push(data);
  },
  update: (data) => {

  },
  delete: (index) => {
    var query = todoRef.orderByChild('_id').equalTo(index);
    query.on('child_added', function(snapshot) {
      snapshot.ref.remove();
    });
  },
  deleteAll: () => {
    todoRef.on('value', snap => {
      snap.ref.remove();
    });

  },
  query: (params) => {
    return new Promise((resolve, reject) => {
      todoRef.on('value', snap => {
        let todos = [];
        snap.forEach(item => {
          let todoObj = item.val();
          const { _id, todo } = todoObj;
          todos.push({ _id, todo});
        });

        resolve(todos);
      });
    });

  }

}
module.exports = actions;
