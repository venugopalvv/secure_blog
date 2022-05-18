const router = require("express").Router();

router
  .get("/composemsg", (req, res) => {
    res.render("composemessage");
  })


module.exports = router;