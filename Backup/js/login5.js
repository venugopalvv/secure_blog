const router = require("express").Router();

router
  .get("/login5", (req, res) => {
    res.render("login5");
  })


module.exports = router;