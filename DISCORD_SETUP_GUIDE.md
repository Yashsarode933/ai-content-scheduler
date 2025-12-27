# Discord Setup Guide - Step by Step

This guide will walk you through setting up Discord integration using the **Webhook method** (easiest way).

---

## 🎯 What You'll Need

- A Discord account
- A Discord server (or permission to create webhooks in a server)
- 5 minutes

---

## 📝 Step-by-Step Instructions

### Step 1: Open Discord

1. Open Discord in your browser or desktop app
2. Log in to your account

### Step 2: Choose a Server and Channel

1. **Select a server** from the left sidebar (or create one if you don't have one)
2. **Click on a channel** where you want posts to appear
   - You can use any text channel (like #general, #announcements, etc.)
   - Or create a new channel specifically for scheduled posts

### Step 3: Open Channel Settings

1. **Right-click** on the channel name (at the top of the channel)
2. A menu will appear
3. Click on **"Edit Channel"** (or "Channel Settings" in some versions)

### Step 4: Find Integrations

1. In the channel settings, look for a menu on the left side
2. Click on **"Integrations"** (it has a puzzle piece icon 🔧)
3. You should see a section called **"Webhooks"**

### Step 5: Create a Webhook

1. Click the **"Create Webhook"** button (or **"New Webhook"**)
2. A webhook creation window will appear
3. You can:
   - **Name your webhook** (e.g., "Content Scheduler" or "AI Posts")
   - **Choose an avatar** (optional - click the avatar to change it)
4. Click **"Copy Webhook URL"** button
   - This copies the URL to your clipboard
   - The URL looks like: `https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz`

**⚠️ IMPORTANT**: Copy this URL immediately! You won't be able to see it again easily.

### Step 6: Save the Webhook

1. Click **"Save Changes"** at the bottom
2. Your webhook is now created!

---

## 🔗 Step 7: Add Webhook to Your App

1. **Open your AI Content Scheduler app**
2. **Go to**: `http://localhost:3000/dashboard/connections`
   - Or click "Connections" in the sidebar
3. **Scroll down** to the **Discord** section
4. **Find the field** labeled "Webhook URL (Recommended - Easier)"
5. **Paste your webhook URL** into that field
   - Right-click → Paste, or Ctrl+V (Cmd+V on Mac)
6. **Click "Save All Credentials"** button at the bottom
7. **Click "Verify Connections"** button
   - You should see a green checkmark ✅ next to Discord

---

## ✅ Step 8: Test It!

1. **Go to your calendar** (`/dashboard/1` or any project)
2. **Create a new post**:
   - Click on a date in the calendar, OR
   - Use the AI Tools to generate a post
3. **Select Discord** as one of the platforms
4. **Schedule the post** for 1-2 minutes from now
5. **Wait** for the scheduled time
6. **Check your Discord channel** - your post should appear automatically! 🎉

---

## 🎨 Visual Guide (What to Look For)

### In Discord:
```
Server Name
  └─ #channel-name  ← Right-click here
      └─ Edit Channel
          └─ Integrations (left menu)
              └─ Webhooks
                  └─ Create Webhook
                      └─ Copy Webhook URL ← This is what you need!
```

### In Your App:
```
Dashboard
  └─ Connections (sidebar)
      └─ Discord Section
          └─ Webhook URL field ← Paste URL here
              └─ Save All Credentials
                  └─ Verify Connections ← Should show ✅
```

---

## 🔍 Finding Your Webhook URL Again

If you lost your webhook URL:

1. Go back to the channel settings
2. Click **"Integrations"** → **"Webhooks"**
3. You'll see your webhook listed
4. Click on it to view details
5. Click **"Copy Webhook URL"** again

---

## 🐛 Troubleshooting

### "Webhook URL not working"
- Make sure you copied the **entire URL** (it's very long)
- Check for extra spaces before/after the URL
- Make sure the webhook wasn't deleted in Discord

### "No posts appearing in Discord"
- Verify the webhook URL is saved correctly
- Check that "Verify Connections" shows ✅
- Make sure you selected Discord when creating the post
- Check the post is scheduled (not just saved as draft)

### "Can't find Integrations option"
- Make sure you have **permission** to manage webhooks in that server
- You need "Manage Webhooks" permission
- Try a different server or ask an admin

### "Webhook deleted"
- If someone deleted the webhook, you'll need to create a new one
- The old URL won't work anymore
- Just create a new webhook and update the URL in your app

---

## 💡 Pro Tips

1. **Create a dedicated channel** for scheduled posts (e.g., #scheduled-posts)
2. **Name your webhook** something recognizable (e.g., "AI Content Scheduler")
3. **Test with a post scheduled 1 minute from now** before scheduling important posts
4. **Keep your webhook URL private** - anyone with it can post to your channel!

---

## 🎉 You're Done!

Once you see the green checkmark ✅ next to Discord, you're all set! 

Your scheduled posts will now automatically appear in your Discord channel at the scheduled time.

---

## 📞 Need More Help?

If you're still stuck:
1. Make sure you're right-clicking on the **channel name** (not a message)
2. Look for "Integrations" or "Webhooks" in the settings
3. Try creating a test server to practice
4. Check Discord's official help: https://support.discord.com

---

**Next**: Try setting up Twitter or LinkedIn using the same Connections page!

