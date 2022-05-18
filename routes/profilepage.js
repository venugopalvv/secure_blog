const router = require("express").Router();
const db = require('../databaseConnection');




router.get("/profilepage", async(req, res) => {
  if(typeof req.session.user !== 'undefined'){
  db.query('SELECT * FROM blogs WHERE email = ?',[req.session.userid], (err, all_blogs) => {
    if(err) throw err;
    db.query('SELECT * FROM blogs LIMIT ?',[5], (err, latest_blogs) => {
      if(err) throw err;
        db.query('SELECT * FROM comments WHERE email = ?',[req.session.userid], (err, comments) => {
          if(err) throw err;
          
          blogs_count = all_blogs.length
          comments_count = comments.length
          res.render("profilepage.ejs", {blogs:all_blogs, top_blogs:latest_blogs, email:req.session.userid, username:req.session.user, blogs_count:blogs_count, comments_count:comments_count});
  });
  });
  });
  }else{
    res.redirect("/");
  };
  });

  module.exports = router;


  