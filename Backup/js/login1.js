const router = require("express").Router();

router
  .get("/login1", (req, res) => {
    res.render("login1");
  })


module.exports = router;