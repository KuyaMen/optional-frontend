# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Product Catalog

This React, Vite, and Material UI app manages products through a REST API using Axios. The backend is the source of truth; the catalog and product details are loaded from the API.

### Setup

1. Run `npm install` to install dependencies.
2. Set `VITE_API_BASE_URL` in the project-root `.env` file. The current value is `http://localhost:8000/api`.
3. Start the frontend with `npm run dev`. Ensure the backend is running and allows requests from the frontend origin.

Run `npm run build` for a production build and `npm run lint` for ESLint.

### API Contract

The frontend uses `GET /products`, `GET /products/{id}`, and `GET /categories` for public catalog data. It signs in with `POST /login`, which returns an `access_token`; the token is kept in session storage and sent as a Bearer token for protected requests.

Creating, updating, and deleting products use `POST /products`, `PATCH /products/{id}`, and `DELETE /products/{id}`. OPTIONAL requires an authenticated admin for these actions. New products require a valid `category_id`. Product images are stored separately through `/product-photos`, and the API resource returns the first photo as `image`.

The configured base URL is `http://localhost:8000/api`. Use an existing admin account to manage products; registration creates a regular user. Do not put secrets in Vite environment variables prefixed with `VITE_`.
