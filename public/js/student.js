class Student {
    constructor(user) {
        this.email = JSON.parse(user).Email;
        this.firstName = JSON.parse(user).FirstName;
        this.group = JSON.parse(user).Group;
        this.lastName = JSON.parse(user).LastName;
        this.password = JSON.parse(user).Password;
        this.year = JSON.parse(user).Year;
        this.studentCourses = JSON.parse(user).StudentCourses;
    }

    get courses() {
        allCourses = [];
        for (var key in Object.keys(this.studentCourses)) {
            var thisCourse = new Course(this.studentCourses[key]);
            allCourses.push(thisCourse);
        }
        return allCourses;
    }

    get name() {
        return this.firstName + ' ' + this.lastName;
    }
}

class Course {
    constructor(course) {
        this.courseProfessor = course.CourseProfessor;
        this.seminarProfessor = course.SeminarProfessor;
        this.title = course.Title;
        this.weeks = course.Weeks;
    }

    getWeeks() {
        var allWeeks = []
        for (var key in Object.keys(this.weeks)) {
            var thisWeek = new Week(this.weeks[key])
            allWeeks.push(thisWeek);
        }
        return allWeeks;
    }

    getNumberOfWeeks() {
        return this.weeks.length;
    }


}

class Week {
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
        if (this.labAttendance == true) {
            return "Lab: present";
        } else {
            return "Lab: absent";
        }
    }

    getCourseAttendance() {
        if (this.labAttendance == true) {
            return "Course: present";
        } else {
            return "Course: absent";
        }
    }

    getBonus() {
        return "Bonus: " + this.labPoints;
    }
}


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

var user = localStorage.getItem('user');
allCourses = [];
var student = new Student(user);
allCourses = student.courses;

function populate() {
    var thisUser = document.getElementById("user");
    thisUser.innerHTML = student.name;
    createSubjectsList(allCourses);
}

window.onload = function () {
    populate();
}
