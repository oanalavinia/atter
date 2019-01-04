
document.getElementById('login').onclick = function () {

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;


    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((firebaseUser) => {
            if (firebaseUser) {
                firebase.auth().onAuthStateChanged(function () {
                    var db = firebase.database();
                    var ref = db.ref('users');
                    ref.on('value', findUserInUsersDatabase);
                });
            }
        })

        .catch((error) => {

            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);


        });

};


var findUserInUsersDatabase = function (data) {
    var users = Object.values(data.val());
    var filteredUser = users.find(function (user) {
        return user.Email === email.value;
    });
    if (!filteredUser) {
        alert("No such user exists in users database");
    }
    else {
        redirrectUser(filteredUser.IsStudent);
    }
    setLocalStorageItems(filteredUser);
};



var setLocalStorageItems = function (user) {
    localStorage.setItem('user', JSON.stringify(user));
};
