# BiblioDrop – Online Book Delivery Management System

## 🌐 Live URL
[https://bibliodrop-client-sand.vercel.app](https://bibliodrop-client-sand.vercel.app)

## 📌 Purpose
BiblioDrop is a comprehensive digital platform that connects avid readers and students with local libraries and independent book owners. Users can browse diverse book collections, request doorstep delivery, and manage their reading lists. Librarians can list their inventory and manage delivery requests, while an Admin oversees the entire ecosystem.

## 🔑 Admin Credentials
- **Email:** admin@gmail.com
- **Password:** admin@123

## ✨ Key Features

### Authentication
- Email/Password registration and login
- Google OAuth via Better Auth
- Role-based access (User, Librarian, Admin)
- JWT token based protected routes

### User Features
- Browse, search, and filter books by category, fee range, and availability
- Request book delivery via Stripe payment
- Track delivery history (Pending → Dispatched → Delivered)
- Add books to personal wishlist
- Leave verified reviews (only after receiving a book)
- View reading list of delivered books

### Librarian Features
- Add new books with imgBB image hosting
- Manage book inventory (edit, delete, publish/unpublish)
- Track and update delivery statuses
- View earnings and delivery statistics

### Admin Features
- Approve or reject pending book submissions
- Manage all users (change roles, delete accounts)
- Platform-wide book management (unpublish, delete)
- View all transactions and revenue analytics
- Dashboard with charts (pie chart, bar chart)

### Additional Features
- Stripe payment integration for delivery fees
- Server-side pagination on Browse page
- Advanced search and filtering
- Skeleton loaders and loading states
- Responsive design (mobile, tablet, desktop)
- Framer Motion animations
- Toast notifications

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (App Router)
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- Better Auth (client)
- React Hot Toast
- React Icons

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- Better Auth
- Stripe
- JWT
- imgBB API

## 📦 NPM Packages Used

### Client
| Package | Purpose |
|---|---|
| `next` | React framework |
| `axios` | HTTP requests |
| `better-auth` | Authentication |
| `framer-motion` | Animations |
| `recharts` | Charts |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Icons |
| `@stripe/stripe-js` | Stripe payment |

### Server
| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `better-auth` | Authentication |
| `stripe` | Payment processing |
| `jsonwebtoken` | JWT tokens |
| `cors` | Cross-origin requests |
| `cookie-parser` | Cookie handling |
| `dotenv` | Environment variables |

## 🔗 GitHub Repositories
- **Client:** [https://github.com/mouislambd/bibliodrop-client](https://github.com/mouislambd/bibliodrop-client)
- **Server:** [https://github.com/mouislambd/bibliodrop-server](https://github.com/mouislambd/bibliodrop-server)