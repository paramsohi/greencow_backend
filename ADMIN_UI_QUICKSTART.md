# Admin UI Panel - Quick Start

## 🚀 Get Started in 3 Minutes

### Step 1: Setup
```bash
cd /Users/paramjit/projects/backendcow

# Install dependencies (one-time setup)
npm install express-session axios
npm install --save-dev @types/express-session @types/axios

# Build project
npm run build
```

### Step 2: Database Setup
```bash
# Apply migrations
npm run db:deploy

# Seed admin user
npm run db:seed
```

### Step 3: Start Server
```bash
npm start
```

Server running at: `http://localhost:3000`

---

## 📝 Login to Admin Panel

### URL
```
http://localhost:3000/admin/login
```

### Credentials
```
Email:    admin@dairy.local
Password: Admin@123
```

---

## 📊 Admin Panel Pages

### Dashboard
- **URL**: `/admin/dashboard`
- Shows system statistics:
  - Total Users & Active Users
  - Total Customers
  - Total Sales
  - Total Revenue
  - Total Expenses
  - Net Profit

### Logs
- **URL**: `/admin/logs`
- View API request logs:
  - HTTP method (GET, POST, PUT, DELETE)
  - Request URL
  - Response status
  - Response time
  - Timestamp
- **Features**: Pagination, status code color coding, refresh button

### Logout
- **URL**: `/admin/logout`
- Destroys session and redirects to login

---

## 🔐 Security

- ✅ Session-based authentication
- ✅ HTTP-only cookies (prevents XSS)
- ✅ CSRF protection (SameSite cookies)
- ✅ Admin role verification
- ✅ 7-day session expiration
- ✅ Password hashing with bcrypt

---

## 📁 File Structure

```
views/
├── admin/
│   ├── layout.ejs      ← Base layout (header, sidebar)
│   ├── login.ejs       ← Login page
│   ├── dashboard.ejs   ← Dashboard with stats
│   └── logs.ejs        ← Logs viewer

src/modules/admin/
├── ui/
│   ├── controllers/admin-ui.controller.ts
│   ├── services/admin-ui.service.ts
│   └── routes/admin-ui.routes.ts
└── auth/, data/, api-logs/ (JWT API routes)

src/common/middleware/
└── admin-session.ts    ← Session auth middleware
```

---

## 🌐 Routes Overview

| Route | Method | Purpose | Protected |
|-------|--------|---------|-----------|
| `/admin/login` | GET | Login page | No |
| `/admin/login` | POST | Process login | No |
| `/admin/dashboard` | GET | Dashboard | Yes |
| `/admin/logs` | GET | View logs | Yes |
| `/admin/logout` | GET | Logout | Yes |

---

## 🛠️ Testing

### Test Login
```bash
curl -X POST http://localhost:3000/admin/login \
  -d "email=admin@dairy.local&password=Admin@123" \
  -L  # Follow redirects
```

### Test Dashboard Access (with session)
```bash
# Open in browser
http://localhost:3000/admin/dashboard
```

### Test Protected Routes
```bash
# Should redirect to login (no session)
curl http://localhost:3000/admin/dashboard
```

---

## 📱 UI Features

### Bootstrap 5 Responsive Design
- Mobile-friendly sidebar
- Collapsible navigation on small screens
- Responsive grid layout
- Optimized for all device sizes

### Color Scheme
- **Primary Green**: `#157f3b` (buttons, highlights)
- **Secondary Yellow**: `#f4d35e` (accents)
- **Dark**: `#163529` (header, text)
- **Light**: `#f3f0e8` (background)

### Status Code Styling
- **2xx (Green)**: Successful requests
- **4xx (Yellow)**: Client errors
- **5xx (Red)**: Server errors

---

## ⚙️ Environment Variables

### Required
```bash
SESSION_SECRET=your-secret-key
DATABASE_URL=mysql://user:password@localhost/dairy_db
JWT_ACCESS_SECRET=your-jwt-secret-min-16-chars
JWT_REFRESH_SECRET=your-jwt-secret-min-16-chars
NODE_ENV=development
```

### Optional
```bash
PORT=3000                          # Default: 3000
SESSION_MAX_AGE=604800000          # Default: 7 days (ms)
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module 'ejs'" | Run `npm install ejs express-session` |
| Session not saving | Check SESSION_SECRET in `.env` is set |
| Cannot login | Verify admin user exists: `npm run db:seed` |
| CSS not loading | Check Bootstrap CDN is accessible |
| Cannot view logs | Ensure `/admin/api-logs` endpoint exists |
| Page redirects to login | Session expired (7 days) - login again |

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Set strong `SESSION_SECRET` (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Configure HTTPS/SSL
- [ ] Use Redis for session storage
- [ ] Run `npm audit fix` for vulnerabilities
- [ ] Test all routes in production environment
- [ ] Setup monitoring and logging
- [ ] Backup database

---

## 📞 Support

**For issues or questions:**

1. Check `ADMIN_UI_PANEL.md` for detailed documentation
2. Check logs: `tail -f logs/app.log`
3. Verify database connection: `npm run db:deploy`
4. Check environment variables: `cat .env`

---

## 🔗 Related Documentation

- [ADMIN_UI_PANEL.md](./ADMIN_UI_PANEL.md) - Full documentation
- [ADMIN_PANEL.md](./ADMIN_PANEL.md) - JWT API reference
- [ADMIN_QUICKSTART.md](./ADMIN_QUICKSTART.md) - API quick start
- [README.md](./README.md) - Backend overview

---

**Ready to go!** 🎉
1. Run `npm install` (if not done)
2. Run `npm run db:deploy && npm run db:seed`
3. Run `npm start`
4. Visit `http://localhost:3000/admin/login`
5. Login with `admin@dairy.local` / `Admin@123`

Enjoy the admin panel! 🚀
