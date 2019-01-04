class ProfCourse {
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
