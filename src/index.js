import './css/style.css';
import Notiflix from 'notiflix';
import { getPhoto } from './fetchPhotoLibrary';

const form = document.querySelector('#search-form');
const photoResults = document.querySelector('.gallery');
const inputQuery = document.querySelector('[name="searchQuery"]');
const loadBtn = document.querySelector('.load-more');

let currentPage = 1;
let searchQuery = '';

form.addEventListener('submit', onSubmit);
loadBtn.addEventListener('click', loadNewPagination);

async function onSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  searchQuery = inputQuery.value.trim();

  try {
    const responce = await getPhoto(searchQuery, currentPage);
    const newData = await responce.data;
    if (searchQuery.trim() === '') {
      photoResults.innerHTML = '';
      Notiflix.Notify.info('Enter your request please.');
      return;
    } else if (newData.hits.length === 0) {
      loadBtn.hidden = true;
      photoResults.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (currentPage >= newData.totalHits / 40) {
      loadBtn.hidden = true;
      photoResults.innerHTML = galleryCraete(newData.hits);
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      photoResults.innerHTML = galleryCraete(newData.hits);
      loadBtn.hidden = false;
      Notiflix.Notify.success(`Hooray! We found ${newData.totalHits} images.`);
    }
  } catch (error) {
    Notiflix.Notify.error(`Sorry, something goes wrong`);
  }
}

async function loadNewPagination() {
  currentPage += 1;
  searchQuery = inputQuery.value.trim();
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
