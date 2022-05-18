const router = require("express").Router();
const db = require('../databaseConnection');

router
  .get("/composeblog1", (req, res) => {
    res.render("composeblog1.ejs");
  })
  
  .post("/composeblog1", (req, res) => {
    const { title, message } = req.body;

    if (!title || !message)
      return res.send("Please enter all the required credentials!");
      console.log('hi');
    
      let blog = {title:title, message:message, postedBy: 'Venugopal', postedAt: '28-04-2022'}
      let sql = 'INSERT INTO blogs SET ?';
      db.query(sql, blog, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.redirect("/");
    });
  });

module.exports = router;