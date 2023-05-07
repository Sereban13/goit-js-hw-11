import axios from 'axios';

export async function getPhoto(searchQuery, currentPage = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '36106803-d64240cda904fbe2d47e1c8e1';

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
