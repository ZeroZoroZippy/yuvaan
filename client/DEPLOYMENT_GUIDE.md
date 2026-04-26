# Vercel Deployment Guide

The portfolio now uses only relative `/api/*` routes backed by Vercel functions. There is no separate Express backend to deploy.

## Required Environment Variables

Set these in Vercel:
```bash
OPENAI_API_KEY=your_openai_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

Client-side Firebase variables still belong in the frontend environment as usual.

## Local Development

From the project root:
```bash
npm run dev
```

This starts the local Vercel environment on `127.0.0.1:3000`, serving both the React app and the `/api/*` routes together.

## Production Checks

After deploy, verify:
1. `/api/chat` responds through the site domain
2. contact form submission reaches `/api/contact`
3. lead capture reaches `/api/leads`
4. unknown topic logging reaches `/api/unknown-questions`
