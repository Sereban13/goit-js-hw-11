// import axios from 'axios';
// import Notiflix, { Loading } from 'notiflix';

const form = document.querySelector('#search-form');
const input = document.querySelector('[name="searchQuery"]');
const photoResults = document.querySelector('.gallery');

const textRequest = input.value;

function getPhoto(request) {
  return fetch(
    `//pixabay.com/api/?key=36106803-d64240cda904fbe2d47e1c8e1&q="${request}"&image_type="photo"&orientantion="horizontal"&safesearch=true`
  ).then(responce => {
    if (!responce.ok) {
      throw new Error(responce.statusText);
    }
    return responce.json();
  });
}

form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  testRequest = input.value;

  getPhoto(testRequest)
    .then(data => {
      photoResults.innerHTML = galleryCraete(data.hits);
    })
    .catch(error => console.log(error));
}

function galleryCraete(photoGallery) {
  return photoGallery
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
