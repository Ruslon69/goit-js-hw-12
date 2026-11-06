export default {
  async fetch(request, env, context) {
    const origin = request.headers.get('Origin');
    if (!origin || origin !== env.PAGES_ORIGIN) {
      return new Response(null, { status: 403 });
    }

    const url = new URL(request.url);
    const headers = { 'Access-Control-Allow-Origin': origin };
    if (url.pathname !== '/search' || request.method !== 'GET') {
      return new Response(null, { status: 404, headers });
    }

    const query = url.searchParams.get('q')?.trim();
    const page = Number(url.searchParams.get('page'));
    if (
      !query ||
      query.length > 100 ||
      !Number.isSafeInteger(page) ||
      page < 1
    ) {
      return new Response(null, { status: 400, headers });
    }
    if (!env.PIXABAY_API_KEY) {
      return new Response(null, { status: 503, headers });
    }

    const cacheUrl = new URL('/search', url.origin);
    cacheUrl.search = new URLSearchParams({ q: query, page });
    const cacheKey = new Request(cacheUrl);
    const cache = caches.default;
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) return cachedResponse;

    const pixabayUrl = new URL('https://pixabay.com/api/');
    pixabayUrl.search = new URLSearchParams({
      key: env.PIXABAY_API_KEY,
      q: query,
      page,
      per_page: 15,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    });

    try {
      const response = await fetch(pixabayUrl.href, { redirect: 'manual' });
      if (!response.ok) {
        return new Response(null, {
          status: response.status >= 400 ? response.status : 502,
          headers,
        });
      }

      const result = new Response(response.body, {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400',
        },
      });
      context.waitUntil(cache.put(cacheKey, result.clone()));
      return result;
    } catch {
      return new Response(null, { status: 502, headers });
    }
  },
};
