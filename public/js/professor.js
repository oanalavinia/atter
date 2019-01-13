

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
            addWeeksForSubject(obj.seminarGroups);
        }, false);


    }
}

// For each subject put 14 weeks with the assigned groups.
function addWeeksForSubject(seminarGroups) {
    var weeksNode;
    checkElement('weeks').then((element) => {
        weeksNode = document.getElementById("weeks");
        while (weeksNode.firstChild) {
            weeksNode.removeChild(weeksNode.firstChild);
        }
        for (i = 1; i < 15; i++) {
            weekNode = createWeek(i, seminarGroups);
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
function createWeek(number, seminarGroups) {
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
        // link.addEventListener("click", function () {
        //     groupView(group, seminarGroups[key], name, number, allStudents, professor);
        // }, false);
        groupNode.appendChild(link);
        parent.appendChild(groupNode);
    }
    return parent;
}



// register view

function populateProfessorRegisterView(courses) {
    checkElement('registerForm')
        .then((element) => {
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

function onClickRegisterView(allCourses, professor) {

    document.getElementById("register-class-link").addEventListener('click', function () {
        populateProfessorRegisterView(allCourses);
        onClickGenerate(professor);

    });
    checkElement('course')
        .then(() => {
            document.getElementById('course').addEventListener('change', function () {
                populateProfessorRegisterView(allCourses);


            });
        });
}

function submit(professor) {
    var course = document.getElementById('course').value;
    var group = document.getElementById('group').value;
    var week = document.getElementById('week').value.split(' ')[1];
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
    var hour = new Date();
    hour = hour.toString();
    hour = hour.split(' ')[4];
    week = parseInt(week) - 1;


    firebase.database().ref('users/' + profKey + '/ProfessorCourses/' +
        indexOfCourse.toString() + '/SeminarGroups/' + indexOfGroup.toString() + '/Weeks/' + week.toString() + '/').set({
            'Code': code,
            'Number': week+1,
            'Hour': hour
        });

}

function onClickGenerate(professor) {
    checkElement('submit')
        .then((element) => {
            document.getElementById("submit").addEventListener('click', function (event) {
                event.preventDefault();
                submit(professor);

            });
        });
}


function populate() {
    var email = localStorage.getItem('email');
     
    firebase.database().ref('users').on('value', function (data) {

        var users = Object.values(data.val());
        var loggedUser = users.find(function (user) { return user.Email === email; });
        var professor = new Professor(loggedUser);

        //var students = [];
        // var studentsJson = users.filter(student => {
        //     return student.IsStudent &&
        //         typeof (student.StudentCourses.find(function (course) {
        //             return course.CourseProfessor == professor.name ||
        //                 course.SeminarProfessor == professor.name
        //         })) != 'undefined';
        // });

        // for (var key in Object.keys(studentsJson)) {
        //     var student = new Student(studentsJson[key]);
        //     students.push(student);

        // }
       
        populateProfessorRegisterView(professor.courses);
        onClickRegisterView(professor.courses, professor);
        onClickGenerate(professor.courses);


    });

}

var email = localStorage.getItem('email');
firebase.database().ref('users').once('value', function (data) {
    var users = Object.values(data.val());
    var loggedUser = users.find(function (user) { return user.Email === email; });
    var professor = new Professor(loggedUser);
    var userName = document.getElementById("user");
    userName.innerHTML = loggedUser.FirstName + ' ' + loggedUser.LastName;
    allCourses = professor.courses;
    if( allCourses !== undefined){
        
    addSubjectsToMenu(allCourses);

    }

});

    populate();
  



