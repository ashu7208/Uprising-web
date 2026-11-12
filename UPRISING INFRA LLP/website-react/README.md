# Uprising Infra LLP — React website

This project converts the supplied HTML website to React 18, Vite, and React Router. Lenis provides smooth scrolling and is disabled when reduced motion is requested. Original images, the complete stylesheet, and the About page's inline stylesheet are included.

## Run locally

From this directory:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build

```powershell
npm run build
npm run preview
```

Vite's production output is written to `dist`. Configure the production web server to serve `index.html` as the fallback for client-side routes (`/about`, `/services`, `/projects`, and `/contact`).

## Contact form backend

The form validates its fields but does not claim to send a message until an endpoint is configured. Set `VITE_CONTACT_API_URL` in a local `.env` file to a backend that accepts a JSON `POST` containing `name`, `phone`, `email`, `service`, and `message`. The endpoint must return a successful HTTP status for the form to show a success message.

Without that setting, form submission displays a clear not-connected message and directs visitors to the published phone and email contact details.
