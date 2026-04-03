# Finance Dashboard Backend API

This project is a backend system for a finance dashboard where users with different roles can manage financial records and view insights.

The main goal of this project was to demonstrate backend design, API structuring, data modeling, and access control — not to build a production-ready system.

---

## Featured On

I posted about this project on Twitter — feel free to check it out!

[![Twitter Thread](https://img.shields.io/badge/Twitter-See%20the%20thread-1DA1F2?style=flat&logo=twitter)](https://x.com/nikhil_kal1047)

> Built and shared as part of my backend development internship assignment.
> Follow along for more projects — [@nikhil_kal1047](https://x.com/nikhil_kal1047)

## Tech Stack

- **Node.js + Express** — for building REST APIs
- **Prisma ORM** — for database access
- **PostgreSQL (Neon)** — cloud database (no local setup required)
- **JWT** — authentication
- **Joi** — request validation
- **Swagger** — API documentation

I chose this stack because it keeps the implementation simple while still being structured and scalable.

---

## Project Structure

The project follows a layered architecture to keep responsibilities separate:

- **Routes** → define endpoints and attach middleware
- **Controllers** → handle request/response (no business logic)
- **Services** → contain business logic
- **Repositories** → handle all database queries using Prisma
- **Middlewares** → authentication, role checks, validation, error handling
- **Validators** → input validation schemas

This structure helped avoid mixing logic and made debugging easier.

---

## Architecture Flow

Client
→ Routes
→ Middleware (Auth, RBAC, Validation)
→ Controllers
→ Services
→ Repositories
→ Database (PostgreSQL via Prisma)

---

## Setup & Run

```bash
git clone <repo-url>
cd finance-backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your_neon_connection_string"
JWT_SECRET="your_secret"
PORT=3000
```

Then run:

```bash
npx prisma db push
npm run dev
```

API will run at:
http://localhost:3000

Swagger docs:
http://localhost:3000/api/docs

---

## Database Setup

This project uses PostgreSQL via Neon.

Just add your Neon connection string in `.env` and run:

```bash
npx prisma db push
```

---

## Seed Data (Optional)

You can populate the database with sample users and transactions:

```bash
npm run seed
```

This creates:

- Admin, Analyst, and Viewer users
- Sample transactions across multiple months

---

## Roles and Permissions

The system supports three roles:

- **VIEWER**
  - Can view transaction data only

- **ANALYST**
  - Can view data
  - Can access dashboard insights
  - Can update/delete their own transactions

- **ADMIN**
  - Full access
  - Can manage users and all transactions

Access control is enforced using middleware.

---

## Features Implemented

- User registration and login (JWT-based)
- Role-based access control (RBAC)
- User management (Admin only)
- Financial records CRUD
- Filtering (type, category, date range)
- Pagination and sorting
- Dashboard APIs:
  - Total income
  - Total expenses
  - Net balance
  - Category-wise breakdown
  - Monthly trends

- Input validation (Joi)
- Global error handling
- Soft delete for transactions
- Swagger API documentation

---

## API Overview

All routes are prefixed with `/api`.

### Auth

- POST /auth/register
- POST /auth/login
- GET /auth/me

### Users (Admin only)

- GET /users
- GET /users/:id
- PATCH /users/:id
- DELETE /users/:id

### Transactions

- GET /transactions (with filters & pagination)
- GET /transactions/:id
- POST /transactions (Admin only)
- PATCH /transactions/:id (Analyst, Admin)
- DELETE /transactions/:id (soft delete)

### Dashboard

- GET /dashboard/summary
- GET /dashboard/trends
- GET /dashboard/categories

---

## How to Test

1. Register a user or use seeded users
2. Login → get JWT token
3. Add token in header:

   ```
   Authorization: Bearer <token>
   ```

4. Call protected APIs like:
   - `/transactions`
   - `/dashboard/summary`

---

## Assumptions

- Each transaction belongs to the logged-in user
- Analysts can modify only their own transactions
- Viewers can only read data and cannot access analytics
- Role assignment is open during registration to simplify testing (in a real system, this should be restricted)

---

## Technical Decisions & Trade-offs

- I used a layered architecture to keep logic separated and maintainable.
- Prisma was chosen for cleaner queries, but for some dashboard aggregations I used raw SQL (`$queryRaw`) for flexibility.
- JWT is used for authentication because it's simple and stateless, but token invalidation is not implemented.
- Soft delete is used for transactions to preserve history instead of permanently deleting records.

---

## Limitations

- No token invalidation (logout not handled)
- Category is stored as a string (not normalized)
- No caching for dashboard queries
- Not optimized for very large datasets

---

## Future Improvements

- Add refresh tokens or token blacklist
- Normalize categories into a separate table
- Add caching for analytics APIs
- Restrict role assignment to admin only

---
