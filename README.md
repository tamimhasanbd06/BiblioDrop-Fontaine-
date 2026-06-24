# BiblioDrop Frontend

BiblioDrop is an Online Book Delivery Management System built with Next.js, Better Auth, Tailwind CSS, Framer Motion, Recharts, Stripe flow, and ImgBB upload support.

## Updated Features
- Dynamic navbar with role-based dashboard links.
- Home page with hero, featured books, top librarians, and category links.
- Browse Books page with search, category, availability, fee filters, sort, skeleton loading, empty state, and server-side pagination.
- Book Details page with dynamic book information, Stripe request delivery, owner controls, and reviews.
- Verified review page.
- User dashboard overview, delivery history, reading list, and review management.
- Librarian dashboard overview, add book with ImgBB, inventory, and delivery status management.
- Admin dashboard overview, approval queue, manage users, manage books, and transactions.
- Global loading and error pages.
- Protected API calls through `/api/server` so JWT cookie is forwarded safely.
- Bangla comments added in updated files.

## Required Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BACKEND_URL=http://localhost:8000
MONGODB_URI=your_mongodb_atlas_uri
MONGODB_DB=biblioteca
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
JWT_SECRET=your_jwt_secret
JWT_COOKIE_NAME=bd_token
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
GOOGLE_CLIENT_ID=your_google_client_id_optional
GOOGLE_CLIENT_SECRET=your_google_client_secret_optional
```

## Scripts
```bash
npm install
npm run dev
npm run build
npm start
```
