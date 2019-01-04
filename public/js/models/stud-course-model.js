class Course {
    constructor(course) {
        this.courseProfessor = course.CourseProfessor;
        this.seminarProfessor = course.SeminarProfessor;
        this.title = course.Title;
        this.weeks = course.Weeks;
    }

    getWeeks() {
        var allWeeks = []
        for (var key in this.weeks) {
            var thisWeek = new Week(this.weeks[key])
            allWeeks.push(thisWeek);
        }
        return allWeeks;
    }

    getNumberOfWeeks() {
        return this.weeks.length;
    }


}