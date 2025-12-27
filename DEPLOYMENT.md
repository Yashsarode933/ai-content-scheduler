# Deployment Guide

## Vercel Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   GEMINI_API_KEY=your-gemini-key
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   CRON_SECRET=your-random-secret-string
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

## Supabase Setup

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for database to initialize

2. **Run Migrations**
   - Go to SQL Editor
   - Copy contents of `sql/migrations/001_initial_schema.sql`
   - Paste and run

3. **Enable Realtime**
   - Go to Database → Replication
   - Enable replication for `posts` and `collaborators` tables

4. **Configure Auth**
   - Go to Authentication → Providers
   - Enable Email provider
   - Enable Google OAuth (optional)
   - Add redirect URL: `https://your-app.vercel.app/dashboard`

5. **Deploy Edge Functions**

   **Option A: Using Scoop (Recommended for Windows)**
   ```powershell
   # Install Scoop if you don't have it
   # Run in PowerShell: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   # Then: irm get.scoop.sh | iex
   
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

   **Option B: Using npx (No installation needed)**
   ```bash
   npx supabase login
   npx supabase link --project-ref your-project-ref
   npx supabase functions deploy schedule-posts
   ```

   **Option C: Direct Download (Windows)**
   - Download from [Supabase CLI Releases](https://github.com/supabase/cli/releases)
   - Extract and add to PATH, or use directly

   After installation, deploy:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   supabase functions deploy schedule-posts
   ```

## Vercel Cron Job

The cron job is configured in `vercel.json` to run every 5 minutes. It will:
- Check for scheduled posts
- Publish them to platforms
- Update post status

Make sure `CRON_SECRET` is set in Vercel environment variables.

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database migrations run in Supabase
- [ ] Realtime enabled for posts and collaborators
- [ ] Auth providers configured
- [ ] Edge Functions deployed
- [ ] Cron job secret set
- [ ] Test authentication flow
- [ ] Test post creation
- [ ] Test AI generation
- [ ] Test calendar scheduling

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check for TypeScript errors: `npm run type-check`

### Database Errors
- Verify RLS policies are correct
- Check Supabase connection string
- Ensure migrations ran successfully

### AI Generation Not Working
- Verify Gemini API key is set
- Check API quota limits
- Review browser console for errors

### Realtime Not Working
- Verify Realtime is enabled in Supabase
- Check network tab for WebSocket connections
- Ensure user is authenticated

### Supabase CLI Installation Issues
- **Windows**: Don't use `npm install -g supabase` (not supported)
- Use Scoop: `scoop install supabase` (after adding bucket)
- Or use npx: `npx supabase` (no installation needed)
- Or download directly from GitHub releases
- See: https://github.com/supabase/cli#install-the-cli

