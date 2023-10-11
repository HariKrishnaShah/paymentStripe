const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mail = async (email, token) => {
  const info = await transport.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "OTP VERIFICATION",
    html: `<div>Hi, Your OTP Code is <strong>${token}</strong></div>`,
  });
  return info.messageId;
};

module.exports = { mail };
