// modal toggling

const modal1 = document.getElementById("modal-1");

const btn1 = document.getElementById("modal-btn-1");

const span1 = document.getElementById("close-1");

btn1.onclick = function () {
    modal1.style.display = "block";
}

span1.onclick = function () {
    modal1.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    }
}

const modal2 = document.getElementById("modal-2");

const btn2 = document.getElementById("modal-btn-2");

const span2 = document.getElementById("close-2");

btn2.onclick = function () {
    modal2.style.display = "block";
}

span2.onclick = function () {
    modal2.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}

const modal3 = document.getElementById("modal-3");

const btn3 = document.getElementById("modal-btn-3");

const span3 = document.getElementById("close-3");

btn3.onclick = function () {
    modal3.style.display = "block";
}

span3.onclick = function () {
    modal3.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal3) {
        modal3.style.display = "none";
    }
}