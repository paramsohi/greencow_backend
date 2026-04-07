# BackendCow - Dairy Business Backend API

Production-ready Node.js + TypeScript + Express + Prisma + MySQL backend for dairy business workflows.

## Features

- JWT auth with access + refresh tokens
- bcrypt password hashing
- Prisma ORM for MySQL with migration and seed support
- Layered architecture (routes, controllers, services, repositories, validators, middleware)
- Zod request validation
- Pino logging
- Centralized error handling and consistent JSON responses
- Role/ownership guard for user-bound resources
- Pagination, sorting, and filtering
- Rate limiting and CORS
- Jest + Supertest tests

## Tech Stack

- Node.js
- Express
- TypeScript
- MySQL
- Prisma ORM
- Zod
- Pino
- Jest + Supertest
- EJS (for Admin UI)
- Bootstrap 5 (for Admin UI)
- Express-Session (for Admin UI)

## 🎯 Admin Panel

Complete admin dashboard for system management and monitoring:

**Features:**
- 📊 Real-time dashboard with system statistics
- 🔐 Session-based login/logout
- 📋 API logs viewer with pagination
- 📱 Responsive Bootstrap UI
- 🛡️ Role-based access control

**Quick Start:**
```bash
npm run db:seed          # Create admin user (admin@dairy.local / Admin@123)
npm start                # Start server
# Open: http://localhost:4000/admin/login
```

**Documentation:**
- [ADMIN_UI_QUICKSTART.md](./ADMIN_UI_QUICKSTART.md) - Get started in 3 minutes
- [ADMIN_PANEL_COMPLETE.md](./ADMIN_PANEL_COMPLETE.md) - Full technical guide
- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Complete setup summary

## Project Structure

~~~
src/
  app.ts
  server.ts
  config/
  common/
  modules/
    auth/
    users/
    customers/
    sales/
    payments/
    expenses/
    reports/
prisma/
  schema.prisma
  seed.ts
  migrations/0001_init/migration.sql
tests/
~~~

## Environment

1. Copy environment file:

~~~bash
cp .env.example .env
~~~

2. Update values if needed.

## Local Run Commands (in order)

~~~bash
npm install
cp .env.example .env
docker compose up -d
npm run prisma:generate
npm run db:migrate
npm run db:seed
npm run dev
~~~

### One-command local start

~~~bash
npm run start:local
~~~

## Quality Commands

~~~bash
npm run lint
npm run build
npm test
~~~

## Database Tables

- users
- user_profiles
- customers
- sales_entries
- payment_records
- expense_records
- refresh_tokens

Includes foreign keys, indexes, timestamps, and soft delete via deleted_at where applicable.

## Authentication Flow

1. Signup or login returns accessToken and refreshToken
2. Send access token as Authorization header:

~~~
Authorization: Bearer <access_token>
~~~

3. Use refresh-token endpoint to rotate refresh token

## API Base URL

~~~
http://localhost:4000/api
~~~

## Curl Examples for Every Endpoint

### Auth

~~~bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@dairy.local","password":"Password@123","fullName":"Dairy Owner","phone":"+1000000000","businessName":"Happy Cows Dairy","businessAddress":"Main Market Road"}'

curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@dairy.local","password":"Password@123"}'

curl -X POST http://localhost:4000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'

curl -X POST http://localhost:4000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'

curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
~~~

### Users/Profile

~~~bash
curl http://localhost:4000/api/users/1 \
  -H "Authorization: Bearer <access_token>"

curl -X PATCH http://localhost:4000/api/users/1 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Updated Name","businessAddress":"Updated Address"}'
~~~

### Customers

~~~bash
curl -X POST http://localhost:4000/api/users/1/customers \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Retail Shop","phone":"+1000000009","address":"City Center","openingBalance":300}'

curl "http://localhost:4000/api/users/1/customers?page=1&limit=20&search=retail&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer <access_token>"

curl http://localhost:4000/api/customers/1 \
  -H "Authorization: Bearer <access_token>"

curl -X PATCH http://localhost:4000/api/customers/1 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1000000010"}'

curl -X DELETE http://localhost:4000/api/customers/1 \
  -H "Authorization: Bearer <access_token>"
~~~

### Sales

~~~bash
curl -X POST http://localhost:4000/api/users/1/sales \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"saleDate":"2026-03-09T09:00:00.000Z","productType":"Cow Milk","quantityLiters":20,"ratePerLiter":60,"notes":"Morning shift"}'

curl "http://localhost:4000/api/users/1/sales?page=1&limit=20&fromDate=2026-03-01T00:00:00.000Z&toDate=2026-03-31T23:59:59.000Z&sortBy=saleDate&sortOrder=desc" \
  -H "Authorization: Bearer <access_token>"

curl -X PATCH http://localhost:4000/api/sales/1 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"quantityLiters":25,"ratePerLiter":62}'

curl -X DELETE http://localhost:4000/api/sales/1 \
  -H "Authorization: Bearer <access_token>"
~~~

### Payments

~~~bash
curl -X POST http://localhost:4000/api/users/1/payments \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"paymentDate":"2026-03-09T11:00:00.000Z","amount":1200,"paymentMethod":"cash","reference":"PMT-1001","notes":"Part payment"}'

curl "http://localhost:4000/api/users/1/payments?page=1&limit=20&paymentMethod=cash&sortBy=paymentDate&sortOrder=desc" \
  -H "Authorization: Bearer <access_token>"

curl -X PATCH http://localhost:4000/api/payments/1 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":1400}'

curl -X DELETE http://localhost:4000/api/payments/1 \
  -H "Authorization: Bearer <access_token>"
~~~

### Expenses

~~~bash
curl -X POST http://localhost:4000/api/users/1/expenses \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"expenseDate":"2026-03-09T07:00:00.000Z","category":"Feed","amount":450,"description":"Feed bag purchase"}'

curl "http://localhost:4000/api/users/1/expenses?page=1&limit=20&category=Feed&sortBy=expenseDate&sortOrder=desc" \
  -H "Authorization: Bearer <access_token>"

curl -X PATCH http://localhost:4000/api/expenses/1 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":500}'

curl -X DELETE http://localhost:4000/api/expenses/1 \
  -H "Authorization: Bearer <access_token>"
~~~

### Reports

~~~bash
curl "http://localhost:4000/api/users/1/reports/daily-sales-summary?date=2026-03-09" \
  -H "Authorization: Bearer <access_token>"

curl "http://localhost:4000/api/users/1/reports/monthly-summary?month=2026-03" \
  -H "Authorization: Bearer <access_token>"

curl "http://localhost:4000/api/users/1/reports/customer-ledger/1?fromDate=2026-03-01T00:00:00.000Z&toDate=2026-03-31T23:59:59.000Z" \
  -H "Authorization: Bearer <access_token>"
~~~

## Postman Collection

A full Postman collection is available at:

- postman/BackendCow.postman_collection.json

Import into Postman and configure variables:

- baseUrl = http://localhost:4000/api
- accessToken = Bearer token
- refreshToken = Refresh token string
- userId = 1
- customerId = 1
- saleId = 1
- paymentId = 1
- expenseId = 1

## Notes

- SQL injection is mitigated by Prisma parameterized queries.
- Sensitive secrets should be replaced in production.
- If docker is not available, run MySQL locally and keep DATABASE_URL aligned.
