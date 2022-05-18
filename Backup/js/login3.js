const router = require("express").Router();

router
  .get("/login3", (req, res) => {
    res.render("login3");
  })


module.exports = router;