function draw(canvas, values, groups, dictionary) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    var width = 10;
    var x = 0;
     
    for (var i =0; i<values.length; i++) {
        context.fillStyle = '#518BFF'; 
        var h = values[i];
        context.fillRect(x, canvas.height - h, width, h);
         
        x +=  width+10;
        /* text to display Bar number */
        context.fillStyle = '#000000';
        context.fillText(values[i], x-20, canvas.height - h -10);
        context.fillStyle = '#000000';
        context.fillText(groups[i], x-20, canvas.height - h -20);
    }
}

// Just to have some test values.
// var groupPoints = {
//     "A1" : 4,
//     "A2" : 7,
//     "A3" : 8,
//     "A4" : 10,
//     "A5" : 16,
//     "A6" : 20,
//     "A7" : 50,
//     "B1" : 20,
//     "B2" : 15,
//     "B3" : 33,
//     "B4" : 14,
//     "B5" : 19,
//     "B6" : 13,
//     "B7" : 44,
//     "E" : 22
// }

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
        let courseName = url[url_length].split('Course')[0];
        
        students.forEach(function(student) {
            let courses = student.courses;
            courses.forEach(function(course) {
                if(course.title == courseName) {
                    let weeks = course.weeks;
                    weeks.forEach(function(week) {
                        groupPoints[student.group] += week.LabPoints;
                    })
                }
            });
        });
        let values = getValues(groupPoints);
        let groups = ["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","E"];
        attendChart = document.getElementById("pointsChart");
        draw(attendChart, values, groups, groupPoints);
    })
}