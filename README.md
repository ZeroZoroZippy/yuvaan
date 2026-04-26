# Portfolio Website

A React portfolio deployed as a static frontend plus Vercel serverless functions in `api/`.

## Stack

- React 18
- Tailwind CSS
- React Router DOM
- Vercel Functions
- Nodemailer

## Local Development

1. Install dependencies:
```bash
npm run install-all
```

2. Add the required environment variables for serverless functions:
```bash
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
OPENAI_API_KEY=your-openai-key
```

3. Start local development:
```bash
npm run dev
```

This runs the app and serverless functions together through `vercel dev` on `http://127.0.0.1:3000`.

## Scripts

- `npm run dev` starts the client and local Vercel functions
- `npm run client` starts only the React app without serverless routes
- `npm run api` starts the full local Vercel dev environment
- `npm run build` builds the client
- `npm run test` runs the client test suite once
- `npm run install-all` installs root and client dependencies

## Deployment

Deploy the repo to Vercel from the project root. The frontend is built from `client/`, and the serverless endpoints are served from `api/`.
