
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
        // course.addEventListener("click", function () {
        //     populateWeeks(obj.getWeeks());
        // });

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
    var bonus = createNode(week.getBonus(), "th", "text");
    var button = htmlToElement('<th><button >Details</button></th>');
    button.addEventListener("click", function () {
        // popup
    }, false);
    parent.appendChild(number);
    parent.appendChild(labPresence);
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

function populateStudentAttendView(student) {
    var courses = student.courses.map(course => { return course.title });
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
    var code = document.getElementById('studentCode').value;
    var course = document.getElementById('courseOption').value;
    var profEmail = document.getElementById('profEmail').value;

    var professor = professors.find(function (prof) {
        return prof.email === profEmail;
    })
    var searchedCourse = professor.courses.find(c => {
        return c.name === course;
    })
    var group = searchedCourse.groups.filter(sc => {
        return sc.name === student.group &&
            typeof (sc.weeks.find(week => {
                return week.code.toString() === code
            })) != 'undefined'
    });
    return group;
}

function addAttendanceToCourse(student, professors) {
    var code = document.getElementById('studentCode').value;
    var course = document.getElementById('courseOption').value;
    var group = checkCode(student, professors);

    if (group.length === 0) {
        alert('The code doesnt match any course');
    }
    else {
        var courseWeeks = group.map(gr => {
            return gr.weeks;
        });

        var week = courseWeeks[0].find(function (week) {
            return week.code.toString() === code
        });

        var number = week.number - 1;
        var userId = localStorage.getItem('key');

        let indexOfCourse = 0;
        for (var i in student.courses) {
            if (student.courses[i].title === course) {
                indexOfCourse = i;
            }
        }


        firebase.database().ref('users/' + userId + '/StudentCourses/' + indexOfCourse.toString() + '/Weeks/' + number.toString() + '/').set(
            {
                'Attendance': 'true',
                'GeneratedCode': code,
                'LabPoints': '',
                'Number': number + 1

            });
    }
}

function checkIfProfEmailMatchesCourse(professors) {
    var course = document.getElementById('courseOption').value;
    var profEmail = document.getElementById('profEmail').value;
    var prof = professors.find(prof => {
        return prof.email === profEmail
    });

    var prof = prof.professorCourses.find(c => { return c.Name === course });
    return prof;

}

function onClickRegister(student, professors) {
    checkElement('registerAttendance')
        .then((element) => {
            document.getElementById('registerAttendance').addEventListener('click',
                function () {
                    var prof = checkIfProfEmailMatchesCourse(professors);

                    if (prof === undefined) {
                        alert('The proffesor email and the course do not match');
                    }
                    else {
                        addAttendanceToCourse(student, professors);
                    }
                });
        });
}


function onClickAttendView(student, professors) {
    document.getElementById('attend').addEventListener('click',
        function () {
            populateStudentAttendView(student);
            onClickRegister(student, professor);
        });
}

//to be discussed 
var email = localStorage.getItem('email');
var db = firebase.database();
var ref = db.ref('users');

var stud = ref.once('value', function (data) {
    var users = Object.values(data.val());
    var loggedUser = users.find(function (user) { return user.Email === email; });
        
        var student = new Student(loggedUser);

        var userName = document.getElementById("user");
        userName.innerHTML = loggedUser.FirstName + ' ' + loggedUser.LastName;
        createSubjectsList(student.courses); 
return student;

});

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

function updateInfoToCourses(allCourses){
    var check = document.getElementById("subjectsList");
    var course = check.firstChild.nextSibling;
    course.addEventListener("click", function () {
      populateWeeks(allCourses[0].getWeeks());
    });
    var key = 1;
    while(course.nextSibling){
      course = course.nextSibling;
      var obj = allCourses[key];
      course.addEventListener("click", function () {
        populateWeeks(obj.getWeeks());
      });
      key++;
    }
}


// call the functions that create weeks 
function populate() {

    var email = localStorage.getItem('email');
    var db = firebase.database();
    var ref = db.ref('users');

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
        allCourses = [];
        var student = new Student(loggedUser);

        populateStudentAttendView(student);
        onClickAttendView(student, professors);
        onClickRegister(student, professors);
        checkCourses(student).then((element) => {
            updateInfoToCourses(student.courses);
            for (var key in Object.keys(student.courses)) {
                populateWeeks(student.courses[key].getWeeks());
            }
        });
        
       

    });


}

populate();