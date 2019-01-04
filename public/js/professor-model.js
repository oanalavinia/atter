class Professor {
    constructor(user) {
        this.email = user.Email;
        this.firstName = user.FirstName;
        this.lastName = user.LastName;
        this.password =user.Password;
        this.professorCourses =user.ProfessorCourses;
    }

    get courses() {
        allCourses = [];
        for(var key in this.professorCourses ) {
            var thisCourse = new ProfCourse(this.professorCourses[key]);
            allCourses.push(thisCourse);
        }
        return allCourses;
    }

    get name() {
        return this.firstName + ' ' + this.lastName;
    }
}
