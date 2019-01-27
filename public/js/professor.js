function getStudents(students) {
    return new Promise(resolve => {
        students;
    });
}

async function checkStudents(students) {
    while (students === undefined) {
        await getStudents(students)
    }
    return true;
}

// Creates a node for menu.
function createSubjectNode(name) {
    course = createNode("note", "li", false, false);
    var routeName = name.split('/')[0];

    var type = name.split('/')[1].split(' ')[1];
    if (type === 'Course') {
        link = createNode(name, "a", false, "#course/" + routeName);
    }
    else {
        link = createNode(name, "a", false, "#labs/" + routeName);
    }
    course.appendChild(link);
    course.addEventListener("click", closeMenu);
    return course;
}

// Updates menu with profs subjects.
function addSubjectsToMenu(allCourses, students, professor, allStudents) {
    var course;
    var subjectsList = document.getElementById("subjectsList");
    for (var key in Object.keys(allCourses)) {
        let obj = allCourses[key];
        if (obj.isCourseProf) {
            course = createSubjectNode(obj.courseName);
            course.addEventListener("click", function () {
                drawPointsCanvas(allStudents);
                drawAttendanceChart(allStudents);
            })
            subjectsList.appendChild(course);
            lab = createSubjectNode(obj.labName);
            subjectsList.appendChild(lab);
        } else {
            lab = createSubjectNode(obj.labName);
            subjectsList.appendChild(lab);
        }
        lab.addEventListener("click", function () {
            addWeeksForSubject(students, professor);
        }, false);
    }
}

// For each subject put 14 weeks with the assigned groups.
function addWeeksForSubject(students, professor) {
    var weeksNode;
    let url = window.location.href.split('/');
    let labName = url[url.length-1];

    // TODO: refactor this.
    var course = professor.courses.find(c => c.name === labName)
    var groups = course.seminarGroups.map(c => {
        return c.Name;
    });

    checkElement('weeks').then((element) => {
        weeksNode = document.getElementById("weeks");
        while (weeksNode.firstChild) {
            weeksNode.removeChild(weeksNode.firstChild);
        }
        for (i = 1; i < 15; i++) {
            weekNode = createWeek(i, groups, students, professor);
            weeksNode.appendChild(weekNode);
        }
    });
}


function groupView(allStudents, professor) {
    var thisGroup;
    Promise.all([checkElement('group'), checkElement('week'),
    checkElement('presence'), checkElement('attendance')])
        .then(function () {
            let url = window.location.href.split('/');
            let url_length = url.length - 1;

            thisGroup = document.getElementById('group');
            var group = url[url_length - 2];
            thisGroup.innerHTML = 'Group: ' + group;

            weekNumber = url[url_length - 1];
            thisWeek = document.getElementById('week');
            thisWeek.innerHTML = 'Week: ' + weekNumber;

            let labName = url[url_length];
            let students = getAttendance(labName, weekNumber, group, allStudents, professor);

            presence = document.getElementById('presence');
            presence.innerHTML = 'Total presence: ' + students.length;

            let attendance = document.getElementById('attendance');
            let studentNode, input, button;

            students.forEach(function (student) {
                if (document.getElementById(student.name) === null) {
                    studentNode = createNode(student.name, 'li', false, false);
                    attendance.appendChild(studentNode);
                    input = createNode('points:', 'input', 'points-input', false);
                    button = createNode('Add', 'button', 'add-points', false, student.name)
                    studentNode.appendChild(input);
                    studentNode.appendChild(button);
                }

            });
        });
}


function addPointsToStudent(allStudents, professor) {

    let url = window.location.hash.split('/');
    let course = url[3];
    let weekNumber = url[2];
    let group = url[1];
    let students = getAttendance(course, weekNumber, group, allStudents, professor);
    let keys = getStudentsKeys(students);
    students.forEach(function (student) {
        let key = keys[student.id];
        let indexOfCourse = getCourseKey(student.courses, course);
        let week = weekNumber - 1;
        checkElement(student.name)
            .then(() => {
                let button = document.getElementById(student.name);
                button.addEventListener("click", function () {
                    var points = parseInt(button.previousSibling.value);
                    if (points) {
                        firebase.database().ref('users/' + key + '/StudentCourses/' +
                            indexOfCourse.toString() + '/Weeks/' + week.toString() + '/').update({
                                'LabPoints': points
                            });
                    }
                }, false);
            })
    });
}


