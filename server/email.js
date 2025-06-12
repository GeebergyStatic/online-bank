// utils/email.js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async ({ email, username, accountNumber, accountType, currencySymbol }) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
          <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f4f4;
    }
    .email-container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      color: #6a1b9a;
    }
    .subheader {
      text-align: center;
      font-size: 18px;
      margin-bottom: 30px;
      color: #333;
    }
    .details {
      font-size: 16px;
      line-height: 1.6;
      color: #444;
    }
    .details strong {
      color: #000;
    }
    .button {
      display: inline-block;
      margin-top: 30px;
      background: #6a1b9a;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      font-size: 13px;
      text-align: center;
      color: #888;
    }
  </style>
    </head>
    <body>
      <div class="email-container">
        <h1 class="header">TrustLine Digital Bank</h1>
        <p class="subheader">Welcome, ${username}!</p>
        <div class="details">
          <p>Your new account has been successfully created.</p>
          <p><strong>Account Number:</strong> ${accountNumber}</p>
          <p><strong>Account Type:</strong> ${accountType}</p>
          <p><strong>Currency:</strong> ${currencySymbol}</p>
        </div>
        <p style="text-align: center;">
          <a class="button" href="https://app.trustlinedigital.online/user/dashboard">Access Your Dashboard</a>
        </p>
        <div class="footer">
          Contact support at <a href="mailto:support@trustlinedigital.online">support@trustlinedigital.online</a>
        </div>
      </div>
    </body>
    </html>
  `;

    await resend.emails.send({
        from: 'TrustLine Digital Bank <noreply@trustlinedigital.online>',
        to: [email],
        subject: 'Welcome to TrustLine Digital Bank!',
        html,
    });
};

module.exports = { sendWelcomeEmail };
