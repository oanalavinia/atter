class Week {
    constructor(week) {
        this.courseAttendance = week.CourseAttendance;
        this.labAttendance = week.LabAttendance;
        this.labPoints = week.LabPoints;
        this.number = week.Number;
        this.code = week.GeneratedCode;
    }

    getWeekNumber() {
        return "Week " + this.number;
    }

    getLabAttendance() {
        if (this.labAttendance == true) {
            return "Lab: present";
        } else {
            return "Lab: absent";
        }
    }

    getCourseAttendance() {
        if (this.labAttendance == true) {
            return "Course: present";
        } else {
            return "Course: absent";
        }
    }

    getBonus() {
        return "Bonus: " + this.labPoints;
    }
}

