
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
        var i = 1;
        for( var key in data.val()){
           if( i++ === filteredUser.Id){
           localStorage.setItem('key', key);
           break;
           }
        }
       
        redirrectUser(filteredUser.IsStudent);
    }
    setEmailToLocalStorage(filteredUser);
};



var setEmailToLocalStorage = function (user) {
    localStorage.setItem('email', user.Email);
    localStorage.setItem('isStudent', user.IsStudent);

};
