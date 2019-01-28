function draw(canvas, values, groups, cWidth, cHeight) {
    var context = canvas.getContext('2d');
    // context.canvas.width  = cWidth;
    // context.canvas.height = cHeight;

    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    context.canvas.height = rect.height * dpr;
    context.canvas.width = rect.width * dpr;

    context.clearRect(0, 0, canvas.width, canvas.height);
    var width = 10;
    var x = 0;
    let movex = 20;
     
    for (var i =0; i<values.length; i++) {
        //values
        context.beginPath();
        context.fillStyle = '#518BFF';
        context.fill();
        var h = values[i];
        context.fillRect(x, canvas.height - 20, width + movex, -h);
        context.stroke();
         
        x +=  width + movex;
        // points
        context.fillStyle = '#000000';
        context.font = '15pt Calibri';
        if(canvas.id == 'pointsChart' ) {
            context.fillText(values[i], x - movex, canvas.height - h - 25);
        } else {
            context.fillText(values[i] + '%', x - movex, canvas.height - h - 25);
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
        draw(attendChart, values, groups, '700', '250');
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

        let values = getAttendanceValues(groupAttendance, weeksNumber, students);
        let groups = ["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","E"];
        attendChart = document.getElementById("attendanceChart");
        draw(attendChart, values, groups, '700', '250');
    })
}

function getAttendanceValues(dictionary, weeksNumber, students) {
    var numberOfStudents = {
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

    students.forEach(function(student) {
        numberOfStudents[student.group] +=1;
    });

    let values = []
    for(var key in dictionary) {
        let value = Math.round(dictionary[key] * 100 / (numberOfStudents[key] * weeksNumber));
        if (value) {
            values.push(value);
        } else {
            values.push(0);
        }
    }
    return values;
}

// function drawPointsCanvasS(students, professor) {
//     Promise.all([checkStudents(students), checkElement('pointsChartS')]).then(function() {
//         let url = window.location.href.split('/');
//         let labName = url[url.length-1];
//         let groupPoints = {};
//         let groupss = [];

//         // TODO: refactor this.
//         var course = professor.courses.find(c => c.name === labName)
//         var groups = course.seminarGroups.map(c => {
//             return c.Name;
//         });
//         for(key in Object.keys(groups)) {
//             groupPoints[groups[key]] = 0;
//             groupss.push(groups[key]);
//         }
        
//         students.forEach(function(student) {
//             let courses = student.courses;
//             courses.forEach(function(course) {
//                 if(course.name == labName) {
//                     let weeks = course.studentWeeks;
//                     if(weeks != undefined) {
//                         weeks.forEach(function(week) {
//                             groupPoints[student.group] += week.LabPoints;
//                         })
//                     }
//                 }
//             });
//         });
//         let values = getValues(groupPoints);
//         // let groups = ["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","E"];
//         chart = document.getElementById("pointsChartS");
//         draw(chart, values, groupss, '250', '250', 50);
//     })
// }

