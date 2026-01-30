const nodemailer = require('nodemailer');

// In a real application, you would use a robust logging solution
// and secure credential management. For this example, we'll log to the console.

// Create a transporter object using SMTP transport.
// You'll need to configure this with your actual email service provider's details.
// For example, for Gmail, you would use something like:
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// For now, we'll use a dummy transporter that doesn't actually send emails
// but allows us to see the message that would be sent.
const transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
});


/**
 * Sends an email.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text body of the email.
 * @param {string} html - The HTML body of the email.
 */
async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: `"Your App Name" <no-reply@yourapp.com>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  };

  try {
    // In a real implementation, you would use transporter.sendMail(mailOptions)
    // For this example, we'll just log the email content.
    console.log('--- Email to be sent ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Body:');
    console.log(text || html);
    console.log('------------------------');
    // const info = await transporter.sendMail(mailOptions);
    // console.log('Message sent: %s', info.messageId);
    return Promise.resolve(); // Simulate successful sending
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendEmail };
