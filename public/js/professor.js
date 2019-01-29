//helpers

function getPromiseStudents(students) {
    return new Promise(resolve => {
        students;
    });
}

async function checkStudents(students) {
    while (students === undefined) {
        await getPromiseStudents(students)
    }
    return true;
}

function findGroupsForCourse(courses, labName){
    if(labName){
        var course = courses.find(c => c.name === labName)
        var semGroups = course.groups.map(c => {
            return c.name;
        });
        return semGroups;
    }
   
}

function getCourseKey(courses, course) {
    var indexOfCourse;
    for (var i in courses)
        if (courses[i].name === course) {
            indexOfCourse = i;
        }
    return indexOfCourse;
}

function getStudentsForProf(users, professor) {
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


// menu 
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

function addSubjectsToMenu(allCourses, students, professor, allStudents) {
    var course;
    var subjectsList = document.getElementById("subjectsList");
    for (var key in allCourses) {
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

// labs view
function addWeeksForSubject(students, professor) {
    var weeksNode;
    
    let labName = window.location.hash.split('/')[1];

    let groups = findGroupsForCourse(professor.courses, labName);

    drawPointsCanvasS(students, professor);
    drawAttendanceChartS(students, professor);

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

//group view
function groupView(allStudents, professor) {
    var thisGroup;
    Promise.all([checkElement('group'), checkElement('week'),
    checkElement('presence'), checkElement('attendance')])
        .then(function () {
            let urlLocation = window.location.hash.split('/');
            let labName = urlLocation[1];
            let weekNumber = urlLocation[3];
            let group = urlLocation[2];

            thisGroup = document.getElementById('group');
            thisGroup.innerHTML = 'Group: ' + group;

            thisWeek = document.getElementById('week');
            thisWeek.innerHTML = 'Week: ' + weekNumber;

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

    let urlLocation = window.location.hash.split('/');
    let course = urlLocation[1];
    let weekNumber = urlLocation[3];
    let group = urlLocation[2];
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

function createWeek(number, seminarGroups, students, professor) {
    var parent = document.createElement("tr");
    var title = "Week " + number;
    var weekNumberNode = createNode(title, "td", "text");
    var link;
    var groupNode;
    parent.appendChild(weekNumberNode);
    let labName = window.location.hash.split('/')[1]

    for (var key in seminarGroups) {
        let group = seminarGroups[key];
        groupNode = createNode("note", "td", 'weekGroup', false);
        link = createNode(group, "a", false, "#group/" + labName + "/" + group + "/" + number);
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
            let groups = findGroupsForCourse(courses, document.getElementById('course').value)
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
    onClickGenerate(professor);
    populateProfessorRegisterView(allCourses);
    checkElement('registerForm')
        .then(() => {
            document.getElementById('course').addEventListener('change', function () {
                populateProfessorRegisterView(allCourses);
            });
        });
}

function submitCode(professor) {
    var course = document.getElementById('course').value;
    var group = document.getElementById('group').value;
    var week = document.getElementById('week').value.split(' ')[1];
    var code = Math.floor(Math.random() * 9000) + 1000;
    document.getElementById('code').innerHTML = code;
    var profKey = localStorage.getItem('key');
    let indexOfGroup = 0;
    let indexOfCourse = getCourseKey(professor.courses, course);

    for (var i in professor.courses[indexOfCourse].groups) {
        if (professor.courses[indexOfCourse].groups[i].name === group) {
            indexOfGroup = i;
        }
    }
    var hour = new Date();
    hour = hour.valueOf();
    week = parseInt(week) - 1;

    firebase.database().ref('users/' + profKey + '/ProfessorCourses/' +
        indexOfCourse.toString() + '/SeminarGroups/' + indexOfGroup.toString() + '/Weeks/' + week.toString() + '/').set({
            'Code': code,
            'Number': week + 1,
            'Hour': hour
        });

    let alerted = localStorage.getItem('alerted3') || '';
    if (alerted != 'yes') {
        alert('Succesfully submited!');
        localStorage.setItem('alerted3', 'yes');

}

function onClickGenerate(professor) {
    checkElement('submit')
        .then((element) => {
            document.getElementById("submit").addEventListener('click', function (event) {
                event.preventDefault();
                submitCode(professor);
            });
        });
}


function populate() {
    
    firebase.database().ref('users').on('value', function (data) {
        var users = Object.values(data.val());
        var loggedUser = users.find(function (user) { return user.Email === email; });
        var professor = new Professor(loggedUser);
        let students = getStudentsForProf(users, professor);

        populateProfessorRegisterView(professor.courses);
        document.getElementById('register-class-link').addEventListener('click', function(){
            onClickRegisterView(professor.courses, professor);        
        })
        onClickRegisterView(professor.courses, professor);
       

        weeksInfo(students, professor);
        groupView(students, professor);
        drawPointsCanvas(getStudents(users));
        drawAttendanceChart(getStudents(users));
        // drawPointsCanvasS(students, professor);
        addWeeksForSubject(students, professor);
        window.onhashchange = function(event){
            addWeeksForSubject(students, professor);
            addPointsToStudent(students, professor);
        }
       
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
    let students = getStudentsForProf(users, professor);

    if( allCourses !== undefined){
        addSubjectsToMenu(allCourses, students, professor, getStudents(users));
    }
});

populate();




