function draw(canvas, values, groups) {

    var context = canvas.getContext('2d');
    context.canvas.width  = '700';
    context.canvas.height = '250';
    context.clearRect(0, 0, canvas.width, canvas.height);
    var width = 25;
    var x = 0;
     
    for (var i =0; i<values.length; i++) {
        //values
        context.beginPath();
        context.fillStyle = '#518BFF';
        context.fill();
        var h = values[i];
        context.fillRect(x, canvas.height - 20, width+20, -h);
        context.stroke();
         
        x +=  width+20;
        // points
        context.fillStyle = '#000000';
        context.font = '15pt Calibri';
        context.fillText(values[i], x-20, canvas.height - h - 25);

        // groups
        context.textAlign = 'center';
        context.fillText(groups[i], x - 20, canvas.height);
    }
}

function getValues(dictionary) {
    let values = []
    for(var key in dictionary) {
        values.push(dictionary[key]);
    }
    return values;
}


function drawPointsCanvas(students) {
    Promise.all([checkStudents(students), checkElement('pointsChart')]).then(function() {
        var groupPoints = {
            "A1" : 0,
            "A2" : 0,
            "A3" : 0,
            "A4" : 0,
            "A5" : 0,
            "A6" : 0,
            "A7" : 0,
            "B1" : 0,
            "B2" : 0,
            "B3" : 0,
            "B4" : 0,
            "B5" : 0,
            "B6" : 0,
            "B7" : 0,
            "E" : 0
        }

        let url = window.location.href.split('/');
        let url_length = url.length-1;
        let courseName = url[url_length];
        
        students.forEach(function(student) {
            let courses = student.courses;
            courses.forEach(function(course) {
                if(course.name == courseName) {
                    let weeks = course.studentWeeks;
                    if(weeks != undefined) {
                        weeks.forEach(function(week) {
                            groupPoints[student.group] += week.LabPoints;
                        })
                    }
                }
            });
        });
        let values = getValues(groupPoints);
        let groups = ["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","E"];
        attendChart = document.getElementById("pointsChart");
        draw(attendChart, values, groups);
    })
}

function drawAttendanceChart(students) {
    Promise.all([checkStudents(students), checkElement('attendanceChart')]).then(function() {
        var groupAttendance = {
            "A1" : 0,
            "A2" : 0,
            "A3" : 0,
            "A4" : 0,
            "A5" : 0,
            "A6" : 0,
            "A7" : 0,
            "B1" : 0,
            "B2" : 0,
            "B3" : 0,
            "B4" : 0,
            "B5" : 0,
            "B6" : 0,
            "B7" : 0,
            "E" : 0
        }

        let url = window.location.href.split('/');
        let url_length = url.length-1;
        let courseName = url[url_length];
        
        let weeksNumber = 0;
        let number = 0;
        students.forEach(function(student) {
            let courses = student.courses;
            courses.forEach(function(course) {
                if(course.name == courseName) {
                    let weeks = course.studentWeeks;
                    if(weeks != undefined) {
                        weeks.forEach(function(week) {
                            groupAttendance[student.group] += 1;
                            number = week.Number;
                        });
                    }
                    if(number>weeksNumber) {
                        weeksNumber = number;
                    }
                }
            });
        });

        let values = getAttendanceValues(groupAttendance, weeksNumber);
        let groups = ["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","E"];
        attendChart = document.getElementById("attendanceChart");
        draw(attendChart, values, groups, groupAttendance);
    })
}

function getAttendanceValues(dictionary, weeksNumber) {
    let studentsNumber = 30;
    let maxNr = studentsNumber*weeksNumber;
    let values = []
    for(var key in dictionary) {
        let value = Math.round(dictionary[key] * 100 / maxNr);
        values.push(value);
    }
    return values;
}