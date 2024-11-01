const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define options
  const mailOptions = {
    from: 'eslamelbltagye1111@gmail.com',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  //send mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
