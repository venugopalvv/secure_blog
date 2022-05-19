const router = require("express").Router();
const db = require('../databaseConnection');
var nodemailer = require('nodemailer');
const { getMaxListeners } = require("../databaseConnection");
const otpGenerator = require('otp-generator');
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: false });
var sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcryptjs')
var messagebird = require('messagebird')('dxScUo2tmVxLkJWST2MqI5HsD');
global.OTP_gen_f = ''
global.OTP_attempt_f = 5
global.OTP_time_f = ''
global.minutesToAddOTP_f=1;
global.minutesToAddOTP_f=1;
var email_f='';

var params = {
  'originator': 'TestMessage',
  'recipients': [
    '+447548003200'
],
  'body': 'This is a test message'
};

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bonyjohnomcr@gmail.com',
    pass: 'dtonaqcirzwlwquq'
  }
  });

  router
  .get("/forgotpwd", (req, res) => {
    var msg1 = '';
    var msg2 = 'Reset Password';
    var msg3 = '';
    res.render("forgotpwd", {msg1:msg1, msg2:msg2, msg3:msg3});
  })

router
  .post("/forgotpwd", (req, res) => {
    var {email} = req.body
    email_f = sanitizeHtml(email);
    db.query('SELECT * FROM accounts WHERE email = ?', [email_f], async function(error, results, fields) {
      if (error) throw error;

    if (results.length > 0 ) {
    const OTP = otpGenerator.generate(6,  {
      upperCaseAlphabets: false,
      lowerCaseAlphabets:false, 
      specialChars: false,
      });
      OTP_gen_f=OTP;
      OTP_time_f=new Date();
      transporter.sendMail({
      from: 'youremail@gmail.com',
      to: email_f,
      subject: 'Your OTP for Reset Password',
      text: 'Your onetime password for changing your password is ' + OTP + '. OTP is secret and can be used only once. Therefore, do not disclose this to anyone.'
      }, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
      });
      messagebird.messages.create(params, function (err, response) {
        if (err) {
          return console.log(err);
        }
        console.log(response);
      });
      msg1 = 'Validate OTP!'
      msg2 = ''
      msg3 = 'An OTP has been send to your registered email address'
      msg4 = 'OTP is valid only for 60 seconds.'
      res.render("forgotpwdotp.ejs",{email:email_f, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4})
    }

    else {
      var msg1 = 'You have entered an invalid email!';
      var msg2 = '';
      var msg3 = 'Please try again.';
      res.render("forgotpwd.ejs",{msg1:msg1, msg2:msg2, msg3:msg3});
    }
  })
})


  router
  .get("/forgotpwdotp", (req, res) => {
    res.render("forgotpwdotp");
  })


  .post("/forgotpwdotp", (req, res) => {
    var {recieved_otp} = req.body
    console.log(email_f)
    recieved_otp = sanitizeHtml(recieved_otp);
    var datenow = new Date();
    var gen_date = new Date(OTP_time_f)
    var nextdate = new Date(gen_date.getTime() + minutesToAddOTP_f*60000);
    if ((recieved_otp === OTP_gen_f) && (datenow < nextdate)){
      res.redirect("/changepwdforgot");
    }
    else {
        const OTP = otpGenerator.generate(6,  {
        upperCaseAlphabets: false,
        lowerCaseAlphabets:false, 
        specialChars: false,
        });
        OTP_gen_f=OTP;
        OTP_time_f=new Date();
        OTP_attempt_f--
        console.log(email_f)
        transporter.sendMail({
        from: 'youremail@gmail.com',
        to: email_f,
        subject: 'Your One Time Password',
        text: 'Your onetime password to safely login in to your account is ' + OTP + '. OTP is secret and can be used only once. Therefore, do not disclose this to anyone.'
        }, (err, info) => {
          console.log(info.envelope);
          console.log(info.messageId);
        });
  
        if (OTP_attempt_f <= 0){
        msg1 = ''
        msg2 = 'Your account has been blocked temporarly!'
        msg3 = ''
        msg4 = 'Multiple failed attempts'
        blocked_time = new Date()
        db.query("UPDATE accounts SET blocked_time = ? WHERE email = ?",[blocked_time, email_f], (err, result) => {
          if(err) throw err;
          res.render("forgotpwdotp.ejs",{email:email_f, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4});
        });
        }
        else if (datenow > nextdate){
          msg1 = ''
          msg2 = 'OTP Expired! Please enter the new OTP.'
          msg3 = 'A new OTP has been send to your registered email address'
          msg4 = 'OTP is valid only for 60 seconds.'
          res.render("forgotpwdotp.ejs",{email:email_f, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4});
        }
        else{
          msg1 = ''
          msg2 = 'OTP is invalid. Plesae enter correct OTP!'
          msg3 = 'A new OTP has been send to your registered email address'
          msg4 = 'OTP is valid only for 60 seconds.'
          res.render("forgotpwdotp.ejs",{email:email_f, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4});
  
        }
    }
  })

  router
  .get("/changepwdforgot", csrfProtection, async (req, res,next) => {
    try {
      var username = req.session.user
      res.render('changepwdforgot', {CSRF_TOKEN: req.csrfToken(), username:username});
    } catch (error) {
      res.json({ status: 'error', error: ';))' })
    }
  })
  
  router.post('/changepwdforgot', csrfProtection,async (req, res) => {
    var {_csrf,psw,pswrepeat} = req.body
    psw = sanitizeHtml(psw);
    pswrepeat = sanitizeHtml(pswrepeat);
    const password = await bcrypt.hash(pswrepeat, 10)
        db.query("UPDATE accounts SET password = ? WHERE email = ?" ,[password, email_f], (err, result) => {
          if(err) throw err;
          var msg1 = '';
          var msg2 = 'Password changed Successfully!';
          var msg3 = 'Login to continue.';
          res.render("login",{message1:msg1, message2:msg2, message3:msg3});
          });	
  });

module.exports = router;