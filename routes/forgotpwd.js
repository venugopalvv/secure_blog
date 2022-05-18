const router = require("express").Router();
var nodemailer = require('nodemailer');
const { getMaxListeners } = require("../databaseConnection");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bonyjohnomcr@gmail.com',
    pass: 'dtonaqcirzwlwquq'
  }
  });

  router
  .get("/forgotpwd", (req, res) => {
    res.render("forgotpwd");
  })

router
  .post("/forgotpwd", (req, res) => {
    const {email} = req.body
    const OTP = otpGenerator.generate(6,  {
      upperCaseAlphabets: false,
      lowerCaseAlphabets:false, 
      specialChars: false,
      });
      OTP_gen=OTP;
      OTP_time=new Date();
      var email_addr=req.body.email;

      transporter.sendMail({
      from: 'youremail@gmail.com',
      to: req.body.email,
      subject: 'Your OTP for Reset Password',
      text: 'Your onetime password for changing your password is ' + OTP + '. OTP is secret and can be used only once. Therefore, do not disclose this to anyone.'
      }, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
      });
      msg1 = 'Validate OTP!'
      msg2 = ''
      msg3 = 'An OTP has been send to your registered email address'
      msg4 = 'OTP is valid only for 60 seconds.'
      res.render("forgotpwdotp.ejs",{email:email, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4})
  })

  router
  .get("/forgotpwdotp", (req, res) => {
    res.render("forgotpwdotp");
  })

  .post("/forgotpwdotp", (req, res) => {
    const {recieved_otp} = req.body
    res.render("changepwdforgot");
  })

module.exports = router;