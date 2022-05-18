const router = require("express").Router();

router
  .get("/loginafter", (req, res) => {
    res.render("loginafter");
  })


module.exports = router;