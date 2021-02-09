'user strict';

// Global var 
let shows = [];
let favourites = [];

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
        }
     )
};

// Avoid form submit
const formElement = document.querySelector('.js-form');
function handleForm (ev) {
    ev.preventDefault();
};
formElement.addEventListener('submit', handleForm);

// Paint search results
const resultsElement = document.querySelector('.js-results');
function paintShows (shows) {
    let htmlCodeTotal = "";
    for (const show of shows) {
        htmlCodeTotal += getShowsHtmlCode(show);
        console.log(show);
    };
    resultsElement.innerHTML = `<ul>${htmlCodeTotal}</ul>`;
    listenClickForFav();
};

// Generate html code for search results
function getShowsHtmlCode(dataShow) {
    let htmlCode = "";
    let showName = dataShow.show.name;
    let showImg = dataShow.show.image;
    let placeholderImg = `https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV`;
    htmlCode += `<li class="js-show show">`;
    if (showImg !== null) {
        htmlCode += `<img src="${showImg.medium}"></img>`;
    } else {
        htmlCode += `<img src="${placeholderImg}"></img>`
        };
    htmlCode += `<h3 class="title">${showName}</h3>`;
    htmlCode += `</li>`;
    return htmlCode;
};


//Event select as favourite in search results


const selectFavourite = ev => {
    console.log('entró en la func')
    const showSelect = ev.currentTarget;

    showSelect.classList.toggle('showFavourite');
}

function listenClickForFav() {
    const resultsShow = document.querySelectorAll('.js-show');
    for (const showSelect of resultsShow) {
    showSelect.addEventListener('click', selectFavourite);
    }
}




/*
// Paint favouries list
function paintFavourites() {
    getFavouritesHtmlCode();
};

function addShowToFavourites (id) {
    let FavouriteShow = 
    favorites.push({
        id: show.show.id;
        name: show.show.name;
        image: show.show.image.medium;
    })
} */