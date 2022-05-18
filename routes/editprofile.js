const router = require("express").Router();

router
  .get("/editprofile", (req, res) => {
    if(typeof req.session.user !== 'undefined'){ 
    var username = req.session.user
    res.render("editprofile", {username:username});
  }else{
    res.redirect("/");
  };
  })


module.exports = router;