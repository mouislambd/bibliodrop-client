# BiblioDrop — Client

BiblioDrop is an online book delivery management platform that connects readers and students with local libraries and independent book owners. Users can browse books, request doorstep delivery with secure payments, and manage their reading activity, while librarians and admins manage inventory, deliveries, and the overall platform.

## Live URL
https://bibliodrop-client-sand.vercel.app

## Key Features
- Browse, search, and filter books by category, price, and availability
- Secure delivery requests with Stripe payment integration
- Role-based dashboards for Users, Librarians, and Admins
- Authentication via Better Auth (Email/Password + Google OAuth)
- Book approval workflow for Admins
- Wishlist system for saving favorite books
- Verified review system (only after delivery is completed)
- Responsive design with Framer Motion animations
- Real-time dashboard analytics using Recharts

## Tech Stack
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Better Auth (React client)
- Recharts
- Framer Motion
- React Hot Toast
- Stripe.js

## npm Packages Used
- react, react-dom, react-router-dom
- axios
- tailwindcss, postcss, autoprefixer
- better-auth
- recharts
- framer-motion
- react-hot-toast
- react-icons
- @stripe/stripe-js

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the root with:

```

```