'user strict';

// Global var
let shows = [];
let favorites = [];

const inputElement = document.querySelector('.js-input');

console.log(inputElement.value);

// Avoid form submit
const formElement = document.querySelector('.js-form');
function handleForm(ev) {
    ev.preventDefault();
};
formElement.addEventListener('submit', handleForm);

// Search by click
const searchElement = document.querySelector('.js-button');
function handleSearch() {
    getDataFromApi();
};

searchElement.addEventListener('click', handleSearch);

// Call to API
function getDataFromApi() {
    let inputValue = inputElement.value;
    fetch(`https://api.tvmaze.com/search/shows?q=${inputValue}`)
        .then(response => response.json())
        .then((data) => {
            shows = data;
            paintShowsInResults();
        }
    )
};

// Paint search results
const resultsElement = document.querySelector('.js-results')
const paintShowsInResults = () => {
    let htmlCodeTotal = "";
    for (let show of shows) {
        htmlCodeTotal += getShowsHtmlCode(show);
    };
    resultsElement.innerHTML = `<ul>${htmlCodeTotal}</ul>`;
    listenShowsEvents();
    
};

function getShowsHtmlCode(show) {
    let htmlCode = "";
    let isFavoriteClass;
    if (isFavoriteShow(show)) {
        isFavoriteClass = 'selecFavorite';
    } else {
        isFavoriteClass = '';
    }
    htmlCode += `<li class="js-show show ${isFavoriteClass}" data-id=${show.show.id}>`;
    if (show.show.image !== null) {
        htmlCode += `<img src="${show.show.image.medium}"></img>`;
    } else {
        htmlCode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV"></img>`
        };
    htmlCode += `<h3 class="title">${show.show.name}</h3>`;
    htmlCode += `</li>`;
    return htmlCode;
};

// Paint favouries list
const favoritesList = document.querySelector('.js-favorites');

const getFavoritesHtmlCode = favorite => {
    let htmlCode = "";
    htmlCode += `<li class="favorites" id=${favorite.show.id}>`;
    if (favorite.show.image !== null) {
        htmlCode += `<img class="favoriteImg" src="${favorite.show.image.medium}"></img>`;
    } else {
        htmlCode += `<img class="favoriteImg" src="https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV"></img>`
        };
    htmlCode += `<h3 class="favoriteTitle">${favorite.show.name}</h3>`;
    htmlCode += `</li>`;
    return htmlCode;
};

const paintShowsinFavorites = () => {
    favoritesList.innerHTML = "";
    let htmlCodeTotal = "";
    for (let favorite of favorites) {
        htmlCodeTotal += getFavoritesHtmlCode(favorite);
    };
    favoritesList.innerHTML += `<ul>${htmlCodeTotal}</ul>`;
    
    listenShowsEvents();
};

//Event to us/select as favorite from search result
function listenShowsEvents() {
    const showsElements = document.querySelectorAll('.js-show');
    for (const showElement of showsElements) {
        showElement.addEventListener('click', addToFavorites);
    }
};

const addToFavorites = ev => {
    // Get id from clicked show
    const clickedShowId = parseInt(ev.currentTarget.dataset.id);
    // Find show clicked
    let foundShow;
    for (const show of shows) {
        if (show.show.id === clickedShowId) {
            foundShow = show;
        }
    }
    // Add show to favorite list
    favorites.push(foundShow);
    paintShowsinFavorites();
    paintShowsInResults();
};

// Function to identify as favourite
function isFavoriteShow(show) {
    const favoriteFound = favorites.find((favorite) => {
        console.log (favorite.show.id, show.show.id)
        return favorite.show.id === show.show.id;
    });
    if (favoriteFound === undefined) {
      return false;
    } else {
      return true;
    }
};