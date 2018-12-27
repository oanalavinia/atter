
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
    window.onload = function () {
        var popup = document.getElementById("details-popup");
        var details = document.getElementById("details");
        var span = document.getElementsByClassName("close")[0];

        details.onclick = function() {
            popup.style.display = "block";
        }

        span.onclick = function() {
            popup.style.display = "none";
        }

        window.onclick = function(event) {
          if (event.target == popup) {
            popup.style.display = "none";
          }
        }
    }
}

function openMenu(){
    
var menu = document.getElementById('menu');

    document.getElementById("responsive-menu").style.display = 'none';
    menu.style.display = 'block';
    menu.style.width = '80%';
    menu.style.height = '100%';
    

}

function closeMenu(){

    if (window.screen.width < 900) {

        var menu = document.getElementById('menu');
        menu.style.display = 'none';
        document.getElementById("responsive-menu").style.display = 'block';

    }
  
    
}

popup();
