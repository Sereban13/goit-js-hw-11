import './css/style.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const photoResults = document.querySelector('.gallery');
const inputQuery = document.querySelector('[name="searchQuery"]');
const loadBtn = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36106803-d64240cda904fbe2d47e1c8e1';

let currentPage = 1;
let searchQuery = '';

async function onSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  searchQuery = inputQuery.value;

  try {
    const responce = await getPhoto(searchQuery, currentPage);
    const newData = await responce.data;
    if (newData.hits.length === 0) {
      loadBtn.hidden = true;
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (currentPage >= newData.totalHits / 40) {
      loadBtn.hidden = true;
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      photoResults.innerHTML = galleryCraete(newData.hits);
      loadBtn.hidden = false;
      Notiflix.Notify.success(`Hooray! We found ${newData.totalHits} images.`);
    }
  } catch (error) {
    Notiflix.Notify.failure(`Sorry, something goes wrong`);
  }
}

async function loadNewPagination() {
  currentPage += 1;
  searchQuery = inputQuery.value;
  try {
    const responce = await getPhoto(searchQuery, currentPage);
    const newData = await responce.data;
    photoResults.insertAdjacentHTML('beforeend', galleryCraete(newData.hits));

    if (currentPage >= newData.totalHits / 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadBtn.hidden = true;
    }
  } catch (error) {
    Notiflix.Notify.error('Sorry, something goes wrong');
  }
}

async function getPhoto(searchQuery, currentPage = 1) {
  try {
    const responce = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&page=${currentPage}&image_type="photo"&orientantion="horizontal"&safesearch=true&per_page=40`
    );
    return responce;
  } catch (error) {
    Notiflix.Notify.error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function galleryCraete(photoGallery) {
  return photoGallery
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
      <div class="thumb">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </div>
  
  <div class="info">
    <p class="info-item">
      <b>Likes:${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}
loadBtn.addEventListener('click', loadNewPagination);
form.addEventListener('submit', onSubmit);
