#!/bin/bash

# Portfolio setup script
echo "Setting up the portfolio app..."

# Create backup directory
echo "Creating backups..."
mkdir -p backups
cp client/src/components/Chatbot.js backups/Chatbot_original.js 2>/dev/null || echo "No existing Chatbot.js found"
cp client/src/contexts/ChatbotContext.js backups/ChatbotContext_original.js 2>/dev/null || echo "No existing ChatbotContext.js found"

# Client setup
echo "Setting up client dependencies..."
cd client

# Install client dependencies
if ! grep -q "axios" package.json; then
    echo "Installing client dependencies..."
    npm install axios
fi

# Create client .env template if not exists
if [ ! -f .env.local ]; then
    echo "Creating client .env template..."
    cat > .env.local << EOL
REACT_APP_ENVIRONMENT=development
EOL
fi

# Create config directory and chatbot config
mkdir -p src/config
if [ ! -f src/config/chatbotConfig.js ]; then
    echo "Creating chatbot configuration..."
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
    echo "Please update src/config/chatbotConfig.js with your actual information."
fi

cd ..

# Create setup completion checklist
echo "Creating setup checklist..."
cat > CHATBOT_SETUP_CHECKLIST.md << 'EOL'
# Chatbot Setup Checklist

## Manual Steps
- [ ] Set `OPENAI_API_KEY`
- [ ] Set `EMAIL_USER`
- [ ] Set `EMAIL_PASS`
- [ ] Update `client/src/config/chatbotConfig.js` if needed

## Local Testing
- [ ] Run `npm run dev`
- [ ] Verify `/api/chat`
- [ ] Verify `/api/contact`
- [ ] Verify `/api/leads`
- [ ] Verify `/api/unknown-questions`
EOL

echo ""
echo "Setup script completed."
echo ""
echo "Next steps:"
echo "1. Check CHATBOT_SETUP_CHECKLIST.md"
echo "2. Set the required environment variables"
echo "3. Test the complete system with npm run dev"
echo ""
echo "Update all configuration files before deploying."
echo ""
