const router = require("express").Router();

router
  .get("/registration1", (req, res) => {
    res.render("registration1");
  })


module.exports = router;