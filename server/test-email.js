// Save this as test-email.js in your server directory
// Run with: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔍 Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ Missing email credentials in .env file');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test connection
transporter.verify()
  .then(() => {
    console.log('✅ SMTP connection successful!');
    console.log('📧 Email service is properly configured');
    
    // Test sending a real email
    return transporter.sendMail({
      from: `"Portfolio Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email from Portfolio Backend',
      html: `
        <h3>Email Test Successful</h3>
        <p>This confirms your email configuration is working!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    });
  })
  .then((info) => {
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Check your inbox for the test email');
  })
  .catch((error) => {
    console.error('❌ Email configuration failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Common error solutions
    if (error.code === 'EAUTH') {
      console.log('\n💡 Solution: Invalid Gmail credentials');
      console.log('1. Make sure you\'re using Gmail App Password, not your regular password');
      console.log('2. Generate App Password: Google Account → Security → 2-Step Verification → App passwords');
      console.log('3. Use the 16-digit code (no spaces)');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Solution: Network/DNS issue');
      console.log('1. Check your internet connection');
      console.log('2. Try using different DNS (8.8.8.8)');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Solution: Connection failed');
      console.log('1. Check if Gmail SMTP is blocked by firewall');
      console.log('2. Try port 465 with secure: true');
    }
  });