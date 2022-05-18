const express = require("express");
const { connect } = require("./routes/index");
var db = require('./databaseConnection');
const app = express();
const mysql = require('mysql');
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const https = require('https')
const fs = require('fs')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: false });
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const MySQLStore = require('express-mysql-session')(sessions);
const uuid = require('uuid');
var sanitizeHtml = require('sanitize-html');
//const {uuid} = require('uuidv4');

let ejs = require('ejs');

const options = {                 // setting connection options
  host: 'localhost',
  user: 'datablog',
  password: '$ecurebl0g',
  database: 'secureblog',
};

const sessionStore = new MySQLStore( options);
const SESSION_IDS = {};

var session;
const oneDay = 1000 * 300;
app.use(sessions({
    secret: uuid.v4(),
    saveUninitialized:false,
    cookie: { maxAge: oneDay , httpOnly: true, secure: true, sameSite: true, },
    resave: false ,
	store: sessionStore,
}));



// Create database
app.get('/createdb', (req,res) => {
  let sql = 'CREATE DATABASE secureblog';
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send('Database created...')
  });
});

// Create Blog Table
app.get('/createdbtable', (req,res) => {
  let sql = 'CREATE TABLE blogs(id int AUTO_INCREMENT, title VARCHAR(255), message TEXT(65535), postedBy VARCHAR(255), postedAt VARCHAR(255), category VARCHAR(255), Image BLOB, email VARCHAR(255), PRIMARY KEY (id))';
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send('Database table created...');
  });
});

// Create Comment Table
app.get('/createdbtable1', (req,res) => {
  let sql = 'CREATE TABLE comments(comment_id int AUTO_INCREMENT, id int, comment TEXT(65535), postedBy VARCHAR(255), email VARCHAR(255), postedAt VARCHAR(255), PRIMARY KEY (comment_id))';
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send('Database table created...');
  });
});

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");



app.use(require("./routes/login"))
app
  .get("/changepwd", csrfProtection, async (req, res,next) => {
    try {
      //console.log(CSRF_TOKEN);
      var username = req.session.user
      res.render('changepwd', {CSRF_TOKEN: req.csrfToken(), username:username});
    } catch (error) {
      res.json({ status: 'error', error: ';))' })
    }
  })


  
  app.post('/changepwd', csrfProtection,async (req, res) => {
    var {_csrf,pswcurrent,psw,pswrepeat} = req.body
    pswcurrent = sanitizeHtml(pswcurrent);
    psw = sanitizeHtml(psw);
    pswrepeat = sanitizeHtml(pswrepeat);
    const sessionID = req.session
    db.query('SELECT * FROM accounts WHERE email = ?', [req.session.userid], async function(error, results, fields) {
    if (error) throw error;
    if (results.length > 0 ) {
      if (await bcrypt.compare(pswcurrent,results[0].password)) {
        const password = await bcrypt.hash(pswrepeat, 10)
        session=req.session;
        db.query("UPDATE accounts SET password = ? WHERE email = ?" ,[password, results[0].email], (err, result) => {
          if(err) throw err;
          var msg1 = '';
          var msg2 = 'Password changed Successfully!';
          var msg3 = 'Login to continue.';
          res.render("login",{message1:msg1, message2:msg2, message3:msg3});
          });

      }
    }
    else {
      return res.json({ status: 'error', error: 'Invalid username/password' });
    } 			
    
  });
    

  });

// Routes
app.use(require("./routes/index"))
app.use(require("./routes/composeblog"))
app.use(require("./routes/registration"))
app.use(require("./routes/individual_blog"))
app.use(require("./routes/forgotpwd"))
app.use(require("./routes/profilepage"))
app.use(require("./routes/editprofile"))
app.use(require("./routes/searchresults"))
app.use(require("./routes/indexloggedin"))




// Server Configuration
https.createServer({
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.cert')
  }, app).listen(3000, () => {
	console.log('Listening...')
  })

//app.listen(3000, () => {console.log("Server started listening on port: 3000")});


