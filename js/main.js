'user strict';

// Global var
let shows = [];
let favorites = [];

//Get data from Local Storage
const getDataFromLocalStorage = () => {
    const localStorageFavorites = localStorage.getItem('favorites');
    if (localStorageFavorites !== null) {
        favorites = JSON.parse(localStorageFavorites);
    }
    paintShowsinFavorites();
};

// Reset favorites
const resetButton = document.querySelector('.js-reset');

const handleReset = () => {
    favorites = [];

    setInLocalStorage ();
    paintShowsinFavorites();
    paintShowsInResults();
}

resetButton.addEventListener('click', handleReset);

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
const inputElement = document.querySelector('.js-input');

const getDataFromApi = () => {
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
const resultsElement = document.querySelector('.js-results');

const paintShowsInResults = () => {
    let htmlCodeTotal = "";
    for (let show of shows) {
        htmlCodeTotal += getShowsHtmlCode(show);
    };
    resultsElement.innerHTML = `<ul>${htmlCodeTotal}</ul>`;

    listenShowsEvents();
};

const getShowsHtmlCode = show => {
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
    htmlCode += `<div class="favoriteContainer"><li class="favorites" id=${favorite.show.id}>`;
    if (favorite.show.image !== null) {
        htmlCode += `<img class="favoriteImg" src="${favorite.show.image.medium}"></img>`;
    } else {
        htmlCode += `<img class="favoriteImg" src="https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV"></img>`
        };
    htmlCode += `<h3 class="favoriteTitle">${favorite.show.name}</h3>`;
    htmlCode += `</li>`;
    htmlCode += `<button data-id=${favorite.show.id} class="removeButton js-remove">x</button>`
    htmlCode += `</div>`;
    return htmlCode;
};

const paintShowsinFavorites = () => {
    favoritesList.innerHTML = "<h2>Mis series favoritas</h2>";
    let htmlCodeTotal = "";
    for (let favorite of favorites) {
        htmlCodeTotal += getFavoritesHtmlCode(favorite);
    };
    favoritesList.innerHTML += `<ul>${htmlCodeTotal}</ul>`;
    
    listenFavoritesEvents();
};

// Set in local storage
const setInLocalStorage = () => {
    stringFavorites = JSON.stringify(favorites);
    localStorage.setItem('favorites', stringFavorites);   
};

//Event to un/select as favorite from search result
const listenShowsEvents = () => {
    const showsElements = document.querySelectorAll('.js-show');
    for (const showElement of showsElements) {
        showElement.addEventListener('click', addToFavorites);
    }
};

const addToFavorites = ev => {
    // Get id from clicked show
    const clickedShowId = parseInt(ev.currentTarget.dataset.id);
    // Find show clicked
    const showFound = shows.find(show => show.show.id === clickedShowId);
   // Find index favorite clicked
    const favoritesFoundIndex = favorites.findIndex(function (favorite) {
        return favorite.show.id === clickedShowId;
    }); 
    // Add/remove show to favorite list
    if (favoritesFoundIndex === -1) {
        const showFound = shows.find(function (show) {
          return show.show.id === clickedShowId;
        });
        favorites.push(showFound);
      } else {
        favorites.splice(favoritesFoundIndex, 1);
    }
    setInLocalStorage();
    paintShowsinFavorites();
    paintShowsInResults();
};

// Function to identify as favourite
const isFavoriteShow = (show) => {
    const favoriteFound = favorites.find((favorite) => {
        return favorite.show.id === show.show.id;
    });
    if (favoriteFound === undefined) {
      return false;
    } else {
      return true;
    }
};

// Remove from favorites
const deleteFromFavorites = (ev) => {
    const clickedButton = parseInt(ev.currentTarget.dataset.id);
    console.log(clickedButton)
    // Find index favorite clicked
    const favoritesFoundIndex = favorites.findIndex(function (favorite) {
        return favorite.show.id === clickedButton;
    });
    favorites.splice(favoritesFoundIndex, 1);
    
    setInLocalStorage ();
    paintShowsinFavorites();
    paintShowsInResults();
};

const listenFavoritesEvents = () => {
    const removeButtons = document.querySelectorAll('.js-remove');
    for (const removeButton of removeButtons) {
        removeButton.addEventListener('click', deleteFromFavorites);
    }
};

// Start web
getDataFromLocalStorage();