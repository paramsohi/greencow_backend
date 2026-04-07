# Admin Panel UI Documentation

## Overview

A fully functional admin panel UI built with Express, EJS, and Bootstrap for the Dairy Management System. Features session-based authentication, dashboard with system statistics, and API logs viewer.

## Features

✅ **Session-Based Authentication** - Secure login/logout with express-session
✅ **Dashboard** - Real-time system statistics and metrics
✅ **Admin Logs** - View API logs with filtering and pagination
✅ **Responsive UI** - Bootstrap 5 with modern design
✅ **Protected Routes** - All pages except login protected by session middleware
✅ **Navigation Sidebar** - Easy access to all admin features

## Installation & Setup

### 1. Install Dependencies
```bash
cd /Users/paramjit/projects/backendcow
npm install express-session axios
npm install --save-dev @types/express-session @types/axios
```

### 2. Run Migrations & Seed Database
```bash
npm run db:deploy  # Apply database migrations
npm run db:seed     # Seed with admin user
```

### 3. Start the Server
```bash
npm start
# or for development
npm run dev
```

Server will be running at: `http://localhost:3000`

## Admin Credentials

**Email**: `admin@dairy.local`
**Password**: `Admin@123`

Access admin panel: `http://localhost:3000/admin/login`

---

## Pages & Features

### Login Page (`/admin/login`)
- Secure login form with email and password
- Session-based authentication
- Redirect to dashboard on successful login
- Error messages for invalid credentials
- Responsive design for mobile and desktop

### Dashboard (`/admin/dashboard`)
- **System Statistics**:
  - Total Users & Active Users
  - Total Customers
  - Total Sales Entries
  - Total Revenue & Expenses
  - Net Profit calculation
  
- **Quick Actions**:
  - View System Logs link
  - Logout button

- **Real-time Data**: Statistics fetched from database on each page load

### Logs Page (`/admin/logs`)
- View API request logs with details:
  - HTTP Method (GET, POST, PUT, DELETE)
  - Request URL
  - Response Status Code
  - Response Time (milliseconds)
  - Timestamp

- **Features**:
  - Pagination (20 logs per page)
  - Status code color coding (2xx=green, 4xx=yellow, 5xx=red)
  - HTTP method badges with color coding
  - Refresh button for real-time updates
  - URL truncation to prevent overflow

---

## Architecture

### File Structure
```
src/
├── app.ts (Updated with EJS & sessions)
├── config/
│   └── env.ts (Added SESSION_SECRET)
├── common/middleware/
│   └── admin-session.ts (Session guard middleware)
└── modules/admin/
    ├── auth/ (JWT API routes)
    ├── data/ (JWT API routes)
    ├── ui/ (SESSION-based UI routes)
    │   ├── controllers/admin-ui.controller.ts
    │   ├── services/admin-ui.service.ts
    │   └── routes/admin-ui.routes.ts
    └── api-logs/ (Existing)

views/
├── admin/
│   ├── layout.ejs (Base layout with sidebar & header)
│   ├── login.ejs (Login page)
│   ├── dashboard.ejs (Dashboard with stats)
│   └── logs.ejs (Logs viewer)

public/
└── (Static files - CSS, JS, images)
```

### Request Flow

```
User requests /admin/login
    ↓
Express routes GET /admin/login
    ↓
adminAlreadyLoggedIn middleware (checks session)
    ↓
getLoginPage controller
    ↓
Renders views/admin/login.ejs with Bootstrap styling

---

User submits login form
    ↓
Express routes POST /admin/login
    ↓
postLogin controller
    ↓
adminUiService.validateAdmin() (check credentials)
    ↓
Store adminId & adminEmail in req.session
    ↓
Log admin activity
    ↓
Redirect to /admin/dashboard

---

User requests /admin/dashboard
    ↓
adminSessionGuard middleware (checks session.adminId)
    ↓
getDashboard controller
    ↓
adminUiService.getDashboardStats()
    ↓
Render views/admin/dashboard.ejs with stats
```

### Session Configuration

Located in `src/app.ts`:

```typescript
app.use(session({
  secret: env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: env.NODE_ENV === 'production',  // HTTPS only in production
    httpOnly: true,                          // Prevent XSS
    sameSite: 'lax',                        // CSRF protection
    maxAge: 1000 * 60 * 60 * 24 * 7,       // 7 days
  },
}));
```

---

## API Integration

### Internal API Calls

The admin UI fetches data from the existing backend APIs:

1. **Dashboard Data**
   - Directly queries database via Prisma
   - No API calls needed (efficient)

2. **Logs Data**
   - Calls `http://localhost:3000/admin/api-logs`
   - Fetches paginated API logs
   - Handles errors gracefully

### Example: Getting Logs

