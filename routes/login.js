const router = require("express").Router();
const express = require("express")
const db = require('../databaseConnection');
const path = require('path')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const sessions = require('express-session');
const MySQLStore = require('express-mysql-session')(sessions);
const uuidv1 = require('uuidv1');
const otpGenerator = require('otp-generator');
var nodemailer = require('nodemailer');
const https = require('https')
global.OTP_gen = ''
global.OTP_attempt = 5
global.OTP_time = ''
global.minutesToAdd=1;
global.minutesToAddOTP=1;

router
  .get("/login", (req, res) => {
        var msg1 = '';
        var msg2 = 'Welcome back!';
        var msg3 = '';
        if(typeof req.session.user === 'undefined'){
        res.render("login",{message1:msg1, message2:msg2, message3:msg3});
        }
  })




const options = {                 // setting connection options
  host: 'localhost',
  user: 'root',
  password: 'venu@1982',
  database: 'secureblog',
};


const sessionStore = new MySQLStore( options);
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


var session;
const oneDay = 1000 * 300;
router.use(sessions({
  secret: uuidv1(),
  saveUninitialized:false,
  cookie: { maxAge: oneDay , httpOnly: true, secure: true, sameSite: true, },
  resave: false ,
store: sessionStore,
}));

var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
  user: 'bonyjohnomcr@gmail.com',
  pass: 'dtonaqcirzwlwquq'
}
});




router.post('/login', async (req, res) => {
const { email, psw } = req.body
db.query('SELECT * FROM accounts WHERE email = ?', [email], async function(error, results, fields) {
  if (error) throw error;

  if (results.length > 0 ) {
    var currentDate = new Date();
    var blocked_date = new Date(results[0].blocked_time)
    var futureDate = new Date(blocked_date.getTime() + minutesToAdd*60000);
    if (await bcrypt.compare(psw,results[0].password)) {
      if (currentDate > futureDate ) {
      session=req.session;
      session.userid=req.body.email;
      session.user=results[0].name;
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
        subject: 'Your One Time Password',
        text: 'Your onetime password to safely login in to your account is ' + OTP + '. OTP is secret and can be used only once. Therefore, do not disclose this to anyone.'
        }, (err, info) => {
          console.log(info.envelope);
          console.log(info.messageId);
        });
        msg1 = 'Validate OTP!'
        msg2 = ''
        msg3 = 'An OTP has been send to your registered email address'
        msg4 = 'OTP is valid only for 60 seconds.'
        res.render("loginotp.ejs",{email:email_addr, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4})
    }
    
    else {
      var msg1 = 'Your account is blocked because of multiple failed attempts!';
      var msg2 = '';
      var msg3 = 'Please try after some time.';
      res.render("login",{message1:msg1, message2:msg2, message3:msg3});
  }

  }
  else {
        var msg1 = 'You have entered an invalid username or password!';
        var msg2 = '';
        var msg3 = 'Please try again.';
        res.render("login",{message1:msg1, message2:msg2, message3:msg3});
  } 
}

else {
  var msg1 = 'You have entered an invalid username or password!';
  var msg2 = '';
  var msg3 = 'Please try again.';
  res.render("login",{message1:msg1, message2:msg2, message3:msg3});
}
})	
})



.get("/loginotp", (req, res) => {
    res.render("loginotp");
  })


.post('/loginotp', async (req, res) => {
  const {recieved_otp} = req.body

  var datenow = new Date();
  var gen_date = new Date(OTP_time)
  var nextdate = new Date(gen_date.getTime() + minutesToAddOTP*60000);

  if ((recieved_otp === OTP_gen) && (datenow < nextdate)){
    res.redirect("/indexloggedin");
  }
  else {
      const OTP = otpGenerator.generate(6,  {
      upperCaseAlphabets: false,
      lowerCaseAlphabets:false, 
      specialChars: false,
      });
      OTP_gen=OTP;
      OTP_time=new Date();
      OTP_attempt--
      var email_addr=req.session.userid;

      transporter.sendMail({
      from: 'youremail@gmail.com',
      to: email_addr,
      subject: 'Your One Time Password',
      text: 'Your onetime password to safely login in to your account is ' + OTP + '. OTP is secret and can be used only once. Therefore, do not disclose this to anyone.'
      }, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
      });

      if (OTP_attempt <= 0){
      msg1 = ''
      msg2 = 'Your account has been blocked temporarly!'
      msg3 = ''
      msg4 = 'Multiple failed attempts'
      blocked_time = new Date()
      db.query("UPDATE accounts SET blocked_time = ? WHERE email = ?",[blocked_time, email_addr], (err, result) => {
        if(err) throw err;
      res.render("loginotp.ejs",{email:email_addr, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4})
      });
      }
      else if (datenow > nextdate){
        msg1 = ''
        msg2 = 'OTP Expired! Please enter the new OTP.'
        msg3 = 'A new OTP has been send to your registered email address'
        msg4 = 'OTP is valid only for 60 seconds.'
        res.render("loginotp.ejs",{email:email_addr, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4})
      }
      else{
        msg1 = ''
        msg2 = 'OTP is invalid. Plesae enter correct OTP!'
        msg3 = 'A new OTP has been send to your registered email address'
        msg4 = 'OTP is valid only for 60 seconds.'
        res.render("loginotp.ejs",{email:email_addr, msg1:msg1, msg2:msg2, msg3:msg3, msg4:msg4})

      }
  }

})

.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

  
module.exports = router;