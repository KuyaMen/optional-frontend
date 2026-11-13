# OPTIONAL Shop Frontend

## Project Description

OPTIONAL Shop is a product catalog and shopping cart. Customers can browse products and manage their cart. Administrators can add, edit, and delete products. The frontend gets product and account information from a Laravel API.

## Group Information

**Group Name:** OPTIONAL

| Member | GitHub Username |
| --- | --- |
| Kristian Jay Eugenio | [@KuyaMen](https://github.com/KuyaMen) |
| Jave Balbuena | [@jebzkybalbuena-debug](https://github.com/jebzkybalbuena-debug) |
| Grezz Quivon Mahinay | [@grasyaa](https://github.com/grezzxso) |
| Eula Jane Justiniane | [@eulzjustin](https://github.com/eulzjustin) |
| Cristine Pagobo | [@cristinayy](https://github.com/cristinayy) |
| Glicerio Lamento | [@Glicerio2000](https://github.com/Glicerio2000) |

**Frontend Repository:** [KuyaMen/optional-frontend](https://github.com/KuyaMen/optional-frontend)

**Backend Repository:** [KuyaMen/optional-backend](https://github.com/KuyaMen/optional-backend)

Invite all group members as collaborators to both repositories.

## Technologies Used

- React
- Vite
- JavaScript
- Material UI
- Axios (sends requests to the API)
- React Router (handles pages and URLs)
- ESLint (checks code for common problems)

## Requirements

For the frontend:

- Node.js 20.19+ or 22.12+
- npm
- Git

## Installation and Setup

Run the backend and frontend in separate terminals. Start the backend first.

### Frontend

1. Clone the frontend repository:

   ```sh
   git clone https://github.com/KuyaMen/optional-frontend.git
   ```

2. Open the frontend project folder:

   ```sh
   cd optional-frontend/ReactMUI
   ```

3. Install the project packages:

   ```sh
   npm install
   ```

4. Copy `.env.example` to `.env`. In PowerShell, use:

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS or Linux, use:

   ```sh
   cp .env.example .env
   ```

5. Start the frontend:

   ```sh
   npm run dev
   ```

6. Open the local URL shown in the terminal. It is usually `http://localhost:5173`.

To check the code, run `npm run lint`. To make a production build, run `npm run build`.

## Backend Connection

The frontend connects to the Laravel API. The example environment file sets the local API address to:

```text
http://localhost:8000/api
```

To start the backend, open another terminal:

1. Clone the backend and install its packages:

   ```sh
   git clone https://github.com/KuyaMen/optional-backend.git
   cd optional-backend
   composer install
   ```

2. Copy `.env.example` to `.env`. Use `Copy-Item .env.example .env` in PowerShell or `cp .env.example .env` on macOS/Linux.

3. Prepare the database and run the backend:

   ```sh
   php artisan key:generate
   php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
   php artisan migrate --seed
   php artisan serve --host=127.0.0.1 --port=8000
   ```

The `migrate --seed` command creates the database tables and adds sample products and a regular test user. If the browser reports a CORS error, allow `http://localhost:5173` in the backend's CORS settings.

If the API runs at a different address, update `VITE_API_BASE_URL` in the frontend `.env` file. Do not commit your local `.env` files. Keep `.env.example` free of secrets, and never put passwords or API keys in a frontend variable starting with `VITE_` because it is visible to the browser.

## Main Features

- Register an account and sign in.
- View product details and search the catalog.
- Add products to a cart and update cart quantities.
- Admins can add, edit, and delete products.
- The backend checks that only admins can change products.
- Admins do not see cart controls; opening `/cart` as an admin returns to the catalog.

The frontend asks users to sign in before showing the catalog, product details, or cart. The backend API allows product and category viewing without signing in.

## API Routes

These routes are part of the backend API. Add them to the base URL `http://localhost:8000/api`.

| Method and route | Purpose | Who can use it |
| --- | --- | --- |
| `POST /register` | Create a regular account | Anyone |
| `POST /login` | Sign in and get an access token | Anyone |
| `POST /logout` | Sign out and revoke the current token | Signed-in user |
| `GET /products` | Get all products | Public API route |
| `GET /products/{id}` | Get one product | Public API route |
| `POST /products` | Add a product | Admin |
| `PATCH /products/{id}` | Edit a product | Admin |
| `DELETE /products/{id}` | Delete a product | Admin |
| `GET /categories` | Get product categories | Public API route |
| `/product-photos` | Add, edit, or remove product photos | Signed-in user |
| `/carts` | View or change cart items | Signed-in user |

Protected requests include the access token in an `Authorization: Bearer ...` header. New products need a valid `category_id`. The product API returns its first photo as the product's `image`.

## Roles and Test Accounts

- **Regular user:** Can browse products and use the cart. Cannot add, edit, or delete products.
- **Admin:** Can add, edit, and delete products.

Running `php artisan migrate --seed` creates the regular test account `test@example.com` and sample products. The backend's public seed data does not create an admin account; ask the person managing the local backend to provide one for testing.

Passwords and access tokens are not listed here. Keep local test credentials private, and never add real passwords or secrets to a public README.

## Differences from the Activity Example

- This app uses separate `firstname` and `lastname` fields instead of one `name` field.
- It uses access tokens for sign-in. The frontend keeps the token in the browser session and does not refresh it automatically.
- It also uses categories, product photos, and cart routes.
- The backend allows product and category viewing without a token, but the frontend asks users to sign in first.

## Known Limitations

- Password reset and email verification are not implemented.
- When a token expires, the user must sign in again.
- The frontend has a cart but does not have a checkout or payment flow.
