
function hideOtherViews() {

    var lista = document.querySelectorAll(".show-view");


    for ($i = 0; $i < lista.length; $i++) {

        lista[$i].classList.remove("show-view");
        lista[$i].classList.add("hide-view");
    }
}


function toggleMainMenu(id) {

    if (id.localeCompare('course-view') == 0) {

        var r = document.getElementById('course-view');
        hideOtherViews();

        r.classList.remove("hide-view");
        r.classList.add("show-view");


    }
    else
        if (id.localeCompare('reports-view') == 0) {

            var r = document.getElementById('reports-view');
            hideOtherViews();
            r.classList.remove("hide-view");
            r.classList.add("show-view");
        }
        else if (id.localeCompare('attend') == 0) {

            var r = document.getElementById('attend');
            hideOtherViews();
            r.classList.remove("hide-view");
            r.classList.add("show-view");
        }
        else if (id.localeCompare('register-class-view') == 0) {

            var r = document.getElementById('register-class-view');
            hideOtherViews();
            r.classList.remove("hide-view");
            r.classList.add("show-view");
        }
        else if (id.localeCompare('statistics-view') == 0) {

            var r = document.getElementById('statistics-view');
            hideOtherViews();
            r.classList.remove("hide-view");
            r.classList.add("show-view");
        }
        else if (id.localeCompare('class-view') == 0) {

            var r = document.getElementById('class-view');
            hideOtherViews();
            r.classList.remove("hide-view");
            r.classList.add("show-view");
        }
}

