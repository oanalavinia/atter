class Student {
    constructor(user) {
        this.email = user.Email;
        this.firstName = user.FirstName;
        this.group = user.Group;
        this.lastName = user.LastName;
        this.password = user.Password;
        this.year = user.Year;
        this.id = user.Id;
        this.studentCourses = user.StudentCourses;
    }

    get courses() {
        var allCourses = [];
        for (var key in this.studentCourses) {
            var thisCourse = new Course(this.studentCourses[key]);
            allCourses.push(thisCourse);
        }
        return allCourses;
    }

    get name() {
        return this.firstName + ' ' + this.lastName;
    }
}