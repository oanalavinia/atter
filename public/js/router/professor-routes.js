(function () {
	function init() {
		 
		var router = new Router([
			new Route('register', 'register-class-view.html', true),
			new Route('labs', 'statistics-view.html'),
			new Route('course', 'course-view.html'),
			new Route('group', 'group-view.html'),


		]);
	}
	init();
}());