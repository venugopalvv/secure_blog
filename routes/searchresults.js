const router = require("express").Router();
const db = require('../databaseConnection');



//search 
router
.get("/searchresults", (req, res) => {
  const search = 'make';
  db.query('SELECT * FROM blogs WHERE (title LIKE ? OR message LIKE ? OR postedBy LIKE ? OR email LIKE ?)', ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'], (err, search_results) => {
    if(err) throw err;
    var search_count = search_results.length
    res.render("searchresults.ejs", {blogs:search_results, search_count:search_count});
  });
})

.post('/searchresults',(req,res)=>{  
  const { search} = req.body;
  db.query('SELECT * FROM blogs WHERE (title LIKE ? OR message LIKE ? OR postedBy LIKE ? OR email LIKE ?)', ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'], (err, search_results) => {
    if(err) throw err;
    var search_count = search_results.length
    res.render("searchresults.ejs", {blogs:search_results, search_count:search_count});
  });
})

.post('/searchloggedin',(req,res)=>{  
  if(typeof req.session.user !== 'undefined'){
  const { search} = req.body;
  db.query('SELECT * FROM blogs WHERE (title LIKE ? OR message LIKE ? OR postedBy LIKE ? OR email LIKE ?)', ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%'], (err, search_results) => {
    if(err) throw err;
    var search_count = search_results.length
    res.render("searchloggedin.ejs", {blogs:search_results, search_count:search_count});
  });
}
else{
  res.redirect("/");
};
})

module.exports = router;