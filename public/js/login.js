(function () {
    function init() {
        
        var config = {
            apiKey: "AIzaSyAJdgGIwRikx6qawka8wZ-C172-G3nbQJ4",
            authDomain: "atter-8d2e1.firebaseapp.com",
            databaseURL: "https://atter-8d2e1.firebaseio.com",
            projectId: "atter-8d2e1",
            storageBucket: "atter-8d2e1.appspot.com",
            messagingSenderId: "574650654869"
        };

        firebase.initializeApp(config);
       
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



        var redirrectUser = function (isStudent) {
            if (isStudent) {
                location.href = "../public/student-dashboard/student-dashboard.html";
            }
            else {
                location.href = "../public/professor-dashboard/professor-dashboard.html";
            }
        }



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
    }
    init();
}());
