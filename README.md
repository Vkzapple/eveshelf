# eveshelf

A personal reading shelf: books I have read, books on my wishlist, and short reviews
worth passing on. Public reading log plus a private admin studio backed by Supabase.

## Stack

React 18, Vite, React Router, TanStack Query, Supabase (database + auth),
React Hook Form, Lucide icons, and Sonner toasts.

## 1. Create the database

In the Supabase dashboard, open **SQL Editor** and run, in order:

1. `supabase/schema.sql` — creates the `books` and `recommendations` tables, trigger, indexes, and RLS policies.
2. `supabase/seed.sql` — optional starter shelf with 12 books and covers.

If you seeded the shelf before covers were added, run `supabase/covers.sql` once
to fill the existing rows (it also adds local covers for the Indonesian titles).

For an existing project that does not have the recommendation table yet, run
`supabase/recommendations.sql` once.

The policies allow public reads and writes only for signed-in users. Disable new
sign-ups in **Authentication → Providers → Email** so only your account can write.

## 2. Create the admin account

In **Authentication → Users**, add your admin user with an email and password.
The admin login page does not offer sign-up on purpose.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values from
**Project Settings → API**:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Run

```bash
npm install
npm run dev
```

- Public shelf: `http://localhost:5173/`
- Admin studio: `http://localhost:5173/admin` (not linked in the public nav)

Production build:

```bash
npm run build
npm run preview
```

## Admin studio

Sign in with the Supabase account, then add, edit, delete, and mark books as
**Read** or **Wishlist**. New books appear in the public grid immediately. The studio
also supports JSON export/import for backups.

Leave the cover field empty and the site will look one up on Open Library. You can
also use **Find cover** in the form to fetch and store it explicitly.

Visitor recommendations no longer go to an email inbox. They are stored in the
`recommendations` table and show up in the admin **Recommendation inbox**, and the
landing page autoplays a vertical loop of the latest ones.

## Deployment

The app uses browser history routing, so `/admin` needs an SPA fallback:

- Netlify: `public/_redirects` is included.
- Vercel: `vercel.json` is included.
- Other hosts: rewrite unknown paths to `/index.html`.
- GitHub Pages does not support SPA fallbacks; use a host such as Netlify or Vercel
  if you need a clean `/admin` URL.

Set the same environment variables in the hosting provider before deploying.

## Structure

```text
src/
  components/       public UI and shared book components
  components/admin/ admin form, login, and setup screens
  hooks/            session and books queries
  lib/              Supabase client, CRUD queries, helpers
  pages/            home and admin pages
supabase/
  schema.sql        tables, RLS policies, trigger
  seed.sql          starter books with covers
  covers.sql        fill covers for an existing starter shelf
  recommendations.sql add the recommendation inbox
public/covers/      optional local cover images
```

Cover images can be absolute URLs or paths such as `covers/1984.jpg`.
