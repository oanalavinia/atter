(function () {
	function init() {
		var router = new Router([
			new Route('reports-professor', 'reports-professor-view.html', true),
			new Route('register', 'register-class-view.html'),
			new Route('statistics', 'statistics-view.html'),
			new Route('statistics/group-name', 'group-view.html')

		]);
	}
	init();
}());