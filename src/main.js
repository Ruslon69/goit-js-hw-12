import { getImagesByQuery, IMAGES_PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const searchInput = form.elements['search-text'];
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let currentSearch;

iziToast.settings({
  position: 'topRight',
  timeout: 5000,
  maxWidth: 420,
});

form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    iziToast.warning({ message: 'Please enter a search term.' });
    searchInput.focus();
    return;
  }

  currentSearch = { query, page: 1, hasMore: false, isLoading: false };
  searchInput.value = query;
  document
    .querySelectorAll('.iziToast:not(.iziToast-closing)')
    .forEach(toast => {
      iziToast.hide({}, toast);
    });
  clearGallery();
  await loadPage(currentSearch);
});

loadMoreButton.addEventListener('click', async () => {
  if (!currentSearch?.hasMore || currentSearch.isLoading) return;

  await loadPage(currentSearch);
});

async function loadPage(search) {
  const { query, page } = search;
  search.isLoading = true;
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);
    if (search !== currentSearch) return;

    if (hits.length === 0) {
      search.hasMore = false;
      if (page === 1) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      } else {
        showEndOfResults();
      }
      return;
    }

    createGallery(hits);
    search.page += 1;
    search.hasMore = page * IMAGES_PER_PAGE < totalHits;
    if (!search.hasMore) showEndOfResults();
    if (page > 1) scrollGallery();
  } catch {
    if (search === currentSearch) {
      iziToast.error({
        message: 'Unable to load images. Please try again in a moment.',
      });
    }
  } finally {
    if (search === currentSearch) {
      search.isLoading = false;
      hideLoader();
      if (search.hasMore) showLoadMoreButton();
    }
  }
}

function showEndOfResults() {
  iziToast.info({
    message: "We're sorry, but you've reached the end of search results.",
  });
}

function scrollGallery() {
  const firstCard = gallery.firstElementChild;
  if (!firstCard) return;

  const { height } = firstCard.getBoundingClientRect();
  window.scrollBy({ top: height * 2, behavior: 'smooth' });
}
