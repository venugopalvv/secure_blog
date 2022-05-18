const router = require("express").Router();
const db = require('../databaseConnection');
const formatDate = require('./functions_req');


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
    const { title, message, category, image} = req.body;

    var d = new Date();
    var blog_date = formatDate(d)
    
    let blog = {title:title, message:message, postedBy: req.session.user, postedAt: blog_date, category: category, Image:image, email:req.session.userid}
    let sql = 'INSERT INTO blogs SET ?';
      
    if(typeof req.session.user !== 'undefined'){  
    db.query(sql, blog, (err, result) => {
      if(err) throw err;
      var username = req.session.user
      res.render("indexloggedin", {username:username});
    });
    }
    else{
      res.redirect("/");
    };
    });

module.exports = router;