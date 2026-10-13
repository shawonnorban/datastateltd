# Inspire BD IT

Inspire Bangladesh Information Technology — company website, domain & hosting page and admin panel.

| Folder | What | Stack |
|---|---|---|
| `backend/` | API + database + file storage | Laravel 13, Sanctum, SQLite/MySQL |
| `frontend/` | Public website | React 19 + Vite |
| `admin/` | Admin panel | React 19 + Vite + Tailwind 4 + shadcn/ui |

## Run locally

```bash
# 1. Backend (PHP 8.4+, Composer)
cd backend
composer install
cp .env.example .env            # then set ADMIN_EMAIL and ADMIN_PASSWORD in .env
php artisan key:generate
touch database/database.sqlite   # when DB_CONNECTION=sqlite
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve                # http://localhost:8000

# 2. Public website (new terminal)
cd frontend && npm install && npm run dev      # http://localhost:5173

# 3. Admin panel (new terminal)
cd admin && npm install && npm run dev         # http://localhost:5174/admin/
```

Sign in to the admin panel with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`
(quote the password if it contains `#` or spaces).

For production build the admin once: `cd admin && npm run build`. Laravel then serves it at
`/admin` from `backend/public/admin-app`.

## What the admin controls

- **Site Settings** – name, logo, hero banner, contact, social, legal, branches
- **Page Sections** – the content blocks of every page (text, images, JSON items)
- **Page Titles & SEO** – browser title and meta description of every page
- **Domain & Hosting** – hosting packages (monthly / yearly / 3-year prices, features, specs) and domain prices
- **Job Applications** (CVs) and **Inquiries**

## Fonts

The site uses Segoe UI. See `frontend/public/fonts/README.md` for the font files.
