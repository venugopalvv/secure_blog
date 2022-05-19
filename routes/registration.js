const router = require("express").Router();
const db = require('../databaseConnection');
const bcrypt = require("bcrypt")
var sanitizeHtml = require('sanitize-html');
var nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: false });
global.OTP_gen_f = ''
global.OTP_attempt_f = 5
global.OTP_time_f = ''
global.minutesToAddOTP_f=1;
global.minutesToAddOTP_f=1;
var name_f = '';
var email_f = '';
var psw_f = '';

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seclyblog@gmail.com',
    pass: 'pdfgfonetuuzeftm'
  }
  });

router
  .get("/registration", (req, res) => {
    var msg1 = 'User registration';
    var msg2 = '';
    var msg3 = '';
    res.render("registration",{message1:msg1, message2:msg2, message3:msg3});
  })

  .post("/registration", async (req, res) => {
      var { name, email, psw} = req.body;
      name_f = sanitizeHtml(name);
      email_f = sanitizeHtml(email);
      psw_f = sanitizeHtml(psw);

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
        subject: 'Your OTP for Email verification',
        text: 'Your onetime password for email verification is ' + OTP + '. OTP is secret and can be used only once. Therefore, do not disclose this to anyone.'
        }, (err, info) => {
          console.log(info.envelope);
          console.log(info.messageId);
        });
        msg1 = 'Validate OTP!'
        msg2 = ''
        msg3 = 'An OTP has been send to your email address'
        msg4 = 'OTP is valid only for 60 seconds.'
        res.render("registrationotp.ejs",{email:email_f, name:name_f, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4})
      })


  .get("/registrationotp", (req, res) => {
    res.redirect("/registrationotp");
  })

  .post("/registrationotp", async(req, res) => {
    var {recieved_otp} = req.body
    recieved_otp = sanitizeHtml(recieved_otp);
    var datenow = new Date();
    var gen_date = new Date(OTP_time_f)
    var nextdate = new Date(gen_date.getTime() + minutesToAddOTP_f*60000);

    if ((recieved_otp === OTP_gen_f) && (datenow < nextdate)){
      const password = await bcrypt.hash(psw_f, 10)
      db.query('SELECT * FROM accounts WHERE email = ?',[email_f], (err, results) => {
        if(err) throw err;
      if (results.length == 0){
        let blocked_status = 'Block'
      let account = {name_f:name_f, email_f:email_f, password: password, blocked_status:blocked_status}

      var sql = "INSERT INTO accounts (name, password, email, blocked_status)  VALUES (" + db.escape(name_f) + ",'" + password + "'," + db.escape(email_f) + ",'" + blocked_status + "')";
      db.query(sql, account, (err, result) => {
        if(err) throw err;
        var msg1 = '';
        var msg2 = 'User registration Successful!';
        var msg3 = 'Thank you for registering with us, Login to post your stories.';
        res.render("login",{message1:msg1, message2:msg2, message3:msg3});
      });
      }
      else{
        var msg1 = '';
        var msg2 = 'User Already exists.';
        var msg3 = 'Please try with a different email ID to proceed';
        res.render("registration",{message1:msg1, message2:msg2, message3:msg3});
      };
      });
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
        transporter.sendMail({
        from: 'youremail@gmail.com',
        to: email_f,
        subject: 'Your OTP for Email verification',
        text: 'Your onetime password for email verification is ' + OTP + '. OTP is secret and can be used only once. Therefore, do not disclose this to anyone.'
        }, (err, info) => {
          console.log(info.envelope);
          console.log(info.messageId);
        });
        if (datenow > nextdate){
          msg1 = ''
          msg2 = 'OTP Expired! Please enter the new OTP.'
          msg3 = 'A new OTP has been send to your registered email address'
          msg4 = 'OTP is valid only for 60 seconds.'
          res.render("registrationotp.ejs",{email:email_f, name:name_f, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4});
        }
        else{
          msg1 = ''
          msg2 = 'OTP is invalid. Plesae enter correct OTP!'
          msg3 = 'A new OTP has been send to your registered email address'
          msg4 = 'OTP is valid only for 60 seconds.'
          res.render("registrationotp.ejs",{email:email_f, name:name_f, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4});
  
        }
    }
  });  

module.exports = router;