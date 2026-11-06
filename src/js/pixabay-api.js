import axios from 'axios';

export const IMAGES_PER_PAGE = 15;

const proxyUrl = import.meta.env.VITE_PIXABAY_PROXY_URL;

export async function getImagesByQuery(query, page) {
  const params = {
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: IMAGES_PER_PAGE,
  };

  if (proxyUrl) {
    // deploy/pixabay-proxy.mjs requires the PIXABAY_API_KEY secret and sends
    // it as the key parameter in every request it forwards to Pixabay.
    const { data } = await axios.get(proxyUrl, { params, timeout: 25000 });
    return data;
  }

  const apiKey = import.meta.env.DEV
    ? import.meta.env.VITE_PIXABAY_API_KEY
    : '';
  if (!apiKey) {
    throw new Error('Configure the Pixabay proxy or a local development key.');
  }

  const { data } = await axios.get('https://pixabay.com/api/', {
    params: { ...params, key: apiKey },
    timeout: 15000,
  });

  return data;
}
