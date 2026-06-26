# BiblioDrop – Online Book Delivery Management System (Client Side)

BiblioDrop is a comprehensive full-stack web application designed to connect avid readers and students with local libraries and independent book owners. The platform allows users to browse diverse book collections, request doorstep delivery via secure Stripe payments, and manage their reading lists. It features dedicated role-based dashboards for Users, Librarians, and Admins, built with a modern, cohesive UI.

## 🔗 Deployment Links & Credentials
- **Live Site URL:** [Insert Live Link Here]
- **Backend Repository:** [Insert Backend GitHub Link Here]
- **Default System Admin Access:**
  - **Email:** `admin@gmail.com`
  - **Password:** `Admin@123`

---

## ⚡ Key Features

### 1. User (Reader) Journey
- **Dynamic Book Exploration:** Explore, search by title/author, and filter books by category, fee range, and availability with smooth server-side pagination (6–12 items per page).
- **Stripe Payment Integration:** Secure and instant delivery fee checkout natively managed via Stripe.
- **Verified Review System:** A strict interactive system allowing ratings and comments *only* for books successfully delivered to the user.
- **Personalized Dashboard:** Data visualization charts tracking total books read, pending deliveries, and expenditures, along with custom Reading Lists and Wishlist controls.

### 2. Librarian (Provider) Space
- **Inventory Control:** Add books easily using forms integrated with the **imgBB API** for high-resolution cover hosting.
- **Double-Gated Flow:** New book listings are initialized as `Pending Approval` and hidden from the public browse section until an Admin approves them.
- **Publishing Power:** Toggle approved books between `Published` and `Unpublished` states anytime.
- **Delivery Management:** Track and update delivery order states from `Pending` $\rightarrow$ `Dispatched` $\rightarrow$ `Delivered`.

### 3. Administrator Dashboard
- **Platform Analytics:** Interactive dashboard charts (Pie charts/Bar charts) monitoring total users, books, deliveries, and overall platform revenue.
- **Approval Queue:** Review pending book requests with single-click `Approve & Publish` or `Delete` controls.
- **User Management:** Update user levels (User $\leftrightarrow$ Librarian $\leftrightarrow$ Admin) or securely remove users from the ecosystem.

### 4. UI/UX Design Standards
- **Cohesive Typography & Color Palette:** Designed with balanced contrast, proper alignment, and consistent component styling (strictly avoiding unorganized or "Gobindo" design flows).
- **Framer Motion Animations:** Fully animated homepage and route transitions for a premium look and feel.
- **Robust Session Handling:** Built using **Better Auth** ensuring that logged-in users do *not* redirect to the login page upon manual browser reloads.
- **Modern Branding:** Integration of the newly rebranded X logo replacing the old Twitter bird.

---

## 📦 Installed Dependencies & Ecosystem

The following core npm packages have been used to build this application:

- `react` / `next.js` (Core Framework)
- `better-auth` (Authentication infrastructure supporting Email/Password and Google OAuth)
- `framer-motion` (High-fidelity interface animations)
- `recharts` / `chart.js` (Dashboard data visualization and metrics)
- `@stripe/stripe-js` / `@stripe/react-stripe-js` (Secure client checkout tokens)
- `tailwind-merge` / `daisyui` or `heroui` (Utility components and clean responsive layouts)
- `lucide-react` (Interface iconography and modern X logo)
- `react-hook-form` & `sweetalert2` / `react-hot-toast` (Alert handling and form validation)

---

## 🔧 Environment Configuration (`.env.local`)

To run the client application locally, create a `.env.local` file in the root folder and add the following keys:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_public_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Better Auth Configuration
BETTER_AUTH_SECRET=your_auth_secret_long_hash
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000