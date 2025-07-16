import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., "smtp.gmail.com"
  port: 587, // Use 465 for SSL
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// TailwindCSS-like styles inlined for email compatibility
const generateEmailTemplate = (bodyContent: string) => `
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #1f2937;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    
    <div style="
      background-color: #8f2dd6; 
      color: white; 
      text-align: center; 
      padding: 15px;
      border-radius: 6px 6px 0 0;">
      <h2 style="margin: 0; font-size: 24px;">Zoro AI Notification</h2>
    </div>

    <div style="
      background-color: #ffffff;
      padding: 20px;
      border-radius: 0 0 6px 6px;
      line-height: 1.6;">
      
      ${bodyContent}

      <p style="
        margin-top: 20px;
        font-size: 14px;
        color: #6b7280;">
        Regards,<br>
        <strong>Zoro AI</strong>
      </p>
    </div>

    <footer style="
      text-align: center; 
      margin-top: 20px; 
      font-size: 12px; 
      color: #9ca3af;">
      <p>&copy; 2025 Zoro AI. All rights reserved.</p>
      <a href="#" style="color: #4f46e5; text-decoration: none;">Unsubscribe</a> |
      <a href="#" style="color: #4f46e5; text-decoration: none;">Privacy Policy</a>
    </footer>
  </div>
`;

export const sendEmail = async (to: string, subject: string, body: string) => {
  try {
    const htmlBody = generateEmailTemplate(body);

    const mailOptions = {
      from: `"Zoro AI" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html: htmlBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed.');
  }
};
