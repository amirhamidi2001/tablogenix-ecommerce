# ⚡ Tablogenix — Smart Electrical Panel E-Commerce Platform

A full-stack e-commerce platform built for selling smart electrical panels, combining a robust **Django REST API** backend with a snappy **React + Vite** frontend — all wired together and ready to ship via **Docker Compose**.

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
| **Containerization** | Docker · Docker Compose |

---

## 📁 Project Structure

```
tablogenix-ecommerce/
├── backend/
│   ├── accounts/       # Auth: registration, login, email confirmation, password reset
│   ├── cart/           # Session/user cart management
│   ├── chat/           # WebSocket-powered support chat (Channels + Redis)
│   ├── contact/        # Contact form messages
│   ├── dashboard/      # User & admin dashboard APIs (profile, orders, wishlist, analytics…)
│   ├── order/          # Order creation and lifecycle
│   ├── shop/           # Products, categories, brands, colors, reviews
│   ├── core/           # Django settings, URL root, ASGI/WSGI config
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI pieces (Header, Footer, ChatWidget, admin components…)
│   │   ├── pages/      # Route-level pages (Home, ProductDetails, Cart, Checkout, Admin…)
│   │   ├── context/    # AuthContext, CartContext, WishlistContext
│   │   ├── hooks/      # useChatWebSocket
│   │   └── services/   # Centralised Axios API layer
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose installed on your machine — that's genuinely all you need.

### 1. Clone the repo

```bash
git clone https://github.com/amirhamidi2001/tablogenix-ecommerce.git
cd tablogenix-ecommerce
```

### 2. Configure environment variables

Create a `.env` file at the project root (or populate the values directly in `docker-compose.yml` for local development). At minimum you'll want:

```env
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

### 3. Fire everything up

```bash
docker compose up --build
```

Docker Compose will spin up four services:

| Service | What it does | Exposed on |
|---|---|---|
| `db` | PostgreSQL 15 | `5432` |
| `redis` | Redis 7 (Channels layer) | `6379` |
| `backend` | Django + Daphne (ASGI) | `8000` |
| `frontend` | React app served by Nginx | `80` |

### 4. Run migrations & seed data

In a separate terminal:

```bash
# Apply database migrations
docker compose exec backend python manage.py migrate

# (Optional) Create a superuser for the admin panel
docker compose exec backend python manage.py createsuperuser

# (Optional) Seed the shop with sample products, categories, and brands
docker compose exec backend python manage.py seed_shop
```

### 5. Open the app

| URL | Description |
|---|---|
| `http://localhost` | Storefront |
| `http://localhost/admin` | Django admin |
| `http://localhost:8000/api/` | REST API root |

---

## 🔌 API Overview

The backend exposes a RESTful API under `/api/`. A quick summary of the main endpoint groups:

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

WebSocket connections for chat are handled at `ws://<host>/ws/chat/<room_id>/`.

---

## 🐳 Docker Services In Detail

```yaml
# Simplified view of docker-compose.yml
services:
  db:       postgres:15   # Persistent volume, health-checked
  redis:    redis:7        # Channel layer for Django Channels
  backend:  ./backend      # Daphne ASGI server on :8000
  frontend: ./frontend     # Vite build → Nginx on :80, proxies /api & /ws to backend
```

The Nginx config in `frontend/nginx.conf` handles routing: static assets are served directly, and `/api/` + `/ws/` are proxied to the Django backend.

---

## 🧪 Running Tests

```bash
# Run all backend tests
docker compose exec backend python manage.py test

# Run tests for a specific app
docker compose exec backend python manage.py test shop
```

Each Django app contains a `tests.py` file ready to be expanded.

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