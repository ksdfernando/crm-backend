const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dinendrafernando3@gmail.com',
    pass: 'wqam ksil eyly qjnl' // App-specific password (not your Gmail password)
  }
});

const sendTicketEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: '"CRM System" <dinendrafernando3@gmail.com>',
    to,
    subject,
    text
  });
};

module.exports = sendTicketEmail;
