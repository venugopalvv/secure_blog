const router = require("express").Router();
const db = require('../databaseConnection');
const bcrypt = require("bcrypt")

router
  .get("/registration", (req, res) => {
    var msg1 = 'User registration';
    var msg2 = '';
    var msg3 = '';
    res.render("registration",{message1:msg1, message2:msg2, message3:msg3});
  })

  .post("/registration", async (req, res) => {
      const { name, email, psw} = req.body;
      const password = await bcrypt.hash(psw, 10)
      db.query('SELECT * FROM accounts WHERE email = ?',[email], (err, results) => {
        if(err) throw err;
      if (results.length == 0){
      let account = {name:name, email:email, password: password}
      var sql = "INSERT INTO accounts (name, password, email)  VALUES (" + db.escape(name) + ",'" + password + "'," + db.escape(email) + ")";
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
      });

module.exports = router;