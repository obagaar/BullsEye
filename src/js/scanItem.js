window.onload = function () {

scanInput();

}

function scanInput() {


    var button = document.querySelectorAll(".scanButton");

    for(var i = 0; i < button.length; i++) {


        button[i].addEventListener('click', scanItem);
    }

}

function scanItem() {
    this.disabled = 'true';

    window.alert('Item scanned');

    
}