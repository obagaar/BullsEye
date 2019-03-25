window.onload = function () {


    hideOrders();
    typeInputs();

}

function hideOrders() {

 var div = document.querySelector('.orderInfo');
 var table = div.querySelector('.orderInfoTable');
 var tr = table.querySelectorAll('tr');

 for(var i = 0; i < tr.length; i++) {

    var td = tr[i].querySelectorAll('td');

    if(td.length > 0){

      var nameText = td[3].innerText;
      var typeText = td[5].innerText;
      
      if (nameText.indexOf("Complete") > -1) {
          tr[i].style.display = "none";
        } 
     else if (nameText.indexOf("Cancelled") > -1) {
        tr[i].style.display = "none";
      } 
      else if (typeText.indexOf("Back Order") > -1) {
        tr[i].style.display = "none";
    }
        
      else {
          tr[i].style.display = "";
        }

    }

  }

}

function typeInputs() {

 var div = document.querySelector('.filter');

 var completeBox = div.querySelector('#inlineCheckboxComplete');
 var cancelledBox = div.querySelector('#inlineCheckboxCancelled');

 completeBox.addEventListener('change', completeShow);
 cancelledBox.addEventListener('change', cancelledShow);

}

function completeShow() {


    var div = document.querySelector('.filter');

    var completeBox = div.querySelector('#inlineCheckboxComplete');

    var div = document.querySelector('.orderInfo');
 var table = div.querySelector('.orderInfoTable');
 var tr = table.querySelectorAll('tr');

 for(var i = 0; i < tr.length; i++) {

    var td = tr[i].querySelectorAll('td');

    if(td.length > 0){

        var nameText = td[3].innerText;

        if (nameText.indexOf("Complete") > -1) {

            if(completeBox.checked) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
         
        }  
 }

  }




}

function cancelledShow() {

    var div = document.querySelector('.filter');

    var completeBox = div.querySelector('#inlineCheckboxCancelled');

    var div = document.querySelector('.orderInfo');
 var table = div.querySelector('.orderInfoTable');
 var tr = table.querySelectorAll('tr');

 for(var i = 0; i < tr.length; i++) {

    var td = tr[i].querySelectorAll('td');

    if(td.length > 0){

        var nameText = td[3].innerText;
        
        if (nameText.indexOf("Cancelled") > -1) {

            if(completeBox.checked) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
         
        } 
        

 }

  }


}