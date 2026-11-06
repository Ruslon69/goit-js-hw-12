import axios from 'axios';

export const IMAGES_PER_PAGE = 15;

const proxyUrl = import.meta.env.VITE_PIXABAY_PROXY_URL;
const devKey = import.meta.env.DEV && import.meta.env.VITE_PIXABAY_API_KEY;

export async function getImagesByQuery(query, page) {
  if (!proxyUrl && !devKey) {
    throw new Error('Pixabay API is not configured');
  }

  const { data } = await axios.get(proxyUrl || 'https://pixabay.com/api/', {
    params: {
      key: proxyUrl ? undefined : devKey,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: IMAGES_PER_PAGE,
    },
    timeout: 15000,
  });

  return data;
}
