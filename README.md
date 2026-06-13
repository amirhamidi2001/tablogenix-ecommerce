# ⚡ Tablogenix — Smart Electrical Panel E-Commerce Platform

A full-stack e-commerce platform built for selling smart electrical panels, combining a robust **Django REST API** backend with a snappy **React + Vite** frontend — all wired together and ready to ship via **Docker Compose** (development or production environments).

> Browse products, manage orders, chat with support in real time, and run the entire store from a powerful admin dashboard.

---

## ✨ Features at a Glance

### 🛍️ Storefront
- Browse products by category, brand, and color with server-side filtering and pagination
- Detailed product pages with ratings, reviews, and related product suggestions
- Keyword search across the catalog
- Countdown timers and best-seller highlights on the homepage

### 🔐 Authentication & Accounts
- JWT-based login & registration with email confirmation
- Forgot / reset password flow with branded HTML email templates
- Secure token refresh handled automatically on the frontend

### 🛒 Shopping & Checkout
- Persistent cart (add, update quantity, remove, clear)
- Full checkout flow with address selection and order confirmation page
- Order history with the ability to cancel pending orders

### 👤 User Dashboard
- Profile management and avatar upload
- Saved addresses, payment methods, and wishlist
- Order tracking, review management, and notification preferences
- All accessible from a clean tabbed sidebar layout

### 💬 Real-Time Support Chat
- Live customer ↔ support chat powered by **Django Channels** and **WebSockets** (Redis as the channel layer)
- A floating `ChatWidget` for customers and a dedicated `AdminChat` panel for agents
- Chat rooms can be assigned, opened, or closed by admins

### 🛠️ Admin Dashboard
- Analytics overview with revenue stats and user/product breakdowns
- Full CRUD for products, categories, and brands (with image uploads)
- Order status management, review moderation, and contact message inbox
- User management with role and verification controls

### 📝 A Built-In Blog
- Full posts & categories — Each post has a title, cover image, author, excerpt, and category
- Featured & related posts — A hero section highlights one featured post
- Comments & engagement — Readers can leave comments with optional website links

### 🗺️ SEO & Discoverability
- XML sitemaps for both the shop (`shop/sitemaps.py`) and blog (`blog/sitemaps.py`)
- `robots.txt` and `ads.txt` shipped with the frontend build

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python · Django · Django REST Framework |
| **Real-Time** | Django Channels · Redis 7 |
| **Database** | PostgreSQL 15 |
| **Frontend** | React 18 · Vite · Tailwind CSS |
| **Auth** | JWT (SimpleJWT) |
| **Server (prod)** | Nginx (serves the built frontend) |
| **Testing (backend)** | pytest + pytest-django |
| **Testing (frontend)** | Vitest + React Testing Library |
| **Containerization** | Docker · Docker Compose (dev / prod profiles) |

---

## 📁 Project Structure (Simplified)

```
tablogenix-ecommerce/
├── backend/
│   ├── accounts/           # Auth: registration, login, email confirmation, password reset
│   ├── blog/               # Blog posts, categories, comments, related posts
│   ├── cart/               # Session/user cart management
│   ├── chat/               # WebSocket-powered support chat (Channels + Redis)
│   ├── contact/            # Contact form messages
│   ├── core/               # Django settings split into base/development/production
│   ├── dashboard/          # User & admin dashboard APIs (profile, orders, wishlist, analytics…)
│   ├── order/              # Order creation and lifecycle
│   ├── shop/               # Products, categories, brands, colors, reviews
│   ├── media/profiles/     # User uploaded avatars + default.webp
│   ├── Dockerfile
│   ├── manage.py
│   ├── pytest.ini
│   └── requirements.txt
├── frontend/
│   ├── public/             # Static assets: robots.txt, ads.txt, favicon, images
│   ├── src/
│   │   ├── components/     # Reusable UI (Header, Footer, ChatWidget, admin components…)
│   │   ├── pages/          # Route-level pages (Home, ProductDetails, Cart, Checkout, Admin…)
│   │   ├── context/        # AuthContext, CartContext, WishlistContext
│   │   ├── hooks/          # useChatWebSocket
│   │   ├── services/       # Centralised Axios API layer
│   │   └── __tests__/      # Vitest + React Testing Library (unit & component tests)
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vitest.config.js
│   └── package.json
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose installed on your machine — that's all.

### 1. Clone the repo

```bash
git clone https://github.com/amirhamidi2001/tablogenix-ecommerce.git
cd tablogenix-ecommerce
```

### 2. Configure environment variables

Create a `.env` file at the project root

```env
DJANGO_SETTINGS_MODULE=core.settings.development

# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (matches docker-compose defaults)
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres

# Redis
REDIS_URL=redis://redis:6379/0

# Email (for confirmation & password-reset emails)
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_HOST_USER=you@example.com
EMAIL_HOST_PASSWORD=your-email-password
```

### 3. Choose your environment

| Environment | Compose file                    | Use case                  |
|-------------|---------------------------------|---------------------------|
| Development | `docker-compose.dev.yml`        | Hot reload, debugging     |
| Production  | `docker-compose.prod.yml`       | Optimised, static serving |

For development:

```bash
docker compose -f docker-compose.dev.yml up --build
```

For production (requires additional SSL/reverse proxy setup):

```bash
docker compose -f docker-compose.prod.yml up --build
```

Docker Compose will spin up four services:

| Service | What it does | Exposed on |
|---|---|---|
| `db` | PostgreSQL 15 | `5432` |
| `redis` | Redis 7 (Channels layer) | `6379` |
| `backend` | Django + Daphne (ASGI) | `8000` |
| `frontend` | React app served by Nginx | `80` (dev) / `443` (prod) |

### 4. Run migrations & seed data

In a separate terminal (while containers are running):

```bash
# Apply database migrations
docker compose exec backend python manage.py migrate

# (Optional) Create a superuser for the admin panel
docker compose exec backend python manage.py createsuperuser

# (Optional) Seed the shop with sample products, categories, and brands
docker compose exec backend python manage.py seed_shop

# (Optional) Seed the blog with sample posts and categories
docker compose exec backend python manage.py seed_blog
```

### 5. Open the app

| URL | Description |
|---|---|
| `http://localhost` | Storefront (development) |
| `http://localhost/admin` | Django admin |
| `http://localhost:8000/api/` | REST API root |

---

## 🔌 API Overview

The backend exposes a RESTful API under `/api/`. Main endpoint groups:

| Prefix | Covers |
|---|---|
| `/api/auth/` | Register, login, token refresh, email confirmation, password reset |
| `/api/products/` | Product listing, detail, related, reviews |
| `/api/categories/` · `/api/brands/` · `/api/colors/` | Catalog metadata |
| `/api/cart/` | Cart CRUD |
| `/api/orders/` | Place and retrieve orders |
| `/api/dashboard/` | User profile, addresses, wishlist, notifications, summaries |
| `/api/dashboard/admin/` | Admin analytics, user/product/order/review management |
| `/api/chat/` | Support chat rooms and message history |
| `/api/contact/` | Contact form submissions |

WebSocket connections for chat: `ws://<host>/ws/chat/<room_id>/`.

---

## 🧪 Testing

### Backend tests (pytest)

```bash
# Run all backend tests
docker compose exec backend pytest

# Run tests for a specific app
docker compose exec backend pytest shop
```

> The backend uses `pytest.ini` with pytest‑django, factory boy, and coverage support.

### Frontend tests (Vitest)

```bash
# Run frontend tests inside the container
docker compose exec frontend npx vitest run

# Or run them locally (from the frontend folder)
cd frontend
npm install
npx vitest run
```

Frontend tests are located in `src/__tests__/` and cover components, pages, and API integration.

---

## 🐳 Docker Services In Detail

**Development** (`docker-compose.dev.yml`) includes:
- Hot reload for backend (Daphne auto‑restart)
- Vite dev server proxied through Nginx (or directly exposed)
- Volume mounts for live code sync

**Production** (`docker-compose.prod.yml`) includes:
- Pre‑built static files (via `npm run build`)
- Nginx serving built frontend + proxying API/WebSocket
- Daphne with more workers (via `-b 0.0.0.0 -p 8000`)

Both files share the same underlying services but differ in `command`, volumes, and `environment`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ by <a href="https://github.com/amirhamidi2001">amirhamidi2001</a></p>