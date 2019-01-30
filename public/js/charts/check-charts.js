function draw(canvas, values, keys, cWidth, cHeight) {
    let context = canvas.getContext('2d');
    context.canvas.height = cHeight;
    context.canvas.width = cWidth;

    context.clearRect(0, 0, canvas.width, canvas.height);
    let width = 40;
    let x = 0;
    let movex = Math.round(context.canvas.width / values.length);
     
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
        context.font = '15pt Calibri';
        context.fillText(values[i], x - movex, canvas.height - h - 25);

        // keys
        context.textAlign = 'center';
        context.fillText(keys[i], x - movex, canvas.height);
    }
}


function drawPointsCanvas(student) {
    Promise.all([checkStudents(student), checkElement('pointsSeminars')]).then(function() {
        let seminarPoints = {};

        student.courses.forEach(function(course) {
            seminarPoints[course.name] = 0;
            let weeks = course.weeks;
            if(weeks != undefined) {
                weeks.forEach(function(week) {
                    seminarPoints[course.name] += week.labPoints;
                })
            }
        });
        attendChart = document.getElementById("pointsSeminars");
        draw(attendChart, Object.values(seminarPoints), Object.keys(seminarPoints), '450', '200');
    })
}

function drawAttendanceChart(student) {
    Promise.all([checkStudents(student), checkElement('attendanceSeminars')]).then(function() {
        let seminarsAttendance = {};

        student.courses.forEach(function(course) {
            seminarsAttendance[course.name] = 0;
            let weeks = course.weeks;
            if(weeks != undefined) {
                weeks.forEach(function() {
                    seminarsAttendance[course.name] += 1;
                });
            }
        });

        attendChart = document.getElementById("attendanceSeminars");
        draw(attendChart, Object.values(seminarsAttendance), Object.keys(seminarsAttendance), '450', '200');
    })
}