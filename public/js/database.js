var url = 'https://atter-8d2e1.firebaseio.com/users.json';
var config = {
    apiKey: "AIzaSyAJdgGIwRikx6qawka8wZ-C172-G3nbQJ4",
    authDomain: "atter-8d2e1.firebaseapp.com",
    databaseURL: "https://atter-8d2e1.firebaseio.com",
    projectId: "atter-8d2e1",
    storageBucket: "atter-8d2e1.appspot.com",
    messagingSenderId: "574650654869"
};

firebase.initializeApp(config);
const database = firebase.database();

// const dbRef = database.ref('users');
// const dbRefObj = database.ref().getChildren();
// dbRefObj.on('value', snap => console.log(snap.val()));

var rootRef = database.ref().child("users");
var courses = [];

rootRef.once("value", function(snapshot) {
  snapshot.forEach(function(child) {
      if(child.child("StudentCourses").val()) {
        courses.push(child.child("StudentCourses").val());
      }
  });
});

console.log(courses);