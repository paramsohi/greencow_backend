# Admin Panel Quick Start Guide

## What Was Created

✅ **Admin Role** - Added `ADMIN` enum to UserRole in database schema
✅ **Admin Auth System** - Login/logout endpoints for admin users
✅ **Admin Guard Middleware** - Role-based access control middleware
✅ **Admin Data Endpoints** - View all system data (users, customers, sales, payments, expenses)
✅ **Dashboard Statistics** - System-wide analytics endpoint
✅ **Admin User Seed** - Pre-configured admin user in database initialization

## Quick Start

### 1. Run Database Migrations
```bash
cd /Users/paramjit/projects/backendcow
npm run db:deploy
```

### 2. Seed Database with Admin User
```bash
npm run db:seed
```

This creates:
- **Admin User**
  - Email: `admin@dairy.local`
  - Password: `Admin@123`
  - Role: ADMIN

### 3. Start Backend Server
```bash
npm start
```

Server runs on: `http://localhost:3000`

---

## Admin API Endpoints

### Authentication

**Login**
```bash
POST /admin/auth/login
Content-Type: application/json

{
  "email": "admin@dairy.local",
  "password": "Admin@123"
}
```

**Logout**
```bash
POST /admin/auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "{refreshToken}"
}
```

### Data Access (All require Authorization header + ADMIN role)

**Dashboard Stats**
```bash
GET /admin/data/dashboard
Authorization: Bearer {accessToken}
```

**All Users**
```bash
GET /admin/data/users?page=1&limit=20
Authorization: Bearer {accessToken}
```

**All Customers**
```bash
GET /admin/data/customers?page=1&limit=20
Authorization: Bearer {accessToken}
```

**All Sales**
```bash
GET /admin/data/sales?page=1&limit=20
Authorization: Bearer {accessToken}
```

**All Payments**
```bash
GET /admin/data/payments?page=1&limit=20
Authorization: Bearer {accessToken}
```

**All Expenses**
```bash
GET /admin/data/expenses?page=1&limit=20
Authorization: Bearer {accessToken}
```

---

## Testing with Postman

1. **Create new request** - POST to `http://localhost:3000/admin/auth/login`
2. **Login** - Use email `admin@dairy.local` and password `Admin@123`
3. **Copy accessToken** - From response
4. **Add Authorization** - On next requests:
   - Click Authorization tab
   - Type: Bearer Token
   - Token: Paste the accessToken
5. **Test endpoints** - Start with `/admin/data/dashboard`

---

## Files Created/Modified

```
✨ NEW:
src/modules/admin/
├── auth/
│   ├── controllers/admin-auth.controller.ts
│   ├── routes/admin-auth.routes.ts
│   ├── services/admin-auth.service.ts
│   └── validators/admin-auth.validator.ts
├── data/
│   ├── controllers/admin-data.controller.ts
│   ├── routes/admin-data.routes.ts
│   └── services/admin-data.service.ts
└── [index files for each module]

src/common/middleware/
├── admin-guard.ts (NEW)

prisma/
├── schema.prisma (MODIFIED - added ADMIN role)
├── migrations/20260407_add_admin_role/ (NEW)

ADMIN_PANEL.md (NEW - Comprehensive documentation)

🔧 MODIFIED:
seed.ts (Added admin user seeding)
src/modules/admin/index.ts (Updated routes)
```

---

## Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (ADMIN only)
- ✅ Password hashing with bcrypt
- ✅ Refresh token management
- ✅ Admin guard middleware checks every protected route

---

## Next Steps (Optional Enhancements)

1. **User Management** - Add endpoints to create/edit/delete users from admin panel
2. **Soft Deletes** - Add endpoints to recover deleted records
3. **Search & Filter** - Add filtering to data endpoints
4. **Reports** - Generate PDF/Excel reports of system data
5. **Admin Activity Log** - Track all admin actions
6. **Two-Factor Auth** - Additional security layer for admin login
7. **Admin Dashboard UI** - Vue/React component library to display data

---

## Troubleshooting

**Issue**: "Cannot find module" errors after pull
**Solution**: Run `npm install && npx prisma generate`

**Issue**: Invalid credentials on admin login
**Solution**: Check seed was run with `npm run db:seed`

**Issue**: 403 Forbidden on data endpoints
**Solution**: Verify you're using an ADMIN role account and included Authorization header

---

## File Structure Hierarchy

```
Backend Routes:
  /api/               (App API - users, customers, sales, etc.)
  /admin/
    /auth/
      /login          - Admin authentication
      /logout         - Admin logout
    /data/
      /dashboard      - System analytics
      /users          - All users list
      /customers      - All customers list
      /sales          - All sales entries
      /payments       - All payment records
      /expenses       - All expense records
    /api-logs/        - API activity logging (existing)
```

---

**Status**: ✅ Complete and Ready to Deploy
**Last Updated**: April 7, 2026
**Created By**: Admin Panel Setup
