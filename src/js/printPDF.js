

window.onload = function () {

    pdfInput();

}

function pdfInput () {

var button = document.querySelector('.pdfButton');

button.addEventListener('click', pdfPrint);

}

function pdfPrint() {

    window.print();

}