function getAttendance(labName, weekNumber, group, allStudents, professor) {
    var studentsPrez = allStudents.filter(student => {
        return typeof (student.courses.find(function (course) {
            return course.name == labName && course.weeks.find(function (week) {
                return week.number == weekNumber &&
                    checkCode(professor, labName, week.code, weekNumber, group);
            });
        })) != 'undefined';
    });
    return studentsPrez;
}

function getStudentsKeys(students) {
    var db = firebase.database();
    var ref = db.ref('users');
    let keys = [];
    ref.on('value', function (data) {
        var i = 1;
        for (var key in data.val()) {
            stud = students.find(stud => stud.id === i);
            if (stud) {
                keys[i] = key;
            }
            i = i + 1;
        }
    });
    return keys;
}

function getCourseKey(courses, course) {
    var indexOfCourse;
    for (var i in courses)
        if (courses[i].name === course) {
            indexOfCourse = i;
        }
    return indexOfCourse;
}

function createWeek(number, seminarGroups, students, professor) {
    var parent = document.createElement("tr");
    var title = "Week " + number;
    var weekNumberNode = createNode(title, "td", "text");
    var link;
    var groupNode;
    parent.appendChild(weekNumberNode);
    url = window.location.href.split('/');
    var labName = url[url.length - 1].split('Lab')[0];

    for (var key in seminarGroups) {
        let group = seminarGroups[key];
        groupNode = createNode("note", "td", 'weekGroup', false);
        link = createNode(group, "a", false, "#group/" + group + "/" + number + "/" + labName);
        link.addEventListener("click", function () {
            weeksInfo(students, professor);
        }, false);
        groupNode.appendChild(link);
        parent.appendChild(groupNode);
    }
    return parent;
}

function checkCode(professor, labName, code, number, group) {
    let searchedCourse = professor.courses.find(c => {
        return c.name === labName
    })

    let goodWeek;

    searchedCourse.groups.forEach(function (sc) {
        sc.weeks.forEach(function (week) {
            if (week.code === code && week.number.toString() == number && sc.name == group) {
                goodWeek = week;
            }
        })
    })

    if (goodWeek) {
        return true;
    }
    return false;
}


function weeksInfo(students, professor) {
    Promise.all([checkElement('weeks'), checkStudents(students)]).then(function () {
        var seminarNodes = document.getElementsByClassName('weekGroup');
        for (let item of seminarNodes) {
            item.addEventListener("click", function () {
                groupView(students, professor);
            }, false);
        }
    });
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
    indexOfCourse = getCourseKey(professor.courses, course);

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
            'Number': week + 1,
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


function getAllStudents(users, professor) {
    let students = [];
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
    return students;
}

function getStudents(users) {
    let students = [];
    var studentsJson = users.filter(student => {
        return student.IsStudent;
    });
    for (var key in Object.keys(studentsJson)) {
        var student = new Student(studentsJson[key]);
        students.push(student);
    }
    return students;
}

function populate() {
    var email = localStorage.getItem('email');

    firebase.database().ref('users').on('value', function (data) {

        var users = Object.values(data.val());
        var loggedUser = users.find(function (user) { return user.Email === email; });
        var professor = new Professor(loggedUser);
        let students = getAllStudents(users, professor);

        populateProfessorRegisterView(professor.courses);
        onClickRegisterView(professor.courses, professor);
        onClickGenerate(professor.courses);

        weeksInfo(students, professor);
        groupView(students, professor);
        drawPointsCanvas(getStudents(users));
        drawAttendanceChart(getStudents(users));
        addWeeksForSubject(students, professor);
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
    let students = getAllStudents(users, professor);

    if( allCourses !== undefined){
        addSubjectsToMenu(allCourses, students, professor, getStudents(users));
    }
    checkElement('attendance').then(() => {
        addPointsToStudent(students, professor);
    })
});

populate();




