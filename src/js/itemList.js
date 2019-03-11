$(document).ready(function() {
    $('.js-example-basic-multiple').select2();
});


window.onload = function () {

    itemInput();
    
    }
    
    function itemInput() {
    
 /*        var div = document.querySelector('.addItem');
        var idInput = div.querySelector('.addItemButton');
    
        idInput.addEventListener('click', addItem); */

        $('.js-example-basic-multiple').on('select2:select', function (e) {
            var div = document.querySelector('.itemsList');
            var insertDiv = document.querySelector('.itemsForOrder')
            var selectList = div.querySelector('.itemstoPick');
            var options = selectList.selectedOptions;
    
            var html = "";
    
            for (var i = 0; i < options.length; i++) {
    
                html += '<div class="row">';
    
                html += ' <input type="hidden" name="itemID' + i + '" value="' + options[i].value + '">';
    
                html += '<input type="text" class="col-8 form-control" name="itemName' + i + '" value="' + options[i].text + '" readonly></input>';
    
                html += '<input type=number class="col-2 form-control" name="itemQuantity' + i + '" placeholder=0 min=0></input></div>'
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

            html += ' <input type="hidden" name="itemID' + i + '" value="' + options[i].value + '">';

            html += '<input type="text" class="col-8 form-control" name="itemName' + i + '" value="' + options[i].text + '" readonly></input>';

            html += '<input type=number class="col-2 form-control" name="itemQuantity' + i + '" placeholder=0 min=0></input></div>'
        }

        insertDiv.innerHTML = html;

    }