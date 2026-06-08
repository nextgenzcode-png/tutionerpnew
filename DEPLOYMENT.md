# Vercel Deployment Guide - Tutionerpnew

## 📋 Pre-Deployment Checklist

- [ ] Push all changes to GitHub
- [ ] Set up environment variables in Vercel
- [ ] Configure database connection
- [ ] Test locally with production settings
- [ ] Verify all API endpoints
- [ ] Check CORS configuration

---

## 🚀 Step-by-Step Deployment

### **Step 1: Push Code to GitHub**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### **Step 2: Connect to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Select **Import Git Repository**
4. Choose: `nextgenzcode-png/tutionerpnew`
5. Click **Import**

### **Step 3: Configure Project Settings**

**Framework Preset:** Other (or Vite)  
**Root Directory:** `/` (default)  
**Build Command:** `npm --prefix tution/client run build`  
**Output Directory:** `tution/client/dist`  
**Install Command:** `npm install`  

### **Step 4: Set Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

#### **Production Environment:**
```
PORT=3000
DB_HOST=your-production-database-host
DB_PORT=3306
DB_USER=your-db-username
DB_PASSWORD=your-secure-password
DB_NAME=tuition_erp_prod
JWT_SECRET=your-secure-jwt-secret-key-here
ADMIN_EMAIL=admin@tutionerpnew.com
ADMIN_PASSWORD=secure-password-here
NODE_ENV=production
VITE_API_BASE=https://your-domain.vercel.app/api
```

#### **Preview/Staging Environment:**
```
NODE_ENV=preview
DB_HOST=your-staging-database-host
DB_NAME=tuition_erp_preview
VITE_API_BASE=https://your-project-staging.vercel.app/api
```

### **Step 5: Database Setup**

Before first deployment, ensure your database is set up:

```bash
# Local database test
node tution/server/config/db.js

# Or connect to your remote database
# Update DB_HOST, DB_USER, DB_PASSWORD in .env
```

**Option A: Use a managed database (Recommended)**
- Planetscale (MySQL-compatible)
- AWS RDS
- DigitalOcean Managed Database
- AWS Aurora Serverless

**Option B: Keep existing database**
- Ensure it's accessible from Vercel's IP
- Add Vercel IPs to firewall whitelist

---

## ⚙️ Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `3000` |
| `DB_HOST` | Database host | `db.example.com` |
| `DB_PORT` | Database port | `3306` |
| `DB_USER` | Database user | `admin` |
| `DB_PASSWORD` | Database password | `secure-pwd` |
| `DB_NAME` | Database name | `tuition_erp_prod` |
| `JWT_SECRET` | JWT signing key | `your-secret-key` |
| `ADMIN_EMAIL` | Admin email | `admin@app.com` |
| `ADMIN_PASSWORD` | Admin password | `secure-pwd` |
| `NODE_ENV` | Environment | `production` |
| `VITE_API_BASE` | Frontend API URL | `https://app.vercel.app/api` |

---

## 🔧 Post-Deployment Steps

### **1. Verify Deployment**
- Visit your Vercel project URL
- Check that frontend loads
- Test API endpoints:
  ```bash
  curl https://your-domain.vercel.app/api/health
  ```

### **2. Test Authentication**
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tutionerpnew.com","password":"password"}'
```

### **3. Monitor Deployment**
- Vercel Dashboard → Deployments → View logs
- Check for errors in the build and runtime logs
- Monitor analytics and performance

### **4. Set Custom Domain**
1. Go to Vercel Project Settings
2. Domains → Add Domain
3. Update DNS records
4. Wait for SSL certificate (auto-generated)

---

## 🐛 Troubleshooting

### **Build Fails: "Cannot find module"**
```bash
# Ensure dependencies are installed
npm --prefix tution/server install
npm --prefix tution/client install
```

### **API Calls Return 404**
- Check `VITE_API_BASE` environment variable
- Verify routes in `tution/server/routes/`
- Check CORS configuration in `server.js`

### **Database Connection Error**
```bash
# Test connection locally
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -D $DB_NAME

# Check firewall rules allow Vercel IPs
# Vercel IPs: https://vercel.com/docs/concepts/edge-network/regions
```

### **Static Files Not Loading**
- Ensure `tution/client/dist` exists after build
- Check public folder paths
- Verify Vite configuration

### **CORS Errors**
Update `tution/server/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

Add to Vercel environment variables:
```
FRONTEND_URL=https://your-domain.vercel.app
```

---

## 📊 Deployment Architecture

```
GitHub (tutionerpnew)
    ↓
Vercel (Automatic deployment on push)
    ├── Frontend (React/Vite) → CDN
    ├── API Routes → Serverless Functions
    └── Database (MySQL/Remote)
```

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files with secrets
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Restrict database access by IP
- [ ] Use environment variables for all secrets
- [ ] Enable API authentication/rate limiting
- [ ] Regular security updates for dependencies
- [ ] Monitor logs for suspicious activity

---

## 📞 Next Steps

1. **Connect GitHub to Vercel** (if not done)
2. **Configure environment variables**
3. **Set up database access**
4. **Click Deploy button**
5. **Monitor deployment logs**
6. **Test all features**
7. **Set up custom domain** (optional)

---

## 🚨 Important Notes

- **First deployment may take 5-10 minutes**
- **Database initialization happens on first run**
- **Admin credentials should be changed after first login**
- **Keep production database separate from development**
- **Monitor Vercel costs** (serverless functions are metered)

---

For more help: [Vercel Docs](https://vercel.com/docs)
