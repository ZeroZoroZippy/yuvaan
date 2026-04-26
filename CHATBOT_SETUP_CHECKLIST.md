# Chatbot Setup Checklist

## Required Configuration

- [ ] Set `OPENAI_API_KEY`
- [ ] Set `EMAIL_USER`
- [ ] Set `EMAIL_PASS`
- [ ] Update `client/src/config/chatbotConfig.js` if content needs to change

## Local Testing

- [ ] Run `npm run dev` from the project root
- [ ] Verify chat requests hit `/api/chat`
- [ ] Verify contact form requests hit `/api/contact`
- [ ] Verify lead capture hits `/api/leads`
- [ ] Verify unknown topic logging hits `/api/unknown-questions`

## Notes

- The project no longer requires a separate Express backend.
- Frontend code uses relative `/api/*` routes in both development and production.
- For full local behavior, use `npm run dev` from the project root.
