class ProfCourse {
    constructor(course) {
        this.isCourseProf = course.IsCourseProf;
        this.name = course.Name;
        this.seminarGroups = course.SeminarGroups;
    }
    
    get groups(){
        var groups = [];
        for (var key in this.seminarGroups) {
            var week = new Group(this.seminarGroups[key]);
            groups.push(week);
        }
        return groups;

    }
    
    get courseName() {
        return this.name + "/ Course";
    }

    get labName() {
        return this.name + "/ Lab";
    }
}

class Group{
    constructor(group){
        this.name = group.Name;
        this.groupWeeks = group.Weeks;
    }

    get weeks(){
        var weeks = [];
        for (var key in this.groupWeeks) {
            var week = new ProfWeek(this.groupWeeks[key]);
            weeks.push(week);
        }
        return weeks;

    }
}

class ProfWeek{
    constructor(week){
        this.code = week.Code;
        this.number = week.Number;
    }
}