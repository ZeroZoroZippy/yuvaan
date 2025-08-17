# Chatbot Module

This directory contains all chatbot-related code organized in a modular structure.

## Directory Structure

```
chatbot/
├── components/          # React components
│   ├── Chatbot.js              # Main chatbot interface
│   ├── ChatbotTrigger.js       # Floating orb trigger
│   ├── ChatbotAnalyticsDashboard.js  # Analytics dashboard
│   └── Chatbot_old.js          # Legacy component (backup)
├── context/            # React context
│   └── ChatbotContext.js       # Chatbot state management
├── config/             # Configuration
│   └── chatbotConfig.js        # Chatbot settings
├── utils/              # Utility functions (future use)
├── index.js            # Module exports
└── README.md           # This file
```

## Usage

### Import all components from the module:
```javascript
import { 
  Chatbot, 
  ChatbotTrigger, 
  ChatbotProvider, 
  useChatbot,
  ChatbotAnalyticsDashboard,
  chatbotConfig 
} from '../chatbot';
```

### Or import individual components:
```javascript
import { useChatbot } from '../chatbot/context/ChatbotContext';
import Chatbot from '../chatbot/components/Chatbot';
```

## Components

- **Chatbot**: Main chatbot interface with desktop and mobile layouts
- **ChatbotTrigger**: Fixed floating orb that opens the chatbot
- **ChatbotAnalyticsDashboard**: Analytics and metrics dashboard
- **ChatbotProvider**: Context provider for chatbot state
- **useChatbot**: Hook to access chatbot context

## Features

- GPT-4o-mini integration for fast AI responses
- Lead qualification and analytics
- Mobile-responsive design
- Professional business-focused conversations
- Email capture and lead tracking
- Real-time analytics and monitoring