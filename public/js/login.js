
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

document.getElementById('login').onclick = function () {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(error => console.log(error));

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user);
        }

        var db = firebase.database();
        var ref = db.ref('users');
        ref.on('value', parseData, parseErr);
    });

};

var redirrectUser = function(isStudent) {
    if (isStudent) {
        location.href = "../public/student-dashboard/student-dashboard.html";
    }
    else {
        location.href = "../public/professor-dashboard/professor-dashboard.html";
    }
}

var parseData = function (data) {
    var arrayOfValues = Object.values(data.val());
    var filteredUser = arrayOfValues.find(function (user) {
        return user.Email === email.value;
    });
    if (!filteredUser) {
        alert("No such user exists");
    }
    else {
        redirrectUser(filteredUser.IsStudent);
    }
    setLocalStorageItems(filteredUser);
};

var parseErr = function (err) {
    console.log(err);
};

var setLocalStorageItems = function (user) {
    localStorage.setItem('user', JSON.stringify(user));
};