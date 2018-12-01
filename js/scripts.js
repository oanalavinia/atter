
function hideOtherViews() {

    var list = document.querySelectorAll(".show-view");


    for ($i = 0; $i < list.length; $i++) {

        list[$i].classList.remove("show-view");
        list[$i].classList.add("hide-view");
    }
}


function toggleMainMenu(id) {
        var view = document.getElementById(id);
        hideOtherViews();

        view.classList.remove("hide-view");
        view.classList.add("show-view");
}

function login(){
    // location.href = "../professor-dashboard/professor-dashboard.html";
    location.href = "../student-dashboard/student-dashboard.html";
}


function popup() {
    var popup = document.getElementById("popup");
    popup.classList.toggle("hide-view");
}
