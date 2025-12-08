/**@type {HTMLButtonElement}*/
const searchButton = document.getElementById('search-button');

/**@type {HTMLButtonElement}*/
const closeModalButton = document.getElementById('close-modal-button');


const apikey = '6bb6f5e1';


// Прописать закрытие


// Состояние текущего поиска
let currentSearch = {
    title: '',
    type: '',
    currentPage: 1
};

searchButton.addEventListener('click', async () =>
{
    readData();
    performSearch();
});

function readData()
{
    const titleInput = /**@type {HTMLInputElement}*/ document.getElementById('title-input');
    const typeSelect = /**@type {HTMLSelectElement}*/ document.getElementById('type-select');

    currentSearch.title = titleInput.value;
    currentSearch.type = typeSelect.value;
    if(!currentSearch.title)
    {
        console.log(`${titleInput.name}.value не содержит значения`);
    }
}

function performSearch()
{
    updateUrl();
    updatePageAsync();
}

async function updatePageAsync() {
    let data = await searchMoviesAsync(currentSearch.title, currentSearch.type, currentSearch.currentPage);
    displayMovies(data);
    displayPagination(data.totalResults, currentSearch.currentPage)
}

async function searchMoviesAsync(title, type, page) {
    const url = `http://www.omdbapi.com/?apikey=${apikey}&s=${title}&type=${type}&page=${page}`;
    const response = await fetch(url);
    return await response.json();
}

async function getMovieByIdAsync(id) {
    const url = `http://www.omdbapi.com/?apikey=${apikey}&i=${id}`;
    const response = await fetch(url);
    return await response.json();
}

async function openMovieDetails(id)
{
    const movieModal = document.getElementById('movie-modal');
    const movie = await getMovieByIdAsync(id);
    history.pushState(currentSearch, '', `?id=${id}`);
    createModalBody(movie);
    movieModal.style.display = 'block';
    console.log(movie);
}

function createModalBody(movie)
{
    const modalBody = document.getElementById('modal-body');
    const infoWrapper = document.createElement('div');
    modalBody.innerHTML = '';

    const img = document.createElement('img');
    img.src = movie.Poster;

    const title = document.createElement('div');
    title.textContent = `Title: ${movie.Title}`;

    const released = document.createElement('div');
    released.textContent = `Released: ${movie.Released}`;

    const genre = document.createElement('div');
    genre.textContent = `Genre: ${movie.Genre}`;

    const country = document.createElement('div');
    country.textContent = `Country: ${movie.Country}`;

    const director = document.createElement('div');
    director.textContent = `Director: ${movie.Director}`;

    const writer = document.createElement('div');
    writer.textContent = `Writer: ${movie.Writer}`;

    const actors = document.createElement('div');
    actors.textContent = `Actors: ${movie.Actors}`;

    const awards = document.createElement('div');
    awards.textContent = `Awards: ${movie.Awards}`;

    infoWrapper.append(title, released, genre, country, director, writer, actors, awards);
    modalBody.append(img, infoWrapper);
}

closeModalButton.addEventListener('click', (event)=>{
    const movieModal = document.getElementById('movie-modal');
    movieModal.style.di
});

function updateUrl()
{
    const params = new URLSearchParams();
    params.set('title', currentSearch.title);
    params.set('type', currentSearch.type);
    params.set('page', currentSearch.currentPage);
    history.pushState(currentSearch, '', '?' + params.toString());
}


function displayMovies(data)
{
    const container = document.getElementById('movies-container');
    container.innerHTML = '';

    if(data.Response === "False")
    {
        container.innerHTML = `<l3>${data.Error}</l3>`
        return;
    }

    const movies = data.Search; 
    movies.forEach(movie => {
        container.appendChild(getMovieHtml(movie));
    });
}

window.addEventListener('popstate', (event) =>{
    if (event.state) {
        currentSearch = event.state;
        updatePageAsync();
    }
    else {
        document.getElementById('movies-container').innerHTML = '';
        document.getElementById('pagination-container').innerHTML = '';
    }
});

function getMovieHtml(movie)
{
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    const img = document.createElement('img');
    img.src = movie.Poster !== 'N/A' ? movie.Poster : '';
    img.alt = movie.Title;

    const title = document.createElement('h3');
    title.innerText = movie.Title;

    const year = document.createElement('p');
    year.innerText = movie.Year;

    const detailsBtn = document.createElement('button');
    detailsBtn.innerText = 'Details';

    detailsBtn.addEventListener('click', () => {
        openMovieDetails(movie.imdbID);
    });
    
    movieCard.append(img, title, year, detailsBtn);
    return movieCard;
}

function displayPagination(totalResults, currentPage)
{
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    let totalPages = Math.ceil(Number(totalResults)/10);

    let startPage = currentPage - 2;
    let endPage = currentPage + 2;
    if(startPage <= 0) startPage = 1;
    if(endPage > totalPages) endPage = totalPages;
    
    for (let i = startPage; i <= endPage; i++)
    {
        paginationContainer.appendChild(createPageButton(i));
    }
}

/**
 * Возвращает HTML-элемент представляющий собой кнопку переключения на другую страницу с результатами, по номеру
 * @param {number} number 
 */
function createPageButton(number)
{
    const pagination = document.createElement('span');
    pagination.className = 'page-btn';
    pagination.innerText = number;
    pagination.addEventListener('click', () =>
    {
        currentSearch.currentPage = number;
        performSearch();
    });
    return pagination;
}