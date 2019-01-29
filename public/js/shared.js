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
const facultyLocation = {
    latitude: 47.174100,
    longitude: 27.574954
};


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

var redirrectUser = function (isStudent) {
    if (isStudent) {
        location.href = "../public/student-dashboard/student-dashboard.html";
    }
    else {
        location.href = "../public/professor-dashboard/professor-dashboard.html";
    }
}


function checkUserRole(isStudentPage) {
    var isStudent = localStorage.getItem('isStudent');
    var email = localStorage.getItem('isStudent');
    var isStudent = (isStudent === 'true');
    
    if (email == null) {
        location.href = '../index.html';
    }
    else {
        if (isStudentPage && !isStudent) {
            location.href = "../professor-dashboard/professor-dashboard.html";
        }
        if (!isStudentPage && isStudent) {
            location.href = "../student-dashboard/student-dashboard.html";
        }
    }
}

function logout() {
    localStorage.removeItem('email');
    localStorage.removeItem('key');
    localStorage.removeItem('isStudent');


    location.href = '../index.html';
}

function removeChildrenNodes(parent) {
    while (document.getElementById(parent).firstChild) {
        document.getElementById(parent).removeChild(document.getElementById(parent).firstChild);
    }
}
// Used to check if an element was loaded.
async function checkElement(selector) {
    while (document.getElementById(selector) === null) {
        await rafAsync()
    }
    return true;
}

function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve);
    });
}

// Generic function for creating a node.
function createNode(content, type, myClass, myHref, id) {
    var node = document.createElement(type);
    if (content != "note") {
        var textnode = document.createTextNode(content);
        node.appendChild(textnode);
    }
    if (myClass != false) {
        node.classList.add(myClass);
    }
    if (myHref != false) {
        node.setAttribute("href", myHref);
    }
    if (id != false) {
        node.setAttribute("id", id);
    }

    return node;
}

// Creates an element from given string.
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function createDropdownOption(type, content, parent) {
    var node = document.createElement(type);
    node.innerHTML = content;
    document.getElementById(parent).appendChild(node);
    node.setAttribute('value', content);
}

// used for geolocation on attend view
function checkUserLocation() {
    let urlLocation = window.location.hash;
    if (urlLocation === '#attend') {
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos);
            if (Math.abs(1000 * (facultyLocation.latitude - pos.coords.latitude)) >= 1 ||
                Math.abs(1000 * (facultyLocation.longitude - pos.coords.latitude)) >= 1) {
                return false;
            }
        });
    }
    else {
        return true;
    }
}