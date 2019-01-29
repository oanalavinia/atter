function drawS(canvas, values, groups, cWidth, cHeight) {
    // setting canvas
    let context = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    context.canvas.height = rect.height * dpr;
    context.canvas.width = rect.width * dpr;
    context.clearRect(0, 0, canvas.width, canvas.height);

    //scalling values
    let width = 20;
    let x = 0;
    let nr = values.length;
    let movex = Math.round(context.canvas.width / nr);
    
    // draw
    for (let i =0; i<values.length; i++) {
        //values
        context.beginPath();
        context.fillStyle = '#518BFF';
        context.fill();
        let h = values[i];
        context.fillRect(x, canvas.height - 20, width + movex, -h);
        context.stroke();

        x +=  width + movex;
        // points
        context.fillStyle = '#000000';
        context.font = '20pt Calibri';
        if(canvas.id == 'pointsChartS') {
            context.fillText(values[i], x-movex, canvas.height - h - 25);
        } else {
            context.fillText(values[i] + '%', x-movex, canvas.height - h - 25);
        }

        // groups
        context.textAlign = 'center';
        context.fillText(groups[i], x - movex, canvas.height);
    }
}

function getValues(dictionary) {
    let values = []
    for(var key in dictionary) {
        values.push(dictionary[key]);
    }
    return values;
}


function drawPointsCanvasS(students, professor) {
    Promise.all([checkStudents(students), checkElement('pointsChartS')]).then(function() {
        let labName = window.location.hash.split('/')[1];
        let groupPoints = {};
        var groups = findGroupsForCourse(professor.courses, labName);

        for(key in Object.keys(groups)) {
            groupPoints[groups[key]] = 0;
        }
        
        students.forEach(function(student) {
            let courses = student.courses;
            courses.forEach(function(course) {
                if(course.name == labName && course.seminarProfessor == professor.name) {
                    let weeks = course.weeks;
                    if(weeks != undefined) {
                        weeks.forEach(function(week) {
                            groupPoints[student.group] += week.labPoints;
                        })
                    }
                }
            });
        });
        let values = getValues(groupPoints);
        chart = document.getElementById("pointsChartS");
        drawS(chart, Object.values(groupPoints), groups, '400', '180');
    })
}


function drawAttendanceChartS(students, professor) {
    Promise.all([checkStudents(students), checkElement('attendanceChartS')]).then(function() {
        let labName = window.location.hash.split('/')[1];
        let groupAttendance = {};
        var groups = findGroupsForCourse(professor.courses, labName);
        
        let weeksNumber = 0;
        let number = 0;

        for(key in Object.keys(groups)) {
            groupAttendance[groups[key]] = 0;
        }

        students.forEach(function(student) {
            let courses = student.courses;
            courses.forEach(function(course) {
                if(course.name == labName && course.seminarProfessor == professor.name) {
                    let weeks = course.weeks;
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

        let values = getAttendanceValuesS(groupAttendance, weeksNumber, students);
        attendChart = document.getElementById("attendanceChartS");
        drawS(attendChart, values, Object.values(groups), '400', '180');
    })
}

function getAttendanceValuesS(groupAttendance, weeksNumber, students) {
    let numberOfStudents = {};
    let groups = Object.keys(groupAttendance);
    groups.forEach( function(group) {
        numberOfStudents[group] = 0;
    });

    students.forEach(function(student) {
        if(groups.includes(student.group)) {
            numberOfStudents[student.group] +=1;
        }
    });

    let values = []
    for(var key in groupAttendance) {
        let value = Math.round(groupAttendance[key] * 100 / (numberOfStudents[key] * weeksNumber));
        if (value) {
            values.push(value);
        } else {
            values.push(0);
        }
    }
    return values;
}