# GoIT JavaScript HW-12

Пошук фотографій Pixabay із пагінацією по 15 зображень, кнопкою **Load more** і
переглядом у SimpleLightbox. Проєкт продовжує HW-11 і використовує
[шаблон GoIT на Vite](https://github.com/goitacademy/goit-js-hw-template).

## Локальний запуск

1. Виконай `npm ci`.
2. У файлі `src/.env.local` задай `VITE_PIXABAY_API_KEY` зі своїм ключем
   Pixabay. Vite читає цей ключ у режимі розробки. Файл ігнорується Git.
3. Виконай `npm run dev` і відкрий адресу з термінала.

`npm run build` збирає проєкт у `dist`. Для перевірки пошуку у зібраній версії
перед збіркою задай `VITE_PIXABAY_PROXY_URL` з адресою проксі.

## GitHub Pages

GitHub Pages публікує статичну збірку. Браузер надсилає пошуковий запит до
проксі, а проксі додає ключ і звертається до Pixabay. Ключ зберігається тільки в
налаштуваннях проксі.

1. Створи порожній публічний репозиторій `goit-js-hw-12` на GitHub і підключи
   його як `origin` до локального репозиторію.
2. Створи Cloudflare Worker та заміни його код вмістом
   [deploy/pixabay-proxy.mjs](./deploy/pixabay-proxy.mjs).
3. У налаштуваннях Worker додай секрет `PIXABAY_API_KEY` і текстову змінну
   `PAGES_ORIGIN` зі значенням `https://ruslon69.github.io`. Опублікуй Worker.
4. У репозиторії GitHub відкрий **Settings → Secrets and variables → Actions →
   Variables**. Додай змінну `PIXABAY_PROXY_URL` з HTTPS-адресою Worker і шляхом
   `/search`.
5. У **Settings → Pages → Source** обери **GitHub Actions**. Після пушу в `main`
   workflow збере та опублікує сайт.

Після успішного деплою перевір пошук на GitHub Pages і додай до LMS посилання на
репозиторій та живу сторінку.
