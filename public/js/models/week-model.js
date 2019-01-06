class Week {
    constructor(week) {
       
        this.labPoints = week.LabPoints;
        this.number = week.Number;
        this.code = week.GeneratedCode;
    }

    getWeekNumber() {
        return "Week " + this.number;
    }

    getLabAttendance() {
            return "Lab: present";
       
    }


    getBonus() {
        return "Bonus: " + this.labPoints;
    }
}

