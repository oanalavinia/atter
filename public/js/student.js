//helpers
function getCourses(student) {
    return new Promise(resolve => {
        student.courses;
    });
}

async function checkCourses(student) {
    while (student.courses === null) {
        await getCourses(student)
    }
    return true;
}

//menu
function createSubjectsList(student) {
    var course;
    var link;
    let allCourses = student.courses;

    var subjectList = document.getElementById("subjectsList");
    for (var key in Object.keys(allCourses)) {
        let obj = allCourses[key];
        course = createNode("note", "li", false, false);
        link = createNode(obj.name, "a", false, "#course/" + obj.name);
        course.appendChild(link);
        subjectList.appendChild(course);

        if (window.location.hash.substr(1) === "course/" + obj.name) {
            populateWeeks(student);
        }

    }
}

//course view
function createStudentWeek(week) {
    var parent = document.createElement("tr");
    var number = createNode(week.getWeekNumber(), "th", "text");
    var labPresence = createNode(week.getLabAttendance(), "th", "text");
    var bonus = createNode('Bonus: ' + week.labPoints, "th", "text");

    parent.appendChild(number);
    parent.appendChild(labPresence);
    parent.appendChild(bonus);
    return parent;
}

function populateWeeks(student) {
    let weeksNode;
    let thisWeeks;
    let courseFromUrl = window.location.hash.split('/')[1];
    let createStudentWeeks = function() {
        weeksNode = document.getElementById("weeks");
        while (weeksNode.firstChild) {
            weeksNode.removeChild(weeksNode.firstChild);
        }
        for (var key in thisWeeks) {
            var obj = thisWeeks[key];
            var weekNode = createStudentWeek(obj);
            weeksNode.appendChild(weekNode);
        }
    }
    student.courses.forEach(function(course) {
        if(course.name == courseFromUrl) {
            thisWeeks = course.weeks;
        }
    });

    checkElement('weeks').then(element => createStudentWeeks());

    window.onhashchange = function(event) {
        let courseFromUrl = window.location.hash.split('/')[1];
        student.courses.forEach(function(course) {
            if(course.name == courseFromUrl) {
                thisWeeks = course.weeks;
            }
        });
        checkElement('weeks').then(element => createStudentWeeks());
    }
}

//attend view
function populateStudentAttendView(student) {
    var courses = student.courses.map(course => { return course.name });
    checkElement('attendCourse')
        .then((element) => {
            if (document.getElementById('courseOption').childElementCount != courses.length) {
                for (var key in courses) {
                    createDropdownOption('option', courses[key], 'courseOption');
                }
            }
        });
}

function checkCode(student, professors) {
    
    var code = parseInt(document.getElementById('studentCode').value);
    var course = document.getElementById('courseOption').value;
    var profEmail = document.getElementById('profEmail').value;

    var professor = professors.find(function (prof) {
        return prof.email === profEmail;
    })
    var searchedCourse = professor.courses.find(c => {
        return c.name === course;
    })

    var currentTime = new Date();
    currentTime = currentTime.valueOf();

    var group = searchedCourse.groups.filter(sc => {
        return sc.name === student.group &&
            typeof (sc.weeks.find(week => {
                return week.code === code /*&& (currentTime - week.hour)/1000/60/60 <= 2*/
            })) != 'undefined'
    });
    return group;
}

function checkIfProfEmailMatchesCourse(professors) {
    var course = document.getElementById('courseOption').value;
    var profEmail = document.getElementById('profEmail').value;
    var prof = professors.find(prof => {
        return prof.email === profEmail
    });
    if(prof !== undefined){
        var prof = prof.professorCourses.find(c => { return c.Name === course });
        return prof;

    }
   
   return undefined;
}


function onClickRegister(student, professors) {
    checkElement('registerAttendance')
        .then((element) => {
            document.getElementById('registerAttendance').addEventListener('click',
                function () {
                    localStorage.removeItem('alerted');
                    var prof = checkIfProfEmailMatchesCourse(professors);
                    if (prof === undefined) {
                        var alerted = localStorage.getItem('alerted') || '';
                        if (alerted != 'yes') {
                         alert('The proffesor\'s email and the course do not match');
                         localStorage.setItem('alerted','yes');
                        }
                    }
                    else {
                        addAttendanceToCourse(student, professors);
                    }
                });
        });
}

function addAttendanceToCourse(student, professors) {
    localStorage.removeItem('alerted2');
    localStorage.removeItem('alerted4');
    var code = parseInt(document.getElementById('studentCode').value);
    var course = document.getElementById('courseOption').value;
    var group = checkCode(student, professors);

    if (group.length === 0) {
        let alerted = localStorage.getItem('alerted2') || '';
        if (alerted != 'yes') {
            alert('The code doesnt match any available course');
            localStorage.setItem('alerted2', 'yes');
        }

    }
    else {
        var courseWeeks = group.map(gr => {
            return gr.weeks;
        });

        var week = courseWeeks[0].find(function (week) {
            return week.code === code
        });

        var number = week.number - 1;
        var userId = localStorage.getItem('key');

        let indexOfCourse = 0;
        for (var i in student.courses) {
            if (student.courses[i].name === course) {
                indexOfCourse = i;
            }
        }

        firebase.database().ref('users/' + userId + '/StudentCourses/' +
            indexOfCourse.toString() + '/Weeks/' + number.toString() + '/').set(
                {
                    'GeneratedCode': code,
                    'LabPoints': 0,
                    'Number': number + 1

                });
        let alerted1 = localStorage.getItem('alerted4') || '';
        if (alerted1 != 'yes') {
            alert('Succesfully registered to course!');
            localStorage.setItem('alerted4', 'yes');

        }
    }
}


function onClickAttendView(student, professors) {
    document.getElementById('attend').addEventListener('click',
        function () {
            populateStudentAttendView(student);
            onClickRegister(student, professors);
        });
}

function updateInfoToCourses(student) {
    var check = document.getElementById("subjectsList");
    var course = check.firstChild.nextSibling;
    course.addEventListener("click", function () {
      populateWeeks(student);
    });

    while(course.nextSibling){
      course.addEventListener("click", function () {
        populateWeeks(student);
      });
      course = course.nextSibling;
    }
}

function populate() {
    ref.on('value', function (data) {
        var users = Object.values(data.val());
        var professors = [];
        var professorJson = users.filter((professor) => {
            return !professor.IsStudent
        });

        for (var key in Object.keys(professorJson)) {
            var professor = new Professor(professorJson[key]);
            professors.push(professor);
        }
        var loggedUser = users.find(function (user) { return user.Email === email; });
        var student = new Student(loggedUser);

        populateStudentAttendView(student);
        onClickAttendView(student, professors);
        onClickRegister(student, professors);
        checkCourses(student).then((element) => {
             updateInfoToCourses(student);
        });
        populateWeeks(student);
        drawPointsCanvas(getStudents(users));
        drawAttendanceChart(getStudents(users));
    });


}

var email = localStorage.getItem('email');
var db = firebase.database();
var ref = db.ref('users');

ref.once('value', function (data) {
    var users = Object.values(data.val());
    var loggedUser = users.find(function (user) { return user.Email === email; });
    var student = new Student(loggedUser);
    var userName = document.getElementById("user");
    userName.innerHTML = loggedUser.FirstName + ' ' + loggedUser.LastName;
    createSubjectsList(student);
    document.getElementById('reports').addEventListener("click", function () {
        drawPointsCanvas(getStudents(users));
        drawAttendanceChart(getStudents(users));
    });
});

populate();

