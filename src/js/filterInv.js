window.onload = function () {

nameSearchInput();

}

function nameSearchInput() {

    var div = document.querySelector('.filter');
    var idInput = div.querySelector('.idInput');
    var nameInput = div.querySelector('.nameInput');
    var categoryInput = div.querySelector('.categoryInput');
    var quantityInput = div.querySelector('.quantityInput');

    idInput.addEventListener('keyup', idSearch);
    nameInput.addEventListener('keyup', nameSearch);
    categoryInput.addEventListener('input', categorySearch);
    quantityInput.addEventListener('input', quantitySearch);
}

function idSearch(){

    var filterDiv = document.querySelector('.filter');
    var input = filterDiv.querySelector('.idInput');
    var filter = input.value.toUpperCase();
    var table = document.querySelector('.inventory');
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

function nameSearch() {

    var filterDiv = document.querySelector('.filter');
    var input = filterDiv.querySelector('.nameInput');
    var filter = input.value.toUpperCase();
    var table = document.querySelector('.inventory');
    var tr = table.querySelectorAll('tr');

    for(var i = 0; i < tr.length; i++) {

      var td = tr[i].querySelectorAll('td');

      if(td.length > 0){

        var nameText = td[1].innerText;
        if (nameText.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }

      }

    }

}

function categorySearch() {

    var filterDiv = document.querySelector('.filter');
    var input = filterDiv.querySelector('.categoryInput');
    var filter = input.value.toUpperCase();
    var table = document.querySelector('.inventory');
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

function quantitySearch() {

    var filterDiv = document.querySelector('.filter');
    var input = filterDiv.querySelector('.quantityInput');
    var filter = Number(input.value);
    var table = document.querySelector('.inventory');
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

