const router = require("express").Router();

router
  .get("/registration", (req, res) => {
    res.render("registration");
  })


module.exports = router;