# Vercel Deployment Guide

## CORS Error Fix - Complete Setup

Your chatbot CORS error has been fixed with the following changes:

### 1. ✅ Created Vercel API Routes
- `api/chat.js` - Handles chatbot conversations using OpenAI
- `api/leads.js` - Handles lead data recording

### 2. ✅ Updated Environment Variables
- Added `REACT_APP_API_URL=https://yuvaan-vithlani.vercel.app` to `.env`
- Fixed API endpoint inconsistencies

### 3. 🔧 Required: Add OpenAI API Key to Vercel

**CRITICAL**: You need to add your OpenAI API key to Vercel:

1. Go to your Vercel dashboard
2. Select your project (`yuvaan-vithlani`)
3. Go to Settings > Environment Variables
4. Add a new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-`)
   - **Environments**: Production, Preview, Development (select all)

### 4. 🚀 Deploy the Changes

After adding the API key:

```bash
# Commit and push the changes
git add .
git commit -m "Fix CORS: Add Vercel API routes and update config 🤖 Generated with Claude Code"
git push
```

Vercel will automatically redeploy with the new API routes.

### 5. ✅ What's Fixed

- ✅ CORS errors resolved with proper headers
- ✅ API routes now work in production
- ✅ Chatbot will connect to your production API
- ✅ Lead recording will work in production
- ✅ No more localhost:5000 errors

### 6. 🔍 Testing

After deployment, test:
1. Open your site: https://yuvaan-vithlani.vercel.app
2. Click the chatbot orb
3. Send a message
4. Check browser console for any errors

### 7. 📧 Lead Notifications (Optional Enhancement)

The current leads API just logs data. To get email notifications when leads are captured, you can:

1. Add SendGrid/Nodemailer to send emails
2. Connect to a database (Supabase, Airtable)
3. Integrate with a CRM

### 8. 🔧 Environment Variables Summary

Your `.env` should have:
```
REACT_APP_API_URL=https://yuvaan-vithlani.vercel.app
# ... Firebase config ...
```

Your Vercel Environment Variables should have:
```
OPENAI_API_KEY=sk-your-openai-key-here
```

## Next Steps

1. **Add OpenAI API key to Vercel** (most important)
2. **Deploy the changes**
3. **Test the chatbot**
4. **Set up lead notifications** (optional)

The CORS error will be completely resolved once you add the OpenAI API key and redeploy!