#!/bin/bash

# Professional Chatbot Setup Script
echo "🤖 Setting up Professional Portfolio Chatbot..."

# Create backup directory
echo "📁 Creating backups..."
mkdir -p backups
cp client/src/components/Chatbot.js backups/Chatbot_original.js 2>/dev/null || echo "No existing Chatbot.js found"
cp client/src/contexts/ChatbotContext.js backups/ChatbotContext_original.js 2>/dev/null || echo "No existing ChatbotContext.js found"
cp server/index.js backups/server_index_original.js 2>/dev/null || echo "No existing server index.js found"

# Server setup
echo "🔧 Setting up server dependencies..."
cd server

# Add to package.json if not exists
if ! grep -q "nodemailer" package.json; then
    echo "📦 Installing server dependencies..."
    npm install nodemailer axios dotenv cors helmet express-rate-limit
fi

# Create .env template if not exists
if [ ! -f .env ]; then
    echo "📝 Creating server .env template..."
    cat > .env << EOL
# Notification Services (Sign up at pushover.net)
PUSHOVER_TOKEN=your_pushover_app_token_here
PUSHOVER_USER=your_pushover_user_key_here

# Email Configuration (Use Gmail with app password)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
YOUR_EMAIL=yuvaan@yourdomain.com

# Optional Integrations
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url

# Server Configuration
NODE_ENV=development
PORT=8000
EOL
    echo "⚠️  Please update server/.env with your actual credentials!"
fi

cd ..

# Client setup
echo "🎨 Setting up client dependencies..."
cd client

# Install client dependencies
if ! grep -q "axios" package.json; then
    echo "📦 Installing client dependencies..."
    npm install axios
fi

# Create client .env template if not exists
if [ ! -f .env.local ]; then
    echo "📝 Creating client .env template..."
    cat > .env.local << EOL
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
EOL
fi

# Create config directory and chatbot config
mkdir -p src/config
if [ ! -f src/config/chatbotConfig.js ]; then
    echo "📝 Creating chatbot configuration..."
    cat > src/config/chatbotConfig.js << 'EOL'
export const portfolioConfig = {
  personal: {
    name: "Yuvaan",
    title: "Full-Stack Developer & UI/UX Designer",
    email: "yuvaan@yourdomain.com", // UPDATE THIS
    linkedin: "linkedin.com/in/yuvaan", // UPDATE THIS
    website: "yuvaan-portfolio.com" // UPDATE THIS
  },
  
  expertise: {
    primary: ["React", "Node.js", "JavaScript", "UI/UX Design"],
    secondary: ["MongoDB", "Express", "Tailwind CSS", "Figma"],
    experience: "3+ years in full-stack development",
    specializations: ["Web Applications", "E-commerce", "Modern UI Design"]
  },
  
  recentProjects: [
    {
      name: "Sarvodaya Dental Clinic",
      description: "Complete digital transformation with modern web presence",
      technologies: ["React", "Node.js", "MongoDB"],
      outcome: "Improved patient engagement by 60%"
    },
    {
      name: "Mental Wellness Platform", 
      description: "Comprehensive mental health tracking application",
      technologies: ["React", "Express", "Firebase"],
      outcome: "Streamlined user experience design"
    }
  ],
  
  pricing: {
    range: "$2,000-$12,000", // ADJUST BASED ON YOUR RATES
    consultationFee: "Free initial consultation",
    responseTime: "4-6 hours for project inquiries"
  },
  
  chatbot: {
    assistantName: "Yuvaan's AI Assistant",
    responseDelay: 1200,
    priorityKeywords: ["hire", "project", "budget", "timeline", "cost"],
    leadQualificationTriggers: ["email", "company", "budget", "deadline", "hire"]
  }
};
EOL
    echo "⚠️  Please update src/config/chatbotConfig.js with your actual information!"
fi

cd ..

# Create setup completion checklist
echo "📋 Creating setup checklist..."
cat > CHATBOT_SETUP_CHECKLIST.md << 'EOL'
# 🤖 Professional Chatbot Setup Checklist

## ✅ Completed by Script
- [x] Created backup files
- [x] Installed required dependencies
- [x] Created .env templates
- [x] Created chatbot configuration template

## 🔧 Manual Steps Required

### 1. Update Configuration Files
- [ ] Update `server/.env` with your actual credentials
- [ ] Update `client/src/config/chatbotConfig.js` with your information
- [ ] Update `client/.env.local` if needed

### 2. Set Up Notification Services
- [ ] Sign up at [pushover.net](https://pushover.net) and get your tokens
- [ ] Set up Gmail app password for email notifications
- [ ] Optional: Set up Slack webhook

### 3. Replace Component Files
- [ ] Replace `client/src/contexts/ChatbotContext.js` with enhanced version
- [ ] Replace `client/src/components/Chatbot.js` with enhanced version
- [ ] Update `server/index.js` with new API endpoints

### 4. Test Setup
- [ ] Start server: `cd server && npm start`
- [ ] Start client: `cd client && npm start`
- [ ] Test chatbot conversation flow
- [ ] Verify notifications are working
- [ ] Check lead capture functionality

## 🎯 Next Steps
1. Customize response templates in ChatbotContext.js
2. Add your actual project data
3. Test lead qualification flow
4. Monitor analytics and lead quality

## 📞 Support
If you need help with any step, refer to the detailed implementation guides or check the backup files in the `backups/` directory.
EOL

echo ""
echo "🎉 Setup script completed!"
echo ""
echo "📋 Next steps:"
echo "1. Check CHATBOT_SETUP_CHECKLIST.md for remaining manual steps"
echo "2. Update configuration files with your actual information"
echo "3. Set up notification services (Pushover, Gmail)"
echo "4. Replace component files with enhanced versions"
echo "5. Test the complete system"
echo ""
echo "⚠️  Important: Update all configuration files before deploying!"
echo ""