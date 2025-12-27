# Next Steps - Getting Your App Running

Follow these steps in order to get your AI Content Scheduler fully operational.

## ✅ Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Supabase, Gemini, and UI libraries.

---

## ✅ Step 2: Set Up Supabase

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Sign in
3. Click **"New Project"**
4. Fill in:
   - Name: `ai-content-scheduler` (or your choice)
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Plan: **Free**
5. Wait 2-3 minutes for setup

### 2.2 Get Your Credentials
1. In Supabase dashboard → **Settings** (⚙️) → **API**
2. Copy **Project URL** → This is `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click the eye icon to reveal it

### 2.3 Run Database Migration
1. In Supabase dashboard → **SQL Editor**
2. Click **"New query"**
3. Open `sql/migrations/001_initial_schema.sql` from your project
4. Copy the entire contents
5. Paste into SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### 2.4 Enable Realtime (Optional - for live updates)
1. Go to **Database** → **Replication**
2. Enable replication for:
   - `posts` table
   - `collaborators` table

### 2.5 Configure Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. (Optional) Enable **Google** OAuth:
   - Add your Google OAuth credentials
   - Add redirect URL: `http://localhost:3000/dashboard`

---

## ✅ Step 3: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Or: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the API key immediately (you won't see it again!)

**Note**: Free tier allows 15 requests per minute (RPM)

---

## ✅ Step 4: Create Environment Variables File

1. In your project root, create a file named `.env.local`
2. Add these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Gemini API (use same key for both)
GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: 
- Replace the placeholder values with your actual keys
- No quotes around values
- No spaces around the `=` sign

---

## ✅ Step 5: Start Development Server

```bash
npm run dev
```

You should see:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

---

## ✅ Step 6: Test Your Application

### 6.1 Test Authentication
1. Open http://localhost:3000
2. Click **"Sign Up"**
3. Create an account with email/password
4. Or use Google OAuth (if configured)
5. You should be redirected to `/dashboard`

### 6.2 Test Project Creation
1. In dashboard, click **"New Project"**
2. Enter project name and description
3. Click **"Create Project"**
4. You should see your project in the list

### 6.3 Test Calendar
1. Click on a project
2. You should see the calendar interface
3. Try clicking on a date to create a new post

### 6.4 Test AI Generation
1. In the project view, find the **"AI Tools"** panel
2. Enter a topic (e.g., "AI automation")
3. Select a platform (e.g., Twitter)
4. Click **"Generate Post"**
5. You should see AI-generated content appear

### 6.5 Test Templates
1. In the project view, find the **"Templates"** panel
2. Click on a template (e.g., "Twitter Thread")
3. A new post should be created with template content

### 6.6 Test Analytics
1. Click **"Analytics"** in the sidebar
2. You should see charts with mock data

### 6.7 Test Team Collaboration
1. Click **"Team"** in the sidebar
2. You should see team members and invite link

---

## ✅ Step 7: Verify Everything Works

Checklist:
- [ ] Can sign up/login
- [ ] Can create projects
- [ ] Can view calendar
- [ ] Can generate AI posts
- [ ] Can use templates
- [ ] Can schedule posts
- [ ] Can view analytics
- [ ] Can see team section
- [ ] Dark mode toggle works
- [ ] Mobile navigation works (on mobile/tablet)

---

## 🚀 Step 8: Deploy to Production (Optional)

### 8.1 Deploy Frontend to Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (same as `.env.local`)
5. Deploy!

### 8.2 Deploy Edge Functions (Optional)
```bash
# Using npx (no installation needed)
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase functions deploy schedule-posts
```

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists in project root
- Verify variable names are exact (case-sensitive)
- Restart dev server: `npm run dev`

### "Invalid API key" errors
- Check you copied the full key (no truncation)
- Verify no extra spaces or quotes
- For Supabase: Make sure it's the **anon** key, not service_role

### Database errors
- Verify migration ran successfully in Supabase SQL Editor
- Check RLS policies are enabled
- Ensure tables exist: `projects`, `posts`, `templates`, `collaborators`, `post_analytics`

### AI generation not working
- Check Gemini API key is valid
- Verify you haven't exceeded 15 RPM limit
- Check browser console for errors
- App will use mock responses if API key is missing

### Authentication not working
- Verify Supabase URL and anon key are correct
- Check email provider is enabled in Supabase
- For Google OAuth: Verify redirect URLs match

### Calendar not showing
- Ensure `moment` package is installed: `npm install moment`
- Check browser console for errors
- Try refreshing the page

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Deployment**: https://vercel.com/docs

---

## 🎉 You're Done!

Once all steps are complete, you have a fully functional AI Content Scheduler!

**Next Enhancements** (optional):
- Connect real social media APIs
- Add email notifications
- Implement push notifications
- Add more analytics metrics
- Create admin dashboard
- Add content export features

---

**Need Help?** Check the troubleshooting section or review the error messages in your browser console.

