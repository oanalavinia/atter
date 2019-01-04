
// Appends the subjects on the menu.
function createSubjectsList(allCourses) {
    var course;
    var link;

    var subjectList = document.getElementById("subjectsList");
    for (var key in Object.keys(allCourses)) {
        let obj = allCourses[key];
        course = createNode("note", "li", false, false);
        link = createNode(obj.title, "a", false, "#course/" + obj.title);
        course.appendChild(link);
        subjectList.appendChild(course);
        course.addEventListener("click", closeMenu);
        course.addEventListener("click", function () {
            populateWeeks(obj.getWeeks());
        });

        if (window.location.hash.substr(1) === "course/" + obj.title) {
            populateWeeks(obj.getWeeks());
        }

    }
}

// Creates a week.
function createWeek(week) {
    var parent = document.createElement("tr");
    var number = createNode(week.getWeekNumber(), "th", "text");
    var labPresence = createNode(week.getLabAttendance(), "th", "text");
    var coursePresence = createNode(week.getCourseAttendance(), "th", "text");
    var bonus = createNode(week.getBonus(), "th", "text");
    var button = htmlToElement('<th><button >Details</button></th>');
    button.addEventListener("click", function () {
        // popup
    }, false);
    parent.appendChild(number);
    parent.appendChild(labPresence);
    parent.appendChild(coursePresence);
    parent.appendChild(bonus);
    parent.appendChild(button);
    return parent;
}

// Deletes the old weeks and appends the coresponding ones.
// Waits for 'weeks' element to be loaded.
function populateWeeks(weeks) {
    var weeksNode;
    checkElement('weeks')
        .then((element) => {
            weeksNode = document.getElementById("weeks");
            while (weeksNode.firstChild) {
                weeksNode.removeChild(weeksNode.firstChild);
            }
            for (var key in Object.keys(weeks)) {
                var obj = weeks[key];
                var weekNode = createWeek(obj);
                weeksNode.appendChild(weekNode);
            }
        });
}

function populate() {

    var email = localStorage.getItem('email');
    var db = firebase.database();
    var ref = db.ref('users');

    ref.on('value', function (data) {
        var users = Object.values(data.val());
        var loggedUser = users.find(function (user) { return user.Email === email; });
        allCourses = [];
        var student = new Student(loggedUser);
       
        var userName = document.getElementById("user");
        userName.innerHTML = loggedUser.FirstName + ' ' + loggedUser.LastName;
        
        createSubjectsList( student.courses);
       
    });


}

window.onload = function () {
    populate();
}
