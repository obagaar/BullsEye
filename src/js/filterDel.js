window.onload = function () {

deliverySearchInput();

}

function deliverySearchInput() {

    var div = document.querySelector('.filter');
    var idInput = div.querySelector('.idInput');
    var vehicleInput = div.querySelector('.vehicleInput');
    var distanceInput = div.querySelector('.distanceInput');

    idInput.addEventListener('keyup', idSearch);
    vehicleInput.addEventListener('input', vehicleSearch);
    distanceInput.addEventListener('input', distanceSearch);

}

function idSearch(){

    var filterDiv = document.querySelector('.filter');
    var input = filterDiv.querySelector('.idInput');
    var filter = input.value.toUpperCase();
    var table = document.querySelector('.table');
    var tr = table.querySelectorAll('tr');

    for(var i = 0; i < tr.length; i++) {

      var td = tr[i].querySelectorAll('td');

      if(td.length > 0){

        var nameText = td[0].innerText;
        if (nameText.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }

      }

    }


}

function vehicleSearch() {

    var filterDiv = document.querySelector('.filter');
    var input = filterDiv.querySelector('.vehicleInput');
    var filter = input.value.toUpperCase();
    var table = document.querySelector('.table');
    var tr = table.querySelectorAll('tr');

    for(var i = 0; i < tr.length; i++) {

        var td = tr[i].querySelectorAll('td');
  
        if(td.length > 0){

        if(filter === "ALL") {

            tr[i].style.display = "";

        } else {

            var nameText = td[2].innerText;
            if (nameText.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
              } else {
                tr[i].style.display = "none";
              }

        }
  

  
        }
  
      }
}

function distanceSearch() {

    var filterDiv = document.querySelector('.filter');
    var input = filterDiv.querySelector('.distanceInput');
    var filter = Number(input.value);
    var table = document.querySelector('.table');
    var tr = table.querySelectorAll('tr');

    for(var i = 0; i < tr.length; i++) {

      var td = tr[i].querySelectorAll('td');

      if(td.length > 0){

        var quantity = Number(td[4].innerText);
        if (quantity === filter) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }

      }

    }
}
