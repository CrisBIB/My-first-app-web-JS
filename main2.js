'user strict';

// Global var 
let shows = [];
let favorites = [];

const inputElement = document.querySelector('.js-input');
let inputValue = inputElement.value;
const searchElement = document.querySelector('.js-button');
const resultsElement = document.querySelector('.js-results');

// Search by click
function handleSearch() {
    getDataFromApi();
};

searchElement.addEventListener('click', handleSearch);

// Call to API
function getDataFromApi() {
    fetch(`https://api.tvmaze.com/search/shows?q=${inputValue}`)
        .then(response => response.json())
        .then((data) => {
            shows = data;
            paintShowsInResults();
        }
     )
};

// Paint search results
const paintShowsInResults = () => {
    let htmlCodeTotal = "";
    for (let show of shows) {
        show = show.show;
        htmlCodeTotal += getShowsHtmlCode(show);
    };
    resultsElement.innerHTML = `<ul>${htmlCodeTotal}</ul>`;

    listenSelectFavorite();
    listenSelectFavorite2();
};

function getShowsHtmlCode(show) {
    let htmlCode = "";
    let isFavoriteClass;
    if (isFavoriteShow(show)) {
        isFavoriteClass = 'selecFavorite';
    } else {
        isFavoriteClass = '';
    }
    htmlCode += `<li class="js-show show ${isFavoriteClass}" data-id=${show.id}>`;
    if (show.image !== null) {
        htmlCode += `<img src="${show.image.medium}"></img>`;
    } else {
        htmlCode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV"></img>`
        };
    htmlCode += `<h3 class="title">${show.name}</h3>`;
    htmlCode += `</li>`;
    return htmlCode;
};

//Event to us/select as favorite from search result
function listenSelectFavorite() {
    const showsElements = document.querySelectorAll('.js-show');
    for (const showElement of showsElements) {
        showElement.addEventListener('click', addToFavorites);
    }
    paintShowsInResults();
};

const addToFavorites = ev => {
    // Get id from clicked show
    const clickedShowId = parseInt(ev.currentTarget.dataset.id);
    // Find show clicked
    let foundShow;
    for (const show of shows) {
        if (show.show.id === clickedShowId) {
            foundShow = show.show;
        }
    }
    // Add show to favorite list
    favorites.push({
        id: foundShow.id,
        name: foundShow.name,
        image: foundShow.image.medium
    });
    paintShowsinFavorites();
    paintShowsInResults();
};
function listenSelectFavorite2() {
    const showsElements = document.querySelectorAll('.js-show');
    for (const showElement of showsElements) {
        showElement.addEventListener('click', selectShow);
    }
};

const selectShow = ev => {
    const clickedShowId2 = ev.currentTarget.dataset.id;
    const favoritesFoundIndex = favorites.findIndex(function (favorite) {
        return favorite.id === clickedShowId2;
    });
    if (favoritesFoundIndex === -1) {
        const showFound = shows.find(function (show) {
          return show.id === clickedShowId2;
        });
        favorites.push(showFound);
      } else {
        favorites.splice(favoritesFoundIndex, 1);
    }
    paintShowsInResults();
    paintShowsInResults();
};


// Paint favouries list
const favoritesList = document.querySelector('.js-favorites');

const getFavoritesHtmlCode = favorite => {
    let htmlCode = "";
    htmlCode += `<li class="favorites" id=${favorite.id}>`;
    if (favorite.image !== null) {
        htmlCode += `<img class="favoriteImg" src="${favorite.image}"></img>`;
    } else {
        htmlCode += `<img class="favoriteImg" src="https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV"></img>`
        };
    htmlCode += `<h3 class="favoriteTitle">${favorite.name}</h3>`;
    htmlCode += `</li>`;
    return htmlCode;
};

const paintShowsinFavorites = () => {
    favoritesList.innerHTML = "";
    let htmlCodeTotal = "";
    for (const favorite of favorites) {
        htmlCodeTotal += getFavoritesHtmlCode(favorite);
    };
    favoritesList.innerHTML += `<ul>${htmlCodeTotal}</ul>`;
    
    listenSelectFavorite();
    listenSelectFavorite2();
};


// Function to identify as favourite
function isFavoriteShow(show) {
    const favoriteFound = favorites.find((favorite) => {
        console.log (favorite.id, show.show.id)
        return favorite.id === show.show.id;
    });
    if (favoriteFound === undefined) {
      return false;
    } else {
    return true;
    }
};

// Avoid form submit
const formElement = document.querySelector('.js-form');
function handleForm (ev) {
    ev.preventDefault();
};
formElement.addEventListener('submit', handleForm);