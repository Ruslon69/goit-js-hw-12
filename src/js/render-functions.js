import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionHTML: false,
  // Finish closing the overlay before a gallery refresh can replace its nodes.
  fadeSpeed: 0,
});

function escapeHtml(value) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return String(value ?? '').replace(
    /[&<>"']/g,
    character => entities[character]
  );
}

function safeImageUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol)
      ? escapeHtml(url.href)
      : '';
  } catch {
    return '';
  }
}

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${safeImageUrl(largeImageURL)}">
            <img
              class="gallery-image"
              src="${safeImageUrl(webformatURL)}"
              alt="${escapeHtml(tags)}"
              loading="lazy"
              decoding="async"
            />
          </a>
          <div class="image-info">
            <p class="info-item"><b>Likes</b><span>${escapeHtml(likes)}</span></p>
            <p class="info-item"><b>Views</b><span>${escapeHtml(views)}</span></p>
            <p class="info-item"><b>Comments</b><span>${escapeHtml(comments)}</span></p>
            <p class="info-item"><b>Downloads</b><span>${escapeHtml(downloads)}</span></p>
          </div>
        </li>
      `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.replaceChildren();
}

export function showLoader() {
  loader.classList.add('is-visible');
  gallery.setAttribute('aria-busy', 'true');
}

export function hideLoader() {
  loader.classList.remove('is-visible');
  gallery.setAttribute('aria-busy', 'false');
}

export function showLoadMoreButton() {
  loadMoreButton.classList.add('is-visible');
}

export function hideLoadMoreButton() {
  loadMoreButton.classList.remove('is-visible');
}
