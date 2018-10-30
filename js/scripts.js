
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
    location.href = "../professor-dashboard/professor-dashboard.html";
    //location.href = "../student-dashboard/student-dashboard.html";
}

function resizing() {
    var w = window.outerWidth;
    // var h = window.outerHeight;
    if(document.getElementsByClassName("user-info")[0]){
        if(w<1050){
            document.getElementsByClassName("user-info")[0].style.fontSize="20px";
            document.getElementsByClassName("title-item")[0].style.fontSize="16px";
            document.getElementsByClassName("title-item")[1].style.fontSize="16px";
            document.getElementsByClassName("title-item")[2].style.fontSize="16px";
            document.getElementsByClassName("list-items")[0].style.fontSize="10px";
        } else {
            document.getElementsByClassName("user-info")[0].style.fontSize="24px";
            document.getElementsByClassName("title-item")[0].style.fontSize="22px";
            document.getElementsByClassName("title-item")[1].style.fontSize="22px";
            document.getElementsByClassName("title-item")[2].style.fontSize="22px";
            document.getElementsByClassName("list-items")[0].style.fontSize="16px";
        }
    } else if(document.getElementsByClassName("image")[0]){
        if(w<800){
            document.getElementsByClassName("image")[0].style.display="none";
        } else {
            document.getElementsByClassName("image")[0].style.display="block";
        }
    }
}

