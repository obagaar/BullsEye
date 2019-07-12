$(document).ready(function () {
    $('.js-example-basic-multiple').select2();
});


window.onload = function () {

    itemInput();
    selectInput();
    supplierHide();

}

function itemInput() {

    $('.js-example-basic-multiple').on('select2:select', function (e) {
        var div = document.querySelector('.itemsList');
        var insertDiv = document.querySelector('.itemsForOrder');
        var selectList = div.querySelector('.itemstoPick');
        var options = selectList.selectedOptions;

        var html = "";

        for (var i = 0; i < options.length; i++) {

            html += '<div class="row">';

            html += ' <input type="hidden" name="itemID[]" value="' + options[i].value + '">';

            html += '<input type="text" class="col-8 form-control" name="itemName[]" value="' + options[i].text + '" readonly></input>';

            html += '<input type=number class="col-2 form-control" name="itemQuantity[]" placeholder=0 min=0></input></div>'
        }

        insertDiv.innerHTML = html;
    });


}

function addItem() {

    var div = document.querySelector('.itemsList');
    var insertDiv = document.querySelector('.itemsForOrder')
    var selectList = div.querySelector('.itemstoPick');
    var options = selectList.selectedOptions;

    var html = "";

    for (var i = 0; i < options.length; i++) {

        html += '<div class="row">';

        html += ' <input type="hidden" name="itemID[]" value="' + options[i].value + '">';

        html += '<input type="text" class="col-8 form-control" name="itemName[]" value="' + options[i].text + '" readonly></input>';

        html += '<input type=number class="col-2 form-control" name="itemQuantity[]" value=1 min=0></input></div>';
    }

    insertDiv.innerHTML = html;

}

function selectInput() {

    var div = document.querySelector('.supplierInput');
    var select = div.querySelector('.supplierSelect');

    select.addEventListener('change', supplierSelect)


}

function supplierHide() {

    var selectDiv = document.querySelector('.supplierInput');
    var select = selectDiv.querySelector('.supplierSelect');

    var reorderDiv = document.querySelector('.reorderitemsList');
     var divs = reorderDiv.querySelectorAll('.reorderItem');


    for(var i = 0; i < divs.length; i++) {

       
                divs[i].style.display = "none";



    }

}

function supplierSelect() {

    var selectDiv = document.querySelector('.supplierInput');
    var select = selectDiv.querySelector('.supplierSelect');

    var reorderDiv = document.querySelector('.reorderitemsList');
     var divs = reorderDiv.querySelectorAll('.reorderItem');
     var subDivs = reorderDiv.querySelectorAll('div');

   for(var i = 0; i < divs.length; i++) {

        for(var j = 0; j < subDivs.length; j++) {

            if(subDivs[j].innerText.includes(select.value)) {
                divs[i].style.display = "";
            } else {
                divs[i].style.display = "none";
            }
        }

    }
}