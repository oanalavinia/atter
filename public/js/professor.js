

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
function addSubjectsToMenu(allCourses, allStudents, professor) {
    var course;
    var subjectsList = document.getElementById("subjectsList");
       
    while(subjectsList.firstChild){
        subjectsList.removeChild(subjectsList.firstChild);
    }
        for (var key in Object.keys(allCourses)) {
            let obj = allCourses[key];
            if (obj.isCourseProf) {
                course = createSubjectNode(obj.courseName);
                // course.addEventListener("click", function () {
                //     drawPointsCanvas(obj.name);
                // })
                subjectsList.appendChild(course);
                lab = createSubjectNode(obj.labName);
                subjectsList.appendChild(lab);
            } else {
                lab = createSubjectNode(obj.labName);
                subjectsList.appendChild(lab);
            }
            lab.addEventListener("click", function () {
                addWeeksForSubject(obj.seminarGroups, obj.name, allStudents, professor);
            }, false);

        
    }
}

// For each subject put 14 weeks with the assigned groups.
function addWeeksForSubject(seminarGroups, name, allStudents, professor) {
    var weeksNode;
    checkElement('weeks').then((element) => {
        weeksNode = document.getElementById("weeks");
        while (weeksNode.firstChild) {
            weeksNode.removeChild(weeksNode.firstChild);
        }
        for (i = 1; i < 15; i++) {
            weekNode = createWeek(i, seminarGroups, name, allStudents, professor);
            weeksNode.appendChild(weekNode);
        }
    });
}

// Just updates the group for now, when it is clicked.
function groupView(group, code, seminarName, weekNumber, allStudents, professor) {
    var thisGroup;
    checkElement('group').then((element) => {
        thisGroup = document.getElementById('group');
        thisGroup.innerHTML = 'Group: ' + group;
    });
    checkElement('week').then((element) => {
        thisWeek = document.getElementById('week');
        thisWeek.innerHTML = 'Week: ' + weekNumber;
    });
    var students = getAttendance(seminarName, weekNumber, code, allStudents, professor);
    checkElement('presence').then((element) => {
        presence = document.getElementById('presence');
        presence.innerHTML = 'Total presence: ' + students.length;
    });
    checkElement('attendance').then((element) => {
        var attendance = document.getElementById('attendance');
        var studentNode;
        students.forEach(function (student) {
            studentNode = createNode(student, 'li', false, false);
            attendance.appendChild(studentNode);
        });
    });
}

function getAttendance(seminarName, weekNumber, code, allStudents, professor) {
    var students = [];
    // refactore to get attendence from code
    allStudents.forEach(function (student) {
        hisCourses = student.courses;
        hisCourses.forEach(function (course) {
            if (course.seminarProfessor == professor.name && course.title == seminarName) {
                course.weeks.forEach(function (week) {
                    if (week.labAttendance == true && week.code == code) {
                        students.push(student.name);
                    }
                })
            }
        });
    });
    console.log(students);
    return students;
}

// Used in addWeeksForSubject. Creates a week with it's groups.
function createWeek(number, seminarGroups, name, allStudents, professor) {
    var parent = document.createElement("tr");
    var title = "Week " + number;
    var weekNumberNode = createNode(title, "td", "text");
    var link;
    var groupNode;
    parent.appendChild(weekNumberNode);
    for (var key in seminarGroups) {
        let group = seminarGroups[key].Name;
        groupNode = createNode("note", "td", false, false);
        link = createNode(group, "a", false, "#group/" + group);
        link.addEventListener("click", function () {
            groupView(group, seminarGroups[key], name, number, allStudents, professor);
        }, false);
        groupNode.appendChild(link);
        parent.appendChild(groupNode);
    }
    return parent;
}



// register view

function createDropdownOption(type, content, parent) {
    var node = document.createElement(type);
    node.innerHTML = content;
    document.getElementById(parent).appendChild(node);
    node.setAttribute('value', content);
}

function removeChildrenNodes(parent) {
    while (document.getElementById(parent).firstChild) {
        document.getElementById(parent).removeChild(document.getElementById(parent).firstChild);
    }
}

function addInfosToRegisterForm(courses) {
    checkElement('register').then(() => {

        var courseNames = courses.map(course => { return course.name });
        if (document.getElementById('course').childElementCount != courseNames.length) {
            for (var key in courseNames) {
                createDropdownOption('option', courseNames[key], 'course');
            }
        }

        var course = courses.find(c => c.name === document.getElementById('course').value)
        var groups = course.seminarGroups.map(c => {
            return c.Name;
        });
        removeChildrenNodes('group');
        for (var key in groups) {
            createDropdownOption('option', groups[key], 'group');

        }
        if (document.getElementById('week').childElementCount == 0) {
            for (var i = 1; i <= 14; i++) {
                createDropdownOption('option', 'Week' + ' ' + i, 'week');
            }
        }

    });
}

function onClickRegister(allCourses) {
    checkElement('register').then((element) => {
        document.getElementById("register-class-link").addEventListener('click', function () {
            addInfosToRegisterForm(allCourses);
        })
    });

    checkElement('register').then((element) => {
        document.getElementById('course').addEventListener('change', function () {
            addInfosToRegisterForm(allCourses);
        });
    });
}

function submit(professor) {
    var course = document.getElementById('course').value;
    var group = document.getElementById('group').value;
    var week = document.getElementById('week').value.split(' ')[1];
    var nrStudents = document.getElementById('nr-students').value;
    var code = Math.floor(Math.random() * 9000) + 1000;
    document.getElementById('code').innerHTML = code;
    var profKey = localStorage.getItem('key');
    let indexOfCourse = 0;
    let indexOfGroup = 0;
    for (var i in professor.courses) {
        if (professor.courses[i].name === course) {
            indexOfCourse = i;
        }
    }

    for (var i in professor.courses[indexOfCourse].seminarGroups) {
        if (professor.courses[indexOfCourse].seminarGroups[i].Name === group) {
            indexOfGroup = i;
        }
    }

    firebase.database().ref('users/' + profKey + '/ProfessorCourses/' +
        indexOfCourse.toString() + '/SeminarGroups/' + indexOfGroup.toString() + '/Weeks/' + week + '/').set({
            'Code': code,
            'Number': week,
            'StudentsNumber': nrStudents
        });

}

function onClickGenerate(professor) {
    checkElement('register').then((element) => {
        document.getElementById("submit").addEventListener('click', function () {
            submit(professor);
        })
    });
}



function populate() {
    var email = localStorage.getItem('email');
    var ref = database.ref().child("users");

    ref.on('value', function (data) {

        var allCourses = [];
        var students = [];

        var users = Object.values(data.val());
        var loggedUser = users.find(function (user) { return user.Email === email; });
       
        var thisUser = document.getElementById("user");
        var professor = new Professor(loggedUser);

        allCourses = professor.courses;
        thisUser.innerHTML = professor.name;

        var studentsJson = users.filter(student => {
            return student.IsStudent &&
                typeof (student.StudentCourses.find(function (course) {
                    return course.CourseProfessor == professor.name ||
                        course.SeminarProfessor == professor.name
                })) != 'undefined';
        });

        for (var key in Object.keys(studentsJson)) {
            var student = new Student(studentsJson[key]);
            students.push(student);
        }

        addSubjectsToMenu(allCourses, students, professor);
        addInfosToRegisterForm(allCourses);
        onClickRegister(allCourses);
        onClickGenerate(professor);



    });

}


window.onload = function () {
    populate();
}

