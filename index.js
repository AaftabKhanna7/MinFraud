const { WebhookClient } = require('dialogflow-fulfillment');
const nodemailer = require('nodemailer');

// Configure SMTP transport for sending email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email-address@gmail.com',
    pass: 'your-email-password'
  }
});

// Handle the Report a Suspicious Email intent
function reportSuspiciousEmailHandler(agent) {
  // Extract the email subject and sender address parameters from the user's input
  const emailSubject = agent.parameters.email_subject;
  const senderAddress = agent.parameters.sender_address;
  
  // Construct the email message
  const mailOptions = {
    from: 'your-email-address@gmail.com',
    to: 'security-team@yourcompany.com',
    subject: `Suspicious email report: ${emailSubject}`,
    text: `The following email was reported as suspicious:\n\nSubject: ${emailSubject}\nSender address: ${senderAddress}\n\nPlease review this email as soon as possible.`
  };
  
  // Send the email using the SMTP transport
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
  
  // Respond to the user with a confirmation message
  agent.add(`Thank you for reporting this email. Our security team will investigate it further.`);
}

// Set up the webhook routes
const express = require('express');
const app = express();
app.use(express.json());
app.post('/', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  let intentMap = new Map();
  intentMap.set('Report a Suspicious Email', reportSuspiciousEmailHandler);
  agent.handleRequest(intentMap);
});
app.listen(process.env.PORT || 8080);