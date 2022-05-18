const router = require("express").Router();
const db = require('../databaseConnection');

router.get("/indexloggedin", async(req, res) => {
  if(typeof req.session.user !== 'undefined'){ 
  db.query('SELECT * FROM blogs', (err, all_blogs1) => {
    if(err) throw err;
    db.query('SELECT * FROM blogs LIMIT ?',[1], (err, all_blogs2) => {
      if(err) throw err;
      db.query('SELECT * FROM blogs LIMIT ?',[5], (err, all_blogs3) => {
        if(err) throw err;
        var username = req.session.user
          res.render("indexloggedin.ejs", {blogs:all_blogs1, top_blog1:all_blogs2, top_blogs:all_blogs3, username:username});
  });
  });
  });
  }else{
    res.redirect("/");
  };
  });

  module.exports = router;