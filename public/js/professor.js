class Professor {
    constructor(user) {
        this.email = JSON.parse(user).Email;
        this.firstName = JSON.parse(user).FirstName;
        this.lastName = JSON.parse(user).LastName;
        this.password = JSON.parse(user).Password;
        this.professorCourses = JSON.parse(user).ProfessorCourses;
    }

    get courses() {
        allCourses = [];
        for(var key in Object.keys(this.professorCourses)) {
            var thisCourse = new ProfCourse(this.professorCourses[key]);
            allCourses.push(thisCourse);
        }
        return allCourses;
    }

    get name() {
        return this.firstName + ' ' + this.lastName;
    }
}

class ProfCourse {
    constructor(course) {
        this.isCourseProf = course.IsCourseProf;
        this.name = course.Name;
        this.seminarGroups = course.SeminarGroups;
    }

    get courseName() {
        return this.name + "/ Course";
    }

    get labName() {
        return this.name + "/ Lab";
    }
}

// Creates a node for menu.
function createSubjectNode(name) {
    course = createNode("note", "li", false, false);
    //to be refactored
    link = createNode(name, "a", false, "#statistics/" + name.split('/')[0] + name.split('/')[1].split(' ')[1]);
    course.appendChild(link);
    course.addEventListener("click", closeMenu);
    return course;
}

// Updates menu with profs subjects.
function addSubjectsToMenu(allCourses) {
    var course;
    var subjectsList = document.getElementById("subjectsList");
    for(var key in Object.keys(allCourses)) {
        let obj = allCourses[key];
        if(obj.isCourseProf) {  
            course = createSubjectNode(obj.courseName);
            subjectsList.appendChild(course);
            lab =  createSubjectNode(obj.labName);
            subjectsList.appendChild(lab);
        } else {
            lab =  createSubjectNode(obj.labName);
            subjectsList.appendChild(lab);
        }
        lab.addEventListener("click", function() {
            addWeeksForSubject(obj.seminarGroups, obj.name);
        }, false);
    }
}

// For each subject put 14 weeks with the assigned groups.
function addWeeksForSubject(seminarGroups, name) {
    var weeksNode;
    checkElement('weeks').then((element) => {
        weeksNode = document.getElementById("weeks");
        while (weeksNode.firstChild) {
            weeksNode.removeChild(weeksNode.firstChild);
        }
        for (i = 1; i < 15; i++) {
            weekNode = createWeek(i, seminarGroups, name);
            weeksNode.appendChild(weekNode);
        }
    });
}

// Just updates the group for now, when it is clicked.
function groupView(group, hour, seminarName, weekNumber) {
    var thisGroup;
    checkElement('group').then((element) => {
        thisGroup = document.getElementById('group');
        thisGroup.innerHTML = 'Group: ' + group;
    });
    checkElement('week').then((element) => {
        thisWeek = document.getElementById('week');
        thisWeek.innerHTML = 'Week: ' + weekNumber;
    });
    var students = getAttendance(seminarName, weekNumber, hour);
    checkElement('attendance').then((element) => {
        var attendance = document.getElementById('attendance');
        var studentNode;
        students.forEach(function(student) {
            // isPresentThisWeek(student, weekNumber);
            studentNode = createNode(student, 'li', false, false);
            attendance.appendChild(studentNode);
        });
    });
}

function getAttendance(seminarName, weekNumber, hour) {
    var students = []
    allStudents.forEach(function(student) {
        hisCourses = student.courses;
        hisCourses.forEach(function(course) {
            if(course.seminarProfessor == professor.name && course.title == seminarName) {
                course.weeks.forEach(function(week) {
                    if(week.Number == weekNumber && week.LabAttendance == true && week.Hour == hour) {
                        students.push(student.name);
                    }
                })
            }
        });
    });
    return students;
}

// Used in addWeeksForSubject. Creates a week with it's groups.
function createWeek(number, seminarGroups, name) {
    var parent = document.createElement("tr");
    var title = "Week " + number;
    var weekNumberNode = createNode(title, "td", "text");
    var link;
    var groupNode;
    parent.appendChild(weekNumberNode);
    for(var key in Object.keys(seminarGroups)) {
        let group = seminarGroups[key].Group;
        let hour = seminarGroups[key].Hour;
        groupNode = createNode("note", "td", false, false);
        link = createNode(group, "a", false, "#group/"+group);
        link.addEventListener("click", function() {
            groupView(group, hour, name, number);
        }, false);
        groupNode.appendChild(link);
        parent.appendChild(groupNode);
    }
    return parent;
}

var user = localStorage.getItem('user');
allCourses = [];
var professor = new Professor(user);
allCourses = professor.courses;

function populate() {
    var thisUser = document.getElementById("user");
    thisUser.innerHTML = professor.name;
    addSubjectsToMenu(allCourses);
}

window.onload = function () {
    populate();    
}

var rootRef = database.ref().child("users");

var allStudents = [];
var thisStudent;
setTimeout(function(){
  rootRef.on("value", function(snapshot) {
    snapshot.forEach(function(student) {
        if(student.val().IsStudent) {
          student.child('StudentCourses').forEach(function(elem) {
            if(elem.val().SeminarProfessor == professor.name) {
              thisStudent = new Student2(student.val());
              allStudents.push(thisStudent);
            }
          })
        }
    });
  });
  console.log(allStudents);
});

// console.log(allStudents);