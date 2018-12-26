(function () {
	function init() {
		var router = new Router([
		new Route('reports-student', 'raports-student-view.html', true),
		new Route('attend', 'attend-view.html'),
		new Route('course', 'course-view.html')

		]);
	}
	init();
}());