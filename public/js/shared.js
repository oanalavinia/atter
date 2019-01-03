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

// TODO: don't delete this. Will be added with addEventListener on create
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
function createNode(content, type, myClass, myHref) {
    var node = document.createElement(type);
    if(content != "note") {
        var textnode = document.createTextNode(content);
        node.appendChild(textnode);
    }
    if(myClass != false) {
        node.classList.add(myClass);
    }
    if(myHref != false) {
        node.setAttribute("href", myHref);
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

// Used for professor.
// TODO: use classes that are defined in student.js.
// The problem is with JSON.parse.
class Student2 {
    constructor(user) {
        this.email = user.Email;
        this.firstName = user.FirstName;
        this.group = user.Group;
        this.lastName = user.LastName;
        this.password = user.Password;
        this.year = user.Year;
        this.studentCourses = user.StudentCourses;
    }

    get courses() {
        allCourses = [];
        for(var key in Object.keys(this.studentCourses)) {
            var thisCourse = new Course2(this.studentCourses[key]);
            allCourses.push(thisCourse);
        }
        return allCourses;
    }

    get name() {
        return this.firstName + ' ' + this.lastName;
    }
}

class Course2 {
    constructor(course) {
        this.courseProfessor = course.CourseProfessor;
        this.seminarProfessor = course.SeminarProfessor;
        this.title = course.Title;
        this.weeks = course.Weeks;
    }

    getWeeks() {
        var allWeeks = []
        for(var key in Object.keys(this.weeks)) {
            var thisWeek = new Week(this.weeks[key])
            allWeeks.push(thisWeek);
        }
        return allWeeks;
    }

    getWeeksByNumber(content) {
        var allWeeks = []
        for(var key in Object.keys(this.weeks)) {
            console.log(this.weeks)
            var thisWeek = new Week2(this.weeks[key])
            if(thisWeek.number == content) {
                console.log(thisWeek);
                allWeeks.push(thisWeek);
            }
        }
        return allWeeks;
    }

    getNumberOfWeeks() {
        return this.weeks.length;
    }

    
} 

class Week2 {
    constructor(week) {
        this.courseAttendance = week.CourseAttendance;
        this.labAttendance = week.LabAttendance;
        this.labPoints = week.LabPoints;
        this.number = week.Number;
    }

    getWeekNumber() {
        return "Week " + this.number;
    }

    getLabAttendance() {
        if(this.labAttendance == true) {
            return "Lab: present";
        } else {
            return "Lab: absent";
        }
    }

    getCourseAttendance() {
        if(this.labAttendance == true) {
            return "Course: present";
        } else {
            return "Course: absent";
        }
    }

    getBonus() {
        return "Bonus: " + this.labPoints;
    }
}