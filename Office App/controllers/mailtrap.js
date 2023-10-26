const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
    secure:false, 
    auth:{
      user: process.env.EMAIL_USERNAME, 
      pass: process.env.EMAIL_PASSWORD
    }
});

const sendingEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Welcome to Office Chat App',
    text: `
    Welcome to the Office Chat App family one of the best office apps in the world. 
    Here you can explore work opportunities with your fellow collegues and be in touch all the time. 
    Office Chat App supports you in your career development`
  }
  try {
        const data = await transporter.sendMail(mailOptions);
        console.log("Email was sucesfully sent", data.response); 
  } catch (err){
        console.log('Ups! Your email was not sent. Please try again', err);
  }
};

module.exports = {sendingEmail};