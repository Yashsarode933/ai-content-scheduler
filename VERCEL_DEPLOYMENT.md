# Vercel Deployment Guide - Step by Step

This guide will walk you through deploying your AI Content Scheduler to Vercel.

---

## 🚀 Quick Deployment (5 minutes)

### Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AI Content Scheduler"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click **"New repository"**
   - Name it: `ai-content-scheduler` (or your choice)
   - Don't initialize with README (you already have one)
   - Click **"Create repository"**

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-content-scheduler.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

---

### Step 2: Deploy to Vercel

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub (recommended) or email

2. **Import Project**:
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select your `ai-content-scheduler` repository
   - Click **"Import"**

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - Click **"Deploy"**

4. **Wait for Build**:
   - Vercel will install dependencies and build your app
   - This takes 2-3 minutes
   - You'll see build logs in real-time

---

### Step 3: Add Environment Variables

**⚠️ IMPORTANT**: Do this BEFORE the first deployment completes!

1. **In Vercel Dashboard**:
   - While the build is running, click on your project
   - Go to **"Settings"** → **"Environment Variables"**

2. **Add These Variables**:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project.supabase.co
   Environment: Production, Preview, Development
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: your-anon-key-here
   Environment: Production, Preview, Development
   ```

   ```
   Name: GEMINI_API_KEY
   Value: your-gemini-api-key-here
   Environment: Production, Preview, Development
   ```

   ```
   Name: NEXT_PUBLIC_GEMINI_API_KEY
   Value: your-gemini-api-key-here
   Environment: Production, Preview, Development
   ```

   ```
   Name: NEXT_PUBLIC_APP_URL
   Value: https://your-app-name.vercel.app
   Environment: Production, Preview, Development
   ```

   ```
   Name: CRON_SECRET
   Value: your-random-secret-string-here
   Environment: Production
   ```

3. **For Each Variable**:
   - Click **"Add"** after entering name and value
   - Select all environments (Production, Preview, Development)
   - Click **"Save"**

4. **Redeploy** (if build already completed):
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on latest deployment
   - Click **"Redeploy"**

---

### Step 4: Update Supabase Settings

1. **Update Redirect URLs**:
   - Go to Supabase Dashboard → **Authentication** → **URL Configuration**
   - Add to **Redirect URLs**:
     - `https://your-app-name.vercel.app/dashboard`
     - `https://your-app-name.vercel.app/auth/callback`
   - Click **"Save"**

2. **Update Site URL**:
   - In same section, set **Site URL** to:
     - `https://your-app-name.vercel.app`

---

### Step 5: Verify Deployment

1. **Visit Your App**:
   - Go to `https://your-app-name.vercel.app`
   - You should see your landing page!

2. **Test Authentication**:
   - Click **"Sign Up"**
   - Create an account
   - You should be redirected to dashboard

3. **Test Features**:
   - Create a project
   - Generate AI posts
   - Connect Discord
   - Schedule a post

---

## 🔧 Post-Deployment Checklist

- [ ] Environment variables added to Vercel
- [ ] Supabase redirect URLs updated
- [ ] App loads without errors
- [ ] Authentication works
- [ ] Can create projects
- [ ] AI generation works
- [ ] Discord connection works
- [ ] Can schedule posts

---

## 🐛 Troubleshooting

### "Build Failed"
- Check build logs in Vercel dashboard
- Common issues:
  - Missing environment variables
  - TypeScript errors
  - Missing dependencies

### "Environment variables not working"
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding variables
- Check variable names are exact (case-sensitive)

### "Authentication not working"
- Verify Supabase redirect URLs are set correctly
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Make sure you're using HTTPS URLs

### "API routes returning 500"
- Check server logs in Vercel dashboard
- Verify all environment variables are set
- Check Supabase connection

### "Cron job not working"
- Verify `CRON_SECRET` is set in Production environment
- Check Vercel cron configuration in `vercel.json`
- View cron logs in Vercel dashboard

---

## 📊 Monitoring

1. **View Logs**:
   - Vercel Dashboard → Your Project → **"Logs"** tab
   - See real-time logs and errors

2. **Analytics**:
   - Vercel Dashboard → **"Analytics"** tab
   - View page views, performance metrics

3. **Deployments**:
   - Every push to `main` branch auto-deploys
   - View deployment history and rollback if needed

---

## 🔄 Continuous Deployment

Once set up, every time you:
1. Push to `main` branch on GitHub
2. Vercel automatically:
   - Detects the push
   - Builds your app
   - Deploys to production

**No manual steps needed!** 🎉

---

## 🎯 Next Steps

1. **Custom Domain** (Optional):
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Follow DNS setup instructions

2. **Enable Analytics**:
   - Vercel Dashboard → Analytics
   - Enable Web Analytics (free tier available)

3. **Set Up Monitoring**:
   - Add error tracking (Sentry, etc.)
   - Set up uptime monitoring

---

## ✅ You're Live!

Your app is now deployed and accessible worldwide at:
`https://your-app-name.vercel.app`

Share it with the world! 🚀

---

## 📝 Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard
**Your App URL**: `https://your-app-name.vercel.app`
**GitHub Repo**: `https://github.com/YOUR_USERNAME/ai-content-scheduler`

---

**Need Help?** Check Vercel docs: https://vercel.com/docs

