export async function sendOtpEmail(email: string, otp: string): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'bloodchainai@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'BloodChain AI';

  if (!apiKey) {
    console.error('BREVO_API_KEY is not defined in environment variables.');
    return false;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #0a0a0a; /* Black */
          color: #FFFFF0; /* Warm ivory */
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #1a1a1a;
          border-top: 4px solid #800020; /* Deep burgundy */
          padding: 30px;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #800020; /* Deep burgundy */
          margin: 0;
        }
        .content {
          text-align: center;
          line-height: 1.6;
        }
        .otp-container {
          margin: 30px 0;
          padding: 15px;
          background-color: #2a2a2a;
          border-radius: 6px;
        }
        .otp {
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #FFFFF0; /* Warm ivory */
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
        .tagline {
          color: #800020;
          font-weight: bold;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>BloodChain AI</h1>
        </div>
        <div class="content">
          <h2>Verify your email address.</h2>
          <p>Your verification code is:</p>
          <div class="otp-container">
            <span class="otp">${otp}</span>
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this verification, you can safely ignore this email.</p>
          <p class="tagline">Time Matters in Every Drop.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} BloodChain AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const requestBody = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: [
      {
        email: email
      }
    ],
    subject: 'Your BloodChain AI verification code',
    htmlContent: htmlContent
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Brevo API Error (${response.status}):`, errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error calling Brevo API:', error);
    return false;
  }
}
