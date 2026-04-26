# Deployment Guide

This project is deployed as:
- a static React build from `client/`
- serverless endpoints from `api/`

## Vercel

1. Import the repository into Vercel.
2. Keep the root as the project directory.
3. Let Vercel use the existing [vercel.json](/Users/yuvaanvithlani/Desktop/Personal/yuvaan/vercel.json:1).

## Required Environment Variables

Client-side Firebase variables:
```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Server-side function variables:
```bash
OPENAI_API_KEY=your_openai_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

`REACT_APP_API_URL` is not used anymore. The frontend calls relative `/api/*` routes in all environments.

## Local Development

Run:
```bash
npm run dev
```

That starts the full local Vercel environment on `http://127.0.0.1:3000`, including the React app and `/api/*` routes.

## Verification

Before deploying, verify:
- `npm run build`
- `npm run test`
- chatbot requests succeed through `/api/chat`
- contact form submits through `/api/contact`
- lead logging works through `/api/leads`
