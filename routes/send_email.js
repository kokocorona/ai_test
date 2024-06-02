const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"EMail work"})
  sendEmail();
})


const sendEmail = () => {
  
// need to open in outlook new accout
  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
      user: 'koko.akof10@outlook.com',
      pass: 'MONKEYS12'
    }
  });
  
  let mailOptions = {
    from: 'koko.akof10@outlook.com',
    to: 'ofer.neto@gmail.com',
    subject: 'New customer to 2monkeys2.co.il 💰',
    text: `New Customer to 2 2monkeys.co.il`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("err",error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  }
  

module.exports = router;