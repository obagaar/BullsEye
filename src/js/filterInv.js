window.onload = function () {

nameSearchInput();

}

function nameSearchInput() {

    var div = document.querySelector('.filter');
    var input = div.querySelector('.nameInput');

    input.addEventListener('keyup', nameSearch);
}

function nameSearch() {

    console.log('test');

}

