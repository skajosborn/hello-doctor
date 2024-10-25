import nodemailer from "nodemailer";

// Configure the transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Helper function to send an email
const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send email verification
export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const confirmLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;

  const subject = "Confirm your email";
  const html = `<p>Click <a href='${confirmLink}'>here</a> to confirm your email.</p>`;

  return sendEmail(email, subject, html);
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;
  const subject = "Reset your Password";
  const html = `<p>Click <a href='${resetLink}'>here</a> to reset your password.</p>`;

  return sendEmail(email, subject, html);
};

// Send two-factor authentication (2FA) token email
export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const subject = "Your 2FA Code";
  const html = `<p>Your 2FA code is: ${token}</p>`;

  return sendEmail(email, subject, html);
};
