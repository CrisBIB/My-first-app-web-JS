'user strict';

// Global var 
let shows = [];
let favorites = [];

const inputElement = document.querySelector('.js-input');
let inputValue = inputElement.value;

const searchElement = document.querySelector('.js-button');

// Search by click
function handleSearch() {
    getDataFromApi(inputElement.value)
};

searchElement.addEventListener('click', handleSearch);

// Call to API
function getDataFromApi(inputValue) {
    fetch(`https://api.tvmaze.com/search/shows?q=${inputValue}`)
        .then(response => response.json())
        .then((data) => {
            paintShows(data);
            console.log(data)
    })
}

// Paint search results
function paintShows() {
    let htmlCode = "";
    for (const show of shows) {
        console.log(data.show)
    }

}



