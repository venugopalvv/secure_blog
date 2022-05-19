const router = require("express").Router();
const db = require('../databaseConnection');
const formatDate = require('./functions_req');
var sanitizeHtml = require('sanitize-html');


  router
  .get("/composeblog", (req, res) => {
    if(typeof req.session.user !== 'undefined'){ 
    var username = req.session.user
    res.render("composeblog", {username:username});
  }else{
    res.redirect("/");
  };
  })

  .post("/composeblog", (req, res) => {
    var { title, message, category, image} = req.body;
    title = sanitizeHtml(title);
    message = sanitizeHtml(message);
    var d = new Date();
    var blog_date = formatDate(d)
    let random1 = Math.random();
    let blog = {title:title, message:message, postedBy: req.session.user, postedAt: blog_date, category: category, Image:image, email:req.session.userid, random:random1}
    let sql = 'INSERT INTO blogs SET ?';
      
    if(typeof req.session.user !== 'undefined'){  
    db.query(sql, blog, (err, result) => {
      if(err) throw err;
      var username = req.session.user
      res.redirect("/indexloggedin");
    });
    }
    else{
      res.redirect("/");
    };
    });

module.exports = router;