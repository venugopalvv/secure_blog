const router = require("express").Router();
const db = require('../databaseConnection');

router.get("/", async(req, res) => {
 
  db.query('SELECT * FROM blogs', (err, all_blogs1) => {
    if(err) throw err;
    db.query('SELECT * FROM blogs LIMIT ?',[1], (err, all_blogs2) => {
      if(err) throw err;
      db.query('SELECT * FROM blogs LIMIT ?',[5], (err, all_blogs3) => {
        if(err) throw err;
        res.render("index.ejs", {blogs:all_blogs1, top_blog1:all_blogs2, top_blogs:all_blogs3});
  });
  });
  });
  });
  module.exports = router;
