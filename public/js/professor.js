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
            var thisCourse = new Course(this.professorCourses[key]);
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

function createSubjectNode(name) {
    course = createNode("note", "li", false, false);
    link = createNode(name, "a", false, "#statistics");
    course.appendChild(link);
    course.addEventListener("click", closeMenu);
    return course;
}

function createSubjectsList(allCourses) {
    var course;
    var elementsArray = [];
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
            populateWeeks(obj.seminarGroups);
        }, false);
    }
}

function populateWeeks(seminarGroups) {
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

function groupView(group) {
    var thisGroup;
    checkElement('group').then((element) => {
        thisGroup = document.getElementById('group');
        thisGroup.innerHTML = 'Group: ' + group;
    });
}

function createWeek(number, seminarGroups) {
    var parent = document.createElement("tr");
    var title = "Week " + number;
    var number = createNode(title, "td", "text");
    var link;
    var groupNode;
    parent.appendChild(number);
    for(var key in Object.keys(seminarGroups)) {
        let group = seminarGroups[key];
        groupNode = createNode("note", "td", false, false);
        link = createNode(group, "a", false, "#statistics/group-name");
        link.addEventListener("click", function() {
            groupView(group);
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
    createSubjectsList(allCourses);
}

window.onload = function () {
    populate();    
}