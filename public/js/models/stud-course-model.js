class Course {
    constructor(course) {
        this.courseProfessor = course.CourseProfessor;
        this.seminarProfessor = course.SeminarProfessor;
        this.name = course.Title;
        this.studentWeeks = course.Weeks;
    }

    get weeks() {
        var allWeeks = []
        for (var key in this.studentWeeks) {
            var thisWeek = new Week(this.studentWeeks[key])
            allWeeks.push(thisWeek);
        }
        return allWeeks;
    }

    getNumberOfWeeks() {
        return this.weeks.length;
    }


}