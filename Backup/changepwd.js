const router = require("express").Router();
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: false });
const uuidv1 = require('uuidv1');
const {uuid} = require('uuidv4')
router
  .get("/changepwd", csrfProtection, async (req, res,next) => {
    try {
      const sessionID = req.session
      const CSRF_TOKEN = uuid();
      SESSION_IDS[sessionID] = CSRF_TOKEN;
      //console.log(SESSION_IDS);
      res.render('changepwd', {CSRF_TOKEN: CSRF_TOKEN});
    } catch (error) {
      console.log(error)
      res.json({ status: 'error', error: ';))' })
    }
  })


  
  router.post('/changepwd', async(req, res) => {
  
      const {csrftoken, psw } = req.body;

      const sessionID = req.session
      console.log(req.session.id)
      console.log(csrftoken)
      if (SESSION_IDS[sessionID] && SESSION_IDS[sessionID] === csrfToken) {
          console.log("suceess")
          let account = {name:name, email:email, password: password}
          var sql = "INSERT INTO accounts (name, password, email)  VALUES (" + db.escape(name) + ",'" + password + "'," + db.escape(email) + ")";
          db.query(sql, account, (err, result) => {
          if(err) throw err;
          console.log(result);
          res.redirect("/");
           });
      } else {
          res.json({ status: 'nok', error: 'Invalid password' })
      }
  });
module.exports = router;