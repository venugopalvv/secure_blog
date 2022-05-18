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
    transporter.sendMail({
      from: 'youremail@gmail.com',
      to: email,
      subject: 'Your One Time Password',
      text: 'Your onetime password to safely login in to your account is . OTP is secret and can be used only once. Therefore, do not disclose this to anyone.'
      }, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
      });
    res.render("forgotpwdotp",{email:email});
  })

  router
  .get("/forgotpwdotp", (req, res) => {
    res.render("forgotpwdotp");
  })

  .post("/forgotpwdotp", (req, res) => {
    const {recieved_otp} = req.body
    console.log(recieved_otp)
    res.render("changepwdforgot");
  })

module.exports = router;