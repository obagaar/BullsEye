window.onload = function() {

addAlerts();

}

function addAlerts() {


    var accordian = document.querySelectorAll('.card');

    for(var i = 0; i < accordian.length; i++) {

        

        var collapse = accordian[i].children[1];

        var table = collapse.querySelector('.table');

        var tbody = table.querySelectorAll('tbody');

        var tbody1Length = tbody[1].children.length;

        if(tbody1Length > 0) {

            var header = accordian[i].querySelector('.card-header');

            header.innerHTML += ' <span class="badge badge-danger">' + tbody1Length + '</span>';
        }

    }

}