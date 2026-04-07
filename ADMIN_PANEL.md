# Admin Panel Documentation

## Overview
A complete admin panel system for the BackendCow application with role-based access control. Admins can view all system data, login/logout, and access dashboard statistics.

## Admin Credentials

### Seeded Admin User
- **Email**: `admin@dairy.local`
- **Password**: `Admin@123`

Create this user by running:
```bash
npm run db:seed
```

## Admin Endpoints

### Authentication

#### Admin Login
- **Endpoint**: `POST /admin/auth/login`
- **Description**: Login as admin
- **Request Body**:
```json
{
  "email": "admin@dairy.local",
  "password": "Admin@123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@dairy.local",
      "role": "ADMIN",
      "profile": { ... }
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}
```

#### Admin Logout
- **Endpoint**: `POST /admin/auth/logout`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Request Body**:
```json
{
  "refreshToken": "eyJ..."
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Admin logout successful"
}
```

### Data Access (All require Authorization)

All data endpoints require:
- **Headers**: `Authorization: Bearer {accessToken}`
- **Admin Role** verification

#### Get Dashboard Statistics
- **Endpoint**: `GET /admin/data/dashboard`
- **Description**: Get overall system statistics
- **Query Params**: None
- **Response**:
```json
{
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "totalUsers": 5,
    "totalCustomers": 12,
    "totalSales": 45,
    "activeUsers": 4,
    "totalRevenue": 125000,
    "totalExpenses": 15000
  }
}
```

#### Get All Users
- **Endpoint**: `GET /admin/data/users`
- **Description**: Get all registered users with pagination
- **Query Params**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response**:
```json
{
  "success": true,
  "message": "Users fetched",
  "data": [
    {
      "id": 1,
      "email": "owner@dairy.local",
      "role": "OWNER",
      "isActive": true,
      "createdAt": "2026-04-07T10:00:00Z",
      "profile": {
        "fullName": "Dairy Owner",
        "phone": "+1000000000",
        "businessName": "Happy Cows Dairy"
      }
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

#### Get All Customers
- **Endpoint**: `GET /admin/data/customers`
- **Description**: Get all customers across all users
- **Query Params**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response**: Returns paginated list of customers with user info

#### Get All Sales Entries
- **Endpoint**: `GET /admin/data/sales`
- **Description**: Get all sales entries system-wide
- **Query Params**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response**: Returns paginated list of sales with user and customer info

#### Get All Payments
- **Endpoint**: `GET /admin/data/payments`
- **Description**: Get all payment records system-wide
- **Query Params**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response**: Returns paginated list of payments with user and customer info

#### Get All Expenses
- **Endpoint**: `GET /admin/data/expenses`
- **Description**: Get all expense records system-wide
- **Query Params**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response**: Returns paginated list of expenses with user info

## Security Features

### Role-Based Access Control
- **ADMIN** role has exclusive access to all admin endpoints
- **OWNER** and **STAFF** roles are restricted from admin endpoints
- Admin guard middleware enforces role verification

### Authentication
- JWT-based authentication for all admin endpoints
- Access tokens for protected operations
- Refresh tokens for session management

### Middleware Stack
```
Route Handler
    ↓
authGuard (verify JWT token)
    ↓
adminGuard (verify ADMIN role)
    ↓
Controller Logic
```

## Usage Examples

### Example 1: Admin Login Flow
```bash
# 1. Login as admin
curl -X POST http://localhost:3000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dairy.local",
    "password": "Admin@123"
  }'

# Response includes accessToken - use this for subsequent requests

# 2. Get dashboard statistics
curl -X GET http://localhost:3000/admin/data/dashboard \
  -H "Authorization: Bearer <accessToken>"

# 3. Logout
curl -X POST http://localhost:3000/admin/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "refreshToken": "<refreshToken>"
  }'
```

### Example 2: View All Users with Pagination
```bash
# Get first 10 users
curl -X GET "http://localhost:3000/admin/data/users?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>"

# Get next page
curl -X GET "http://localhost:3000/admin/data/users?page=2&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

## Database Schema Updates

### User Role Enum
Added `ADMIN` role to `UserRole` enum:
```sql
ALTER TABLE `users` MODIFY `role` ENUM('ADMIN', 'OWNER', 'STAFF') NOT NULL DEFAULT 'OWNER';
```

## File Structure

```
src/modules/admin/
├── auth/
│   ├── controllers/admin-auth.controller.ts
│   ├── services/admin-auth.service.ts
│   ├── validators/admin-auth.validator.ts
│   └── routes/admin-auth.routes.ts
├── data/
│   ├── controllers/admin-data.controller.ts
│   ├── services/admin-data.service.ts
│   └── routes/admin-data.routes.ts
├── api-logs/
│   └── [existing api logs routes]
└── index.ts (main router setup)

src/common/middleware/
└── admin-guard.ts (admin role verification)
```

## Next Steps

To enhance the admin panel further, consider:
1. Add user management endpoints (create/edit/delete users)
2. Add customer management endpoints (create/edit/delete)
3. Create Postman collection for admin endpoints
4. Implement admin activity logging
5. Add report generation endpoints
6. Implement soft delete recovery for deleted records
7. Add filtering and searching capabilities to data endpoints

## Running Migrations and Seeds

```bash
# Run migrations
npm run db:deploy

# Run seeds (creates admin user)
npm run db:seed

# Or in one command
npm run db:deploy && npm run db:seed
```

## Testing The Admin Panel

1. Start the backend server: `npm start`
2. Ensure database migrations are applied: `npm run db:deploy`
3. Seed the database with admin user: `npm run db:seed`
4. Use Postman or curl to test endpoints (examples above)
5. Check [ADMIN_PANEL_API.md](./ADMIN_PANEL_API.md) for full API reference

---

**Created**: April 7, 2026
**Last Updated**: April 7, 2026
