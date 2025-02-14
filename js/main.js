"user strict";

// Global const
let shows = [];
let favorites = [];
let pageNumber = 1;
const pageSize = 4;
let pagination;

//Get data from Local Storage
const getDataFromLocalStorage = () => {
  const localStorageFavorites = localStorage.getItem("favorites");
  if (localStorageFavorites !== null) {
    favorites = JSON.parse(localStorageFavorites);
  }
  paintShowsinFavorites();
};

// Reset favorites
const resetButton = document.querySelector(".js-reset");

const handleReset = () => {
  favorites = [];

  setInLocalStorage();
  paintShowsinFavorites();
  paintShowsInResults();
};

resetButton.addEventListener("click", handleReset);

// Avoid form submit
const formElement = document.querySelector(".js-form");

function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener("submit", handleForm);

// Search by click
const searchElement = document.querySelector(".js-button");

function handleSearch() {
  getDataFromApi();
}
searchElement.addEventListener("click", handleSearch);

// Call to API
const inputElement = document.querySelector(".js-input");

const getDataFromApi = () => {
  let inputValue = inputElement.value;
  fetch(`https://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      shows = data;
      paintShowsInResults(shows);
    });
};

function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}
function nextPage() {
  const nextButton = document.querySelector(".js-next");
  pageNumber++;
  paintShowsInResults(pagination);
}
function previousPage() {
  const previousButton = document.querySelector(".js-previous");
  pageNumber--;
  paintShowsInResults(pagination);
}

// Paint search results
const resultsElement = document.querySelector(".js-results");
const pageElement = document.querySelector(".js-page");

const paintShowsInResults = (showResults) => {
  let htmlCodeTotal = "";
  let pagination = paginate(shows, pageSize, pageNumber);
  for (let show of pagination) {
    htmlCodeTotal += getShowsHtmlCode(show);
  }
  resultsElement.innerHTML = `<ul class="grid-results">${htmlCodeTotal}</ul>`;

  let pageCont = Math.ceil(shows.length / pageSize);
  let previousButton =
    pageNumber > 1
      ? `<button class="js-previous chi-button -icon -flat" onclick='previousPage()'><div class="chi-button__content">
      <i class="chi-icon icon-chevron-left" aria-hidden="true"></i>
    </div></button>`
      : `<button class="js-next chi-button -icon -flat" disabled><div class="chi-button__content">
      <i class="chi-icon icon-chevron-left" aria-hidden="true"></i>
    </div></button>`;

  let nextButton =
    pageNumber < pageCont
      ? `<button class="chi-button -icon -flat" onclick='nextPage()'><div class="chi-button__content">
      <i class="chi-icon icon-chevron-right" aria-hidden="true"></i>
    </div></button>`
      : `<button class="chi-button -icon -flat" disabled><div class="chi-button__content">
      <i class="chi-icon icon-chevron-right" aria-hidden="true"></i>
    </div></button>`;

  pageElement.innerHTML = `<nav class="chi-pagination -compact" role="navigation" aria-label="Pagination">
  <div class="chi-pagination__content">
    <div class="chi-pagination__center">
      <div class="chi-pagination__button-group chi-button-group">
        ${previousButton}
      </div>
      <div class="chi-pagination__label">
        <strong>${pageNumber}</strong>
        <span>of</span>
        <strong>${pageCont}</strong>
      </div>
      <div class="chi-pagination__button-group chi-button-group">
        ${nextButton}
          </div>
        </button>
      </div>
    </div>
  </div>
</nav>` /* `${previousButton} ${nextButton}` */;

  listenShowsEvents();
};

const getShowsHtmlCode = (show) => {
  let htmlCode = "";
  let isFavoriteClass;
  if (isFavoriteShow(show)) {
    isFavoriteClass = "selecFavorite";
  } else {
    isFavoriteClass = "";
  }
  htmlCode += `<li class="js-show -b--1 -b--primary show ${isFavoriteClass}" data-id=${show.show.id}>`;
  htmlCode += `<h4 class="-text--h4 -text--center">${show.show.name}</h4>`;
  if (show.show.image !== null) {
    //htmlCode += `<p class"dateShow">${show.show.premiered}</p>`;
    htmlCode += `<img class="resultsImg" src="${show.show.image.medium}"></img>`;
  } else {
    htmlCode += `<img class="resultsImg" src="https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV"></img>`;
  }
  htmlCode += `</li>`;
  return htmlCode;
};

// Paint favouries list
const favoritesList = document.querySelector(".js-favorites");

const getFavoritesHtmlCode = (favorite) => {
  let htmlCode = "";
  htmlCode += `<li class="favoriteItem" id=${favorite.show.id}>`;
  htmlCode += `<button data-id=${favorite.show.id} class="removeButton js-remove">x</button>`;
  if (favorite.show.image !== null) {
    htmlCode += `<img class="favoriteImg js-favoriteImg" src="${favorite.show.image.medium}"></img>`;
  } else {
    htmlCode += `<img class="favoriteImg" src="https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV"></img>`;
  }
  htmlCode += `</li>`;

  return htmlCode;
};

const paintShowsinFavorites = () => {
  favoritesList.innerHTML = "";
  let htmlCodeTotal = "";
  for (let favorite of favorites) {
    htmlCodeTotal += getFavoritesHtmlCode(favorite);
  }
  favoritesList.innerHTML += `${htmlCodeTotal}`;

  listenFavoritesEvents();
};

// Set in local storage
const setInLocalStorage = () => {
  stringFavorites = JSON.stringify(favorites);
  localStorage.setItem("favorites", stringFavorites);
};

//Event to un/select as favorite from search result
const listenShowsEvents = () => {
  const showsElements = document.querySelectorAll(".js-show");
  for (const showElement of showsElements) {
    showElement.addEventListener("click", addToFavorites);
  }
};

const addToFavorites = (ev) => {
  // Get id from clicked show
  const clickedShowId = parseInt(ev.currentTarget.dataset.id);
  // Find show clicked
  const showFound = shows.find((show) => show.show.id === clickedShowId);
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

  // Find index favorite clicked
  const favoritesFoundIndex = favorites.findIndex(function (favorite) {
    return favorite.show.id === clickedButton;
  });
  favorites.splice(favoritesFoundIndex, 1);

  setInLocalStorage();
  paintShowsinFavorites();
  paintShowsInResults();
};

const paintTitleFavorites = () => {
  for (const favorite of favorites) {
    console.log(`${favorite.show.name}`);
  }
};

const listenFavoritesEvents = () => {
  const removeButtons = document.querySelectorAll(".js-remove");
  for (const removeButton of removeButtons) {
    removeButton.addEventListener("click", deleteFromFavorites);
  }
  const favoriteElements = document.querySelectorAll(".js-favoriteImg");
  for (const favoriteElement of favoriteElements) {
    favoriteElement.addEventListener("click", paintTitleFavorites);
  }
};

// Start web
getDataFromLocalStorage();
