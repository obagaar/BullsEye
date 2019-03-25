window.onload = function () {

    buttonsInput();

    
}

function buttonsInput() {

 var buttonOne = document.querySelector('.menu1Button');
 var buttonTwo = document.querySelector('.menu2Button');

 buttonOne.addEventListener('click', one2two);
 buttonTwo.addEventListener('click', two2one);

}

function one2two() {

    var m1 = document.querySelector('.menu1');
    var m2 = document.querySelector('.menu2');

    m1len = m1.length ;
    for ( i=0; i<m1len ; i++){
        if (m1.options[i].selected == true ) {
            m2len = m2.length;
            m2.options[m2len]= new Option(m1.options[i].text);
        }
    }

    for ( i = (m1len -1); i>=0; i--){
        if (m1.options[i].selected == true ) {
            m1.options[i] = null;
        }
    }

    selectDelivery();
}

function two2one() {

    var m1 = document.querySelector('.menu1');
    var m2 = document.querySelector('.menu2');

    m2len = m2.length ;
        for ( i=0; i<m2len ; i++){
            if (m2.options[i].selected == true ) {
                m1len = m1.length;
                m1.options[m1len]= new Option(m2.options[i].text);
            }
        }
        for ( i=(m2len-1); i>=0; i--) {
            if (m2.options[i].selected == true ) {
                m2.options[i] = null;
            }
        }

        selectDelivery();
}

function selectDelivery() {

    var m2 = document.querySelector('.menu2');

    for (i=0; i< m2.length; i++) {  
        if(m2.options[i] !== "") {
            m2.options[i].selected = true; 
        }
        
      } 




}