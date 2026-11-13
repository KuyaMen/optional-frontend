# OPTIONAL Product Catalog

React, Vite, and Material UI frontend for the OPTIONAL product management API. The backend is the source of truth for products, authentication, and authorization.

## Project and group

- Frontend repository: [KuyaMen/optional-frontend](https://github.com/KuyaMen/optional-frontend)
- Backend repository: [KuyaMen/optional-backend](https://github.com/KuyaMen/optional-backend)
- Group name: OPTIONAL.
- Members: add each member's name and GitHub username before submission.

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` if the API is not at `http://localhost:8000/api`.
3. Start the API and configure it to allow requests from the frontend origin.
4. Run `npm run dev`.

Run `npm run build` for a production build and `npm run lint` for ESLint.

## Authentication and permissions

- Register at `/register` with first name, last name, email, password, and password confirmation. Registration does not send a role; new accounts should receive the regular-user role from the backend. When registration returns a token and user, the app signs in automatically; otherwise it directs the user to sign in.
- Sign in at `/login`. The API should return an `access_token` (or `token`) and a safe `user` object containing the user's role.
- The token and user are kept in session storage and the bearer token is attached to API requests. Never put passwords or secrets in Vite environment variables prefixed with `VITE_`.
- Product list and detail pages require a signed-in user. Guests are redirected to `/login`; a 401 response clears a stale session. A 403 response is shown as an access error.
- Only administrators can create, update, and delete products. The frontend hides or disables those controls for regular users, but the backend must independently enforce the same permissions.
- Signing out calls `POST /logout` to revoke the current token and clears the local session even if the request fails.

## API contract

The frontend expects these endpoints under the configured API base URL:

- `POST /register` with `firstname`, `lastname`, `email`, `password`, and `password_confirmation`.
- `POST /login` with `email` and `password`; the response includes a token and user.
- `POST /logout` for the authenticated user's current token.
- `GET /products`, `GET /products/{id}`, and `GET /categories` for authenticated catalog data.
- `POST /products`, `PATCH /products/{id}`, and `DELETE /products/{id}` for administrator-only product management.
- `/product-photos` endpoints for product images. The product API resource returns the first photo as `image`.

New products require a valid `category_id`. Match the registration field names and response shapes to the Laravel API if its user model or API contract differs.

## Known limitations

- The frontend stores the bearer token in `sessionStorage` and does not refresh tokens. An API `401` clears the local session and requires the user to sign in again.
- Password reset and email verification are not implemented in this activity.
