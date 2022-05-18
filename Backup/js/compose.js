const router = require("express").Router();

router
  .get("/compose", (req, res) => {
    res.render("composeBlog");
  })


module.exports = router;