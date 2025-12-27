# Social Media API Setup Guide

This guide explains how to get API credentials for each social media platform to enable automatic posting.

## 📋 Overview

To enable automatic posting, you need to:
1. Create developer accounts for each platform
2. Create apps/projects
3. Get API credentials (keys, tokens, etc.)
4. Add them to the Connections page in your dashboard

---

## 🐦 Twitter/X API Setup

### Step 1: Create Twitter Developer Account
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Sign in with your Twitter account
3. Apply for a developer account (usually approved quickly)
4. Accept the terms and conditions

### Step 2: Create an App
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Click **"Create App"** or **"Create Project"**
3. Fill in:
   - App name: Your app name
   - Use case: Select appropriate option
4. Click **"Create"**

### Step 3: Get API Keys
1. In your app dashboard, go to **"Keys and tokens"**
2. You'll see:
   - **API Key** → Copy this
   - **API Secret** → Copy this
   - **Access Token & Secret** → Generate if not present
   - **Bearer Token** → Optional, but recommended

### Step 4: Set Permissions
1. Go to **"Settings"** → **"User authentication settings"**
2. Enable **"Read and write"** permissions
3. Add callback URL: `http://localhost:3000/auth/twitter/callback` (for local dev)
4. Save changes

### Step 5: Add to App
- Go to `/dashboard/connections`
- Enter all Twitter credentials
- Click **"Save"** and **"Verify Connections"**

**Note**: Twitter API v2 is free but has rate limits. Consider upgrading for higher limits.

---

## 💼 LinkedIn API Setup

### Step 1: Create LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Sign in with your LinkedIn account
3. Click **"Create app"**
4. Fill in:
   - App name
   - Company LinkedIn Page (required)
   - Privacy policy URL
   - App logo
5. Submit for review

### Step 2: Get OAuth Credentials
1. In your app, go to **"Auth"** tab
2. Add redirect URL: `http://localhost:3000/auth/linkedin/callback`
3. Note your **Client ID** and **Client Secret**

### Step 3: Request Permissions
1. Go to **"Products"** tab
2. Request access to:
   - **Sign In with LinkedIn using OpenID Connect**
   - **Share on LinkedIn** (for posting)
3. Submit for approval (may take a few days)

### Step 4: Get Access Token
1. Use OAuth 2.0 flow to get user access token
2. Or use [LinkedIn OAuth Playground](https://www.linkedin.com/developers/tools/oauth/playground)
3. Select scopes: `w_member_social`, `openid`, `profile`, `email`
4. Generate access token

### Step 5: Add to App
- Go to `/dashboard/connections`
- Enter LinkedIn Access Token
- (Optional) Add Organization ID for company page posting
- Click **"Save"**

**Note**: LinkedIn API requires approval and has strict guidelines.

---

## 📷 Instagram API Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select **"Business"** as app type
4. Fill in app details

### Step 2: Add Instagram Product
1. In your app dashboard, go to **"Add Products"**
2. Find **"Instagram"** and click **"Set Up"**
3. Follow the setup wizard

### Step 3: Get Instagram Business Account
1. You need an Instagram Business or Creator account
2. Connect it to a Facebook Page
3. In Facebook App → **"Instagram"** → **"Basic Display"**
4. Get your **Instagram Business Account ID**

### Step 4: Get Access Token
1. Go to **"Tools"** → **"Graph API Explorer"**
2. Select your app
3. Add permissions: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`
4. Generate **User Access Token**
5. Exchange for **Long-Lived Token** (60 days)

### Step 5: Get Page ID
1. Go to your Facebook Page
2. Go to **"About"** section
3. Find **"Page ID"** (or use Graph API)

### Step 6: Add to App
- Go to `/dashboard/connections`
- Enter:
  - Access Token
  - Instagram Business Account ID
  - Facebook Page ID
- Click **"Save"**

**Note**: Instagram API requires Facebook Business account and approval process.

---

## 💬 Discord API Setup

### Option 1: Webhook (Recommended - Easier)

1. **Create Webhook**:
   - Go to your Discord server
   - Right-click channel → **"Edit Channel"**
   - Go to **"Integrations"** → **"Webhooks"**
   - Click **"New Webhook"**
   - Name it and copy the **Webhook URL**

2. **Add to App**:
   - Go to `/dashboard/connections`
   - Paste Webhook URL
   - Click **"Save"**

### Option 2: Bot Token (More Features)

1. **Create Discord Application**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click **"New Application"**
   - Name your application

2. **Create Bot**:
   - Go to **"Bot"** section
   - Click **"Add Bot"**
   - Copy the **Bot Token**

3. **Set Permissions**:
   - Go to **"OAuth2"** → **"URL Generator"**
   - Select scopes: `bot`, `messages`
   - Select permissions: `Send Messages`, `Read Message History`
   - Copy the generated URL

4. **Invite Bot to Server**:
   - Use the generated URL to invite bot
   - Select your server
   - Authorize

5. **Get Channel ID**:
   - Enable Developer Mode in Discord
   - Right-click channel → **"Copy ID"**

6. **Add to App**:
   - Go to `/dashboard/connections`
   - Enter Bot Token and Channel ID
   - Click **"Save"**

---

## ✅ Verification

After adding credentials:

1. Click **"Verify Connections"** button
2. Green checkmarks = Connected ✅
3. Red X = Not connected (check credentials) ❌

---

## 🔒 Security Notes

- **Never commit API keys to Git** (already in `.gitignore`)
- Store credentials securely in Supabase database
- Use environment variables for sensitive keys in production
- Rotate keys regularly
- Use read-only tokens when possible

---

## 📊 API Limits

| Platform | Free Tier Limits |
|----------|------------------|
| Twitter | 1,500 tweets/month (v2) |
| LinkedIn | 100 posts/day |
| Instagram | 25 posts/day |
| Discord | Unlimited (webhook) |

---

## 🐛 Troubleshooting

### "Invalid credentials"
- Double-check all keys/tokens
- Ensure no extra spaces
- Verify tokens haven't expired

### "Permission denied"
- Check app permissions in developer portal
- Ensure OAuth scopes are correct
- Verify app is approved (LinkedIn/Instagram)

### "Rate limit exceeded"
- Wait before retrying
- Consider upgrading API tier
- Implement rate limiting in your code

### "Connection timeout"
- Check internet connection
- Verify API endpoints are accessible
- Check firewall settings

---

## 📚 Additional Resources

- [Twitter API Docs](https://developer.twitter.com/en/docs)
- [LinkedIn API Docs](https://learn.microsoft.com/en-us/linkedin/)
- [Instagram API Docs](https://developers.facebook.com/docs/instagram-api)
- [Discord API Docs](https://discord.com/developers/docs)

---

## 🚀 Next Steps

Once connected:
1. Create a post in your calendar
2. Select platforms
3. Schedule it
4. It will automatically post at the scheduled time!

