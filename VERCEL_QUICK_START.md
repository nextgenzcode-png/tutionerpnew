# 🚀 Tutionerpnew - Vercel Deployment Quick Start

## Quick Summary

Your project is a **full-stack Tuition ERP System** with:
- ✅ React Frontend (Vite) → Runs on `/` path
- ✅ Express Backend → Runs on `/api/*` routes  
- ✅ MySQL Database → Needs configuration

---

## 📝 5-Minute Setup for Vercel

### **1. Update Local .env Files**

**Server** (`tution/server/.env`):
```bash
PORT=3000
DB_HOST=your-db-host.com
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=tuition_erp
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
```

**Client** (`tution/client/.env`):
```bash
VITE_API_BASE=/api
```

### **2. Commit & Push to GitHub**

```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

### **3. Connect Vercel**

1. Open [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select project: **tutionerpnew**
4. Click **Import**

### **4. Configure in Vercel Dashboard**

**Project Settings:**
- Framework: Leave blank (auto-detect)
- Root Directory: `/`
- Build Command: `npm --prefix tution/client run build`
- Output Directory: `tution/client/dist`

**Environment Variables (Add These):**

```
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USER=your-db-username
DB_PASSWORD=your-secure-password
DB_NAME=tuition_erp_prod
JWT_SECRET=super-secure-key-min-32-characters
ADMIN_EMAIL=admin@tutionerpnew.com
ADMIN_PASSWORD=YourSecurePassword123
NODE_ENV=production
VITE_API_BASE=/api
```

### **5. Deploy**

Click **Deploy** button and wait!

✅ **Deployment takes 3-5 minutes**

---

## ✅ After Deployment

### **Test Your App**
```bash
# Test frontend loads
https://your-app.vercel.app

# Test API is working
https://your-app.vercel.app/api/health

# Test login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tutionerpnew.com",
    "password": "YourPassword"
  }'
```

### **Set Custom Domain** (Optional)
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records (instructions provided)

---

## 🗄️ Database Setup Guide

### **Option 1: PlanetScale (Easiest - Free tier)**
1. Sign up at [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string
4. Copy `DB_HOST`, `DB_USER`, `DB_PASSWORD` to Vercel

### **Option 2: AWS RDS**
1. Create MySQL database
2. Get endpoint, username, password
3. Allow Vercel IPs in security group
4. Add to Vercel environment variables

### **Option 3: Local/Existing Database**
1. Ensure it's accessible from Vercel
2. Add Vercel IPs to firewall
3. Update environment variables

---

## 🔑 Security Notes

⚠️ **Never commit these files:**
- `.env` (actual credentials)
- `node_modules/`
- Build outputs

✅ **Only commit:**
- `.env.example` (template)
- Source code
- Configuration

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm install` locally first |
| API 404s | Check `VITE_API_BASE` env var |
| Database connection error | Verify `DB_HOST`, credentials, firewall |
| CORS errors | Add `FRONTEND_URL` to env vars |
| Static files missing | Check `dist/` folder exists |

---

## 📊 Project Structure

```
tutionerpnew/
├── tution/
│   ├── client/           (React/Vite)
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.js
│   └── server/           (Express)
│       ├── routes/
│       ├── server.js
│       ├── package.json
│       └── config/
├── package.json          (Root - NEW)
├── vercel.json           (Config - NEW)
└── DEPLOYMENT.md         (Full guide - NEW)
```

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **React/Vite**: https://vitejs.dev
- **Express**: https://expressjs.com
- **PlanetScale**: https://planetscale.com/docs

---

## ✨ Next Steps After Deployment

1. ✅ Test all features
2. ✅ Set up custom domain
3. ✅ Configure monitoring
4. ✅ Set up CI/CD pipeline
5. ✅ Regular backups
6. ✅ Performance optimization
7. ✅ Security hardening

**You're all set! 🎉**
