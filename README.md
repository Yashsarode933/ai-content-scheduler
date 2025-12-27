# AI Content Scheduler

A production-ready, full-stack social media management tool built with Next.js 15, TypeScript, Supabase, and Gemini AI. Schedule posts, generate AI-powered captions, track performance, and collaborate with teams—all on the free tier.

## 🚀 Features

- **AI Post Generation**: Generate viral captions, hashtags, and emojis for 5 platforms using Gemini AI
- **Interactive Calendar**: Drag-and-drop scheduling with react-big-calendar
- **Real Social Media Integration**: Connect and automatically post to Twitter, LinkedIn, Instagram, and Discord
- **Smart Repurposing**: One input creates 5 platform-specific variants in seconds
- **Trend Prediction**: AI analyzes trends and suggests 7-day trending topics
- **Voice-to-Post**: Speak your ideas and let AI generate complete posts
- **Team Collaboration**: Real-time approvals, invite links, and live voting
- **Performance Analytics**: Track views, likes, shares, and engagement rates
- **Multi-Platform Support**: Twitter, LinkedIn, Instagram, TikTok, Discord

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Postgres, Realtime, Edge Functions)
- **AI**: Google Gemini 1.5 Flash
- **UI Components**: shadcn/ui, Lucide icons, Framer Motion
- **Charts**: Recharts
- **Deployment**: Vercel (frontend) + Supabase (backend)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- Google Gemini API key (free tier: 15 RPM)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ai-content-scheduler
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration files:
   ```bash
   # Copy contents of sql/migrations/001_initial_schema.sql
   # Paste and run in Supabase SQL Editor
   # Then run sql/migrations/002_social_credentials.sql
   ```
3. Enable Realtime for `posts` and `collaborators` tables (already in migration)
4. Get your Supabase URL and anon key from Settings > API

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Connect Social Media Accounts (Optional)

To enable automatic posting to social media:

1. Get API credentials for your platforms (see `SOCIAL_API_SETUP.md`)
2. Go to `/dashboard/connections` in your app
3. Add credentials for Twitter, LinkedIn, Instagram, or Discord
4. Click "Verify Connections"
5. Start scheduling posts - they'll post automatically!

## 📁 Project Structure

```
ai-content-scheduler/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard and project pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── calendar.tsx      # Calendar component
│   ├── ai-tools.tsx      # AI generation tools
│   ├── analytics.tsx     # Analytics dashboard
│   └── ...
├── lib/
│   ├── supabase.ts       # Supabase client
│   ├── gemini.ts         # Gemini AI functions
│   ├── types.ts          # TypeScript types
│   └── mockData.ts       # Mock data for development
├── sql/
│   └── migrations/       # Database migrations
├── supabase/
│   └── functions/        # Edge Functions
└── public/               # Static assets
```

## 🗄️ Database Schema

- **projects**: User projects/campaigns
- **posts**: Scheduled posts with content and metadata
- **templates**: Reusable post templates
- **collaborators**: Team members and permissions
- **post_analytics**: Performance metrics

See `sql/migrations/001_initial_schema.sql` for full schema.

## 🚢 Deployment

### Vercel (Frontend)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Supabase Edge Functions

Deploy the schedule-posts function:

```bash
supabase functions deploy schedule-posts
```

### Vercel Cron Job

The cron job is configured in `vercel.json` to run every 5 minutes. Make sure to set `CRON_SECRET` in your Vercel environment variables.

## 🎨 Customization

- **Theme**: Modify `app/globals.css` for colors and styling
- **Platforms**: Add/remove platforms in `lib/types.ts`
- **AI Prompts**: Customize prompts in `lib/gemini.ts`
- **Templates**: Add templates in the dashboard UI

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- API routes validate authentication
- Environment variables for sensitive keys

## 📊 Free Tier Limits

- **Supabase**: 10k users/month, 500MB DB, 1GB storage
- **Gemini**: 15 requests per minute
- **Vercel**: 100GB bandwidth/month

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists with all required variables
- Restart the dev server after adding env vars

### "Gemini API key not found"
- Check that `GEMINI_API_KEY` is set in `.env.local`
- The app will use mock responses if key is missing

### Calendar not showing
- Ensure `moment` is installed: `npm install moment`
- Check browser console for errors

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Database by [Supabase](https://supabase.com)
- AI by [Google Gemini](https://deepmind.google/technologies/gemini/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)

---

**Made with ❤️ for content creators**

