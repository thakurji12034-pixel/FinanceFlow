# FinanceFlow - Financial Habit Builder & Wealth Growth Tracker

FinanceFlow is a production-quality full-stack MERN application that helps students and young professionals track income, daily expenses, build consistent financial habits, set savings goals, and track their net worth.

## Project Overview

"Don't just track your money. Build better financial habits and grow your wealth."
This project combines Budget Tracking + Habit Building + Savings Goals + Wealth Tracking + Analytics into one seamless, modern SaaS-like dashboard.

## Features

- **Authentication**: Secure JWT-based registration and login with role-based access.
- **Financial Dashboard**: Summary of total balance, income, expenses, and net worth.
- **Income & Expense Tracking**: Add, edit, and delete transactions with categorizations.
- **Financial Habit Builder**: Create habits, track streaks, and maintain financial discipline.
- **Savings Goals**: Track progress towards specific financial targets (e.g., Emergency Fund).
- **Wealth & Assets Tracking**: Keep track of investments, stocks, and mutual funds to monitor overall portfolio growth.
- **Admin Panel**: Dedicated dashboard for administrators to view platform usage analytics.
- **Modern UI**: Fully responsive, dark-mode focused, premium aesthetic using Tailwind CSS and Recharts.

## Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide React.
- **Backend**: Node.js, Express.js, JWT, bcrypt, Helmet, CORS.
- **Database**: MongoDB & Mongoose.

## Architecture & Folder Structure

### Backend
```
backend/
├── config/         # MongoDB connection config
├── controllers/    # Route controllers/logic
├── middleware/     # Auth and error middleware
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── .env.example
├── seeder.js       # Demo data generation script
└── server.js       # Entry point
```

### Frontend
```
frontend/
├── src/
│   ├── components/ # Reusable UI components
│   ├── context/    # React Context (Auth)
│   ├── layouts/    # Main layout wrapper
│   ├── pages/      # Route pages (Dashboard, Habits, etc.)
│   ├── services/   # Axios API wrapper
│   ├── App.jsx     # Routing configuration
│   └── main.jsx    # Entry point
├── index.html
├── tailwind.config.js
└── package.json
```

## Installation & Setup

1. **Clone the repository** (or use the provided workspace).
2. **Setup Backend**:
   - `cd backend`
   - `npm install`
   - Copy `.env.example` to `.env` and set your variables (MongoDB URI, JWT Secret).
   - Run the seeder to get demo data: `node seeder.js`
   - Start the server: `npm run start` (or `npx nodemon server.js` for dev)
3. **Setup Frontend**:
   - `cd frontend`
   - `npm install`
   - Copy `.env.example` to `.env` and set `VITE_API_URL` if different from default.
   - Start the dev server: `npm run dev`

## Test Credentials

Demo data is seeded with the following user:
- **Email**: 2006vtanwar@gmail.com
- **Password**: Use the configured local demo password.

Admin user:
- **Email**: admin@financeflow.com
- **Password**: Use the configured local admin password.

## API Documentation
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Add transaction
- `GET /api/habits` - Get user habits
- `POST /api/habits/:id/complete` - Mark habit complete
- `GET /api/goals` - Get savings goals
- `GET /api/assets` - Get tracked assets
- `GET /api/dashboard/summary` - Get financial summary
- `GET /api/admin/analytics` - Get admin analytics

## Deployment

The application is structured to be deployed easily:
- **Frontend**: Deploy `frontend/` to Vercel (Build command: `npm run build`, Output: `dist`).
- **Backend**: Deploy `backend/` to Render (Start command: `node server.js`).
- **Database**: Use a free MongoDB Atlas Cluster for the `MONGO_URI`.

## Author
Developed for the Unified Mentor internship project.
