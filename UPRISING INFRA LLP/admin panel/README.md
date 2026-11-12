# Uprising Infra LLP Admin Panel

The admin panel is a React 18 + Vite application. It runs locally and stores its prototype data in the browser; it does not connect to a production website or backend.

## Install and run

```bash
npm install
npm run dev
```

Create a production build with `npm run build`; preview it with `npm run preview`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `admin@uprisinginfra.local` | `Admin@123` |
| Admin | `manager@uprisinginfra.local` | `Manager@123` |
| Editor | `editor@uprisinginfra.local` | `Editor@123` |

Passwords are stored in plain text **ONLY in this prototype**. Do not use these accounts or this password handling for a production deployment.

## Browser storage

- `localStorage` key `uprising_admin_proto_v1`: content, settings, activity log, media and backup history.
- `sessionStorage` key `uprising_admin_user`: current signed-in user's session.

## Connecting a real backend

The storage boundary is in `src/lib/storage.js`; replace its local storage calls and the mutation operations in `src/context/StoreContext.jsx` with authenticated API requests. Use a server-side password hash and secure authentication (JWT in a secure cookie or HTTP-only cookies), and validate all authorization on the server. Suggested REST endpoints:

- `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/password`
- `GET/POST /api/home/sections`, `PATCH/DELETE /api/home/sections/:id`; repeat for `/api/about/sections`
- `GET/POST/PATCH/DELETE /api/services`, `/api/projects`, `/api/clients`, `/api/leadership`, `/api/faqs`, `/api/navigation`, `/api/seo`, `/api/users`
- `GET/POST/PATCH/DELETE /api/enquiries`; `POST /api/enquiries/export`
- `GET/POST/PATCH/DELETE /api/media`; `POST /api/media/:id/replace`
- `GET/PATCH /api/settings`, `GET /api/activity-logs`, `POST/GET /api/backups`, `POST /api/backups/restore`

The frontend is a prototype: its role checks and browser storage are for demo behavior only and are not security controls.
