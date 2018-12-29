

// function popup() {
//     window.onload = function () {
//         var popup = document.getElementById("details-popup");
//         var details = document.getElementsByClassName("details");
//         var span = document.getElementsByClassName("close")[0];

//         details.onclick = function () {
//             popup.style.display = "block";
//         }

//         span.onclick = function () {
//             popup.style.display = "none";
//         }

//         window.onclick = function (event) {
//             if (event.target == popup) {
//                 popup.style.display = "none";
//             }
//         }
//     }
// }

function openMenu() {

    var menu = document.getElementById('menu');

    document.getElementById("responsive-menu").style.display = 'none';
    menu.style.display = 'block';
    menu.style.width = '80%';
    menu.style.height = '100vh';


}

function closeMenu() {

    if (window.screen.width < 900) {

        var menu = document.getElementById('menu');
        menu.style.display = 'none';
        document.getElementById("responsive-menu").style.display = 'block';

    }


}
var redirrectUser = function(isStudent) {
    if (isStudent) {
        location.href = "../public/student-dashboard/student-dashboard.html";
    }
    else {
        location.href = "../public/professor-dashboard/professor-dashboard.html";
    }
}

function checkUserRole(isStudentPage) {
    var user = localStorage.getItem('user');
    if(user == null){
        location.href = '../index.html';
    }
    else{
        var isStudent = JSON.parse(user).IsStudent;
        if(isStudentPage && !isStudent ){
            location.href = "../public/professor-dashboard/professor-dashboard.html";
        }
        if(!isStudentPage && isStudent){
            location.href = "../public/student-dashboard/student-dashboard.html";
        }
    }
}

function logout() {
    localStorage.removeItem('user');
    location.href = '../index.html';
}

// popup();
