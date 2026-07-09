# Pulse Budget Tracker

Pulse Budget Tracker is a simple personal finance management system. It helps users log transactions, manage income and expenses, and view monthly financial analytics.

## Technologies Used

* Node.js
* Express.js
* PostgreSQL
* Vue.js 3
* Axios
* JWT Authentication
* bcrypt
* TailwindCSS
* winston
* cors


## Project Structure

```text
budget-tracker/
│
├── backend/
├── frontend/
└── README.md

```

## Installation

1. **Create the database:**
```sql
CREATE DATABASE budget_db;

```


2. **Import the database schema:**
```bash
psql -U postgres -d budget_db -f backend/src/database/schema.sql

```


3. **Install backend dependencies:**
```bash
cd backend
npm install

```


4. **Configure environment variables:**
copy a `.env.exmaple` to `.env` file ande edit in the `backend/` directory and update your database and JWT secret settings.
5. **Start the backend server:**
```bash
npm run dev

```


6. **Set up the frontend client:**
```bash
cd ../frontend
npm install
npm run dev

```



## Features

* User Login and Registration
* Secure JWT Authentication & Password Hashing
* Income and Expense Management (CRUD)
* Dynamic Category-based Aggregations
* Monthly Financial Analytics & Summaries
* API Request Logging & Multi-tiered Rate Limiting
* Fully Responsive Tailwind UI

## API Endpoints

### Authentication

* `POST /api/auth/register` - Sign up a new user
* `POST /api/auth/login` - Authenticate and get session token

### Transactions

* `GET /api/transactions` - Fetch current month's transactions and summaries
* `POST /api/transactions` - Log a new income or expense
* `PATCH /api/transactions/:id` - Update an existing ledger entry
* `DELETE /api/transactions/:id` - Remove a transaction entry
* `GET /api/transactions/months` - Get high-level historic monthly breakdown data
* `GET /api/transactions/month/:year/:month` - Get a detailed list for a specific calendar window