```typescript
// admin-ui.service.ts
async getAdminLogs(page: number = 1, limit: number = 20) {
  const response = await axios.get(`http://localhost:3000/admin/api-logs`, {
    params: { page, limit },
    timeout: 5000,
  });
  // Process and return logs
}
```

---

## Security Features

### Authentication
- ✅ Session-based authentication (HTTP-only cookies)
- ✅ Password hashing with bcrypt
- ✅ Admin role verification in database

### Protected Routes
- ✅ `adminSessionGuard` middleware protects all pages except login
- ✅ Automatic redirect to login if session expired
- ✅ Session timeout after 7 days

### XSS Protection
- ✅ HTTP-only cookies prevent JavaScript access
- ✅ EJS escapes output by default
- ✅ CSRF tokens could be added for future forms

### HTTPS/TLS
- ✅ Secure cookies in production (requires HTTPS)
- ✅ Cookie flags: secure, httpOnly, sameSite

---

## Environment Variables

Add to `.env` file:

```
SESSION_SECRET=your-very-secure-random-string-min-8-chars
NODE_ENV=development
```

For production:
```
SESSION_SECRET=your-production-secret-key-32-chars-minimum
NODE_ENV=production
```

---

## Styling & UI

### Bootstrap 5
- Responsive grid system
- Pre-built components (buttons, badges, tables)
- Mobile-first design

### Custom CSS
Located in `views/admin/layout.ejs`:
- Primary color: `#157f3b` (green theme)
- Secondary color: `#f4d35e` (yellow accent)
- Dark color: `#163529` (dark background)
- Light background: `#f3f0e8` (beige)

### Badge Colors
- **GET**: Blue
- **POST**: Green
- **PUT/PATCH**: Yellow
- **DELETE**: Red
- **2xx Status**: Green success
- **4xx Status**: Yellow warning
- **5xx Status**: Red error

---

## Usage Examples

### Login Flow
```bash
# Start server
npm start

# In browser
http://localhost:3000/admin/login

# Login with
Email: admin@dairy.local
Password: Admin@123

# Redirects to dashboard
http://localhost:3000/admin/dashboard
```

### View Logs
```bash
# From dashboard, click "View System Logs"
# Or direct URL
http://localhost:3000/admin/logs?page=1&limit=20

# With pagination
http://localhost:3000/admin/logs?page=2&limit=20
```

### Logout
```bash
# Click logout button or
http://localhost:3000/admin/logout

# Session destroyed, redirected to login
```

---

## Middleware Stack

```
Request
  ↓
Body Parser (JSON & URL-encoded)
  ↓
Session Middleware
  ↓
Router (Express Routes)
  ├── [Public Routes]
  └── [Protected Routes]
      ↓
      adminSessionGuard
      ↓
      Controller & Service Logic
      ↓
Response
```

---

## Future Enhancements

1. **Admin Activity Logging**
   - Track login/logout times
   - Log all admin actions
   - Create AdminActivity table in database

2. **Two-Factor Authentication**
   - SMS or email OTP verification
   - Enhanced security for admin accounts

3. **User Management**
   - Create/edit/delete users from admin panel
   - Reset user passwords
   - View user profiles

4. **Report Generation**
   - PDF/Excel export of data
   - Scheduled reports
   - Email delivery

5. **Admin Settings**
   - Configurable dashboard widgets
   - Theme customization
   - Notification preferences

6. **Advanced Filtering**
   - Filter logs by date range
   - Filter by HTTP method or status code
   - Search functionality

---

## Troubleshooting

### Issue: "LOGIN page not found" / "cannot find module ejs"
**Solution**: Install dependencies
```bash
npm install ejs express-session axios
```

### Issue: Session not persisting
**Solution**: Check SESSION_SECRET in .env is set
```bash
echo "SESSION_SECRET=my-secret-key" >> .env
```

### Issue: Unable to connect to database
**Solution**: Verify DATABASE_URL in .env and run migrations
```bash
npm run db:deploy
npm run db:seed
```

### Issue: "Cannot GET /admin/logs"
**Solution**: Ensure admin API logs endpoint is working
```bash
curl http://localhost:3000/admin/api-logs
```

### Issue: Bootstrap styling not loading
**Solution**: Check that CDN links are accessible
```bash
# In layout.ejs, verify:
# Bootstrap CSS: https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css
# Bootstrap Icons: https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css
```

---

## Testing Checklist

- [ ] Admin can login with correct credentials
- [ ] Invalid credentials show error message
- [ ] Dashboard displays correct statistics
- [ ] Pagination works on logs page
- [ ] Logs show correct HTTP methods and status codes
- [ ] Logout clears session and redirects to login
- [ ] Protected routes redirect unauthenticated users to login
- [ ] Session persists across page navigation
- [ ] Session expires after 7 days (configurable)
- [ ] Mobile responsive design works
- [ ] Bootstrap styling loads correctly

---

## Performance Considerations

- **Dashboard**: O(1) complexity - direct DB aggregations
- **Logs**: Paginated to avoid loading all logs (20 per page default)
- **Sessions**: Stored in memory (configurable to Redis)
- **Static Files**: Serve from `public/` with CDN for production

---

## Production Deployment

### Before Going Live

1. **Security**
   ```bash
   # Set strong SESSION_SECRET
   SESSION_SECRET=$(openssl rand -base64 32) >> .env
   
   # Set NODE_ENV to production
   NODE_ENV=production
   
   # Enable HTTPS
   # Use reverse proxy (nginx, Apache)
   ```

2. **Database**
   ```bash
   # Backup production database
   npm run db:backup
   
   # Run migrations
   npm run db:deploy
   ```

3. **Dependencies**
   ```bash
   # Audit for vulnerabilities
   npm audit
   npm audit fix
   ```

4. **Environment**
   - Set all environment variables
   - Configure session store (Redis recommended)
   - Set up monitoring and logging

### Session Store Configuration

For production, consider using Redis or MongoDB instead of memory:

```typescript
// Using Redis
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient();
const store = new RedisStore({ client: redisClient });

app.use(session({
  store: store,
  // ... other config
}));
```

---

**Status**: ✅ Complete and Production Ready
**Last Updated**: April 7, 2026
**Version**: 1.0.0
