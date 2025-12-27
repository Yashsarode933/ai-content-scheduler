# Environment Variables Setup Guide

This guide explains how to find each environment variable needed for the AI Content Scheduler.

## Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
NEXT_PUBLIC_GEMINI_API_KEY=...
NEXT_PUBLIC_APP_URL=...
```

---

## 1. Supabase URL and Anon Key

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign in"**
3. Create a new account or sign in
4. Click **"New Project"**
5. Fill in:
   - **Name**: Your project name (e.g., "ai-content-scheduler")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Select **Free** tier
6. Click **"Create new project"**
7. Wait 2-3 minutes for project to initialize

### Step 2: Get Your Credentials

1. In your Supabase dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two values you need:

   **NEXT_PUBLIC_SUPABASE_URL**
   - Found under **"Project URL"**
   - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy this entire URL

   **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Found under **"Project API keys"**
   - Look for the **"anon"** or **"public"** key
   - It's a long string starting with `eyJ...`
   - Click the **eye icon** to reveal it, then copy

### Visual Guide:
```
Supabase Dashboard
  └─ Settings (⚙️)
      └─ API
          ├─ Project URL → NEXT_PUBLIC_SUPABASE_URL
          └─ Project API keys
              └─ anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 2. Gemini API Key

### Step 1: Get Google AI Studio Access

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Or visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. If prompted, accept the terms of service

### Step 2: Create API Key

1. Click **"Create API Key"** button
2. Select or create a Google Cloud project (you can use default)
3. Click **"Create API Key in new project"** or select existing
4. Your API key will be displayed
5. **Copy it immediately** (you won't see it again!)
6. If you lose it, you can create a new one

### Step 3: Use the Same Key Twice

- Use the **same API key** for both:
  - `GEMINI_API_KEY=your-key-here`
  - `NEXT_PUBLIC_GEMINI_API_KEY=your-key-here`

**Note**: The free tier allows 15 requests per minute (RPM).

---

## 3. App URL

### For Local Development:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### For Production (Vercel):
After deploying to Vercel, use your production URL:
```env
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

---

## Complete .env.local File Example

Create a file named `.env.local` in the root of your project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key-here

# Gemini API (use same key for both)
GEMINI_API_KEY=your-gemini-key
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Quick Checklist

- [ ] Created Supabase account and project
- [ ] Copied `NEXT_PUBLIC_SUPABASE_URL` from Settings → API
- [ ] Copied `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon/public key)
- [ ] Created Gemini API key from Google AI Studio
- [ ] Set `GEMINI_API_KEY` and `NEXT_PUBLIC_GEMINI_API_KEY` (same value)
- [ ] Set `NEXT_PUBLIC_APP_URL` to `http://localhost:3000` for local dev

---

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` file exists in the project root
- Check that variable names are exactly as shown (case-sensitive)
- Restart your dev server after adding variables

### "Invalid API key" for Supabase
- Make sure you copied the **anon/public** key, not the service_role key
- Check for extra spaces or line breaks
- The key should start with `eyJ`

### "Gemini API key not found"
- Verify the key starts with `AIza`
- Make sure you set both `GEMINI_API_KEY` and `NEXT_PUBLIC_GEMINI_API_KEY`
- Check that there are no quotes around the values in `.env.local`

### Where is my .env.local file?
- It should be in the root directory (same level as `package.json`)
- The file might be hidden - show hidden files in your file explorer
- Create it if it doesn't exist

---

## Security Notes

⚠️ **Never commit `.env.local` to Git!**
- It's already in `.gitignore`
- These keys are sensitive - keep them private
- For production, set these in Vercel's environment variables dashboard

---

## Next Steps

After setting up your `.env.local`:

1. Run the database migration:
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents of `sql/migrations/001_initial_schema.sql`
   - Paste and run

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Test the app at `http://localhost:3000`

