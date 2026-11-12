# Project facts
- website-react: Vite + React, public site. Backend URL comes from VITE_API_URL.
- backend: Express + PostgreSQL. Public endpoint: GET /api/public/content
  returns { home: [...sections], nav: [...], settings: {...}, ... }.
  Each section has name, live, draft. Website only reads `live`.
- Text fields use "\n" between items and " | " between parts of an item.
- Enquiries: POST /api/enquiries with name, phone, email, service, message.

# Rules
- Never remove existing JSX markup, class names or animation structure.
- Always keep the current hard-coded text as a fallback when the backend is
  down or a field is empty.
- Use the useSiteContent hook from src/services/siteContent.js. Do not call
  fetch inside components.
- Never put passwords or secrets in code.