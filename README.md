# Portfolio Website

A modern, responsive portfolio website built with React, Tailwind CSS, and Node.js.

## Features

- 🎨 Modern, clean design with Tailwind CSS
- 📱 Fully responsive layout
- ⚡ Fast and optimized React components
- 📧 Contact form with email functionality
- 🚀 Easy to customize and deploy

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- React Router DOM

**Backend:**
- Node.js
- Express.js
- Nodemailer (for contact form)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd portfolio-website
```

2. Install all dependencies
```bash
npm run install-all
```

3. Set up environment variables
```bash
cd server
cp .env.example .env
# Edit .env with your email credentials
```

4. Start the development servers
```bash
npm run dev
```

This will start:
- React development server on http://localhost:3000
- Node.js server on http://localhost:5000

## Customization

### Personal Information
Update the following files with your information:
- `client/src/components/Hero.js` - Your name and title
- `client/src/components/About.js` - Your bio and skills
- `client/src/components/Projects.js` - Your projects
- `client/src/components/Contact.js` - Your contact information

### Styling
- Colors and theme: `client/tailwind.config.js`
- Global styles: `client/src/index.css`

### Contact Form
Configure email settings in `server/.env`:
- `EMAIL_USER`: Your email address
- `EMAIL_PASS`: Your email app password

## Deployment

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
```

### Backend (Heroku/Railway)
The server is ready for deployment with the included `package.json` scripts.

## Scripts

- `npm run dev` - Start both client and server in development
- `npm run client` - Start only the React development server
- `npm run server` - Start only the Node.js server
- `npm run build` - Build the React app for production
- `npm run install-all` - Install dependencies for all packages

## License

MIT License - feel free to use this template for your own portfolio!