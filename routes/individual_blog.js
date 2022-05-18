const router = require("express").Router();
const db = require('../databaseConnection');
const formatDate = require('./functions_req');
var sanitizeHtml = require('sanitize-html');

router
  .get("/blog/:id", (req, res) => {

    db.query('SELECT * FROM blogs WHERE id = ?',[req.params.id], (err, results1) => {
      if(err) throw err;
      db.query('SELECT * FROM blogs LIMIT ?',[3], (err, results2) => {
        if(err) throw err;
        db.query('SELECT * FROM comments WHERE id = ?',[req.params.id], (err, results3) => {
          if(err) throw err;
          if(typeof req.session.user === 'undefined'){
            var msg1 = ''
            var username = req.session.user
      res.render("individual_blog", {blogs: results1, blogs_recent: results2, comments:results3, msg1:msg1, username:username});
    }
    else{
      var msg1 = ''
      var username = req.session.user
      res.render("individual_blogloggedin", {blogs: results1, blogs_recent: results2, comments:results3, msg1:msg1, username:username});
    }
    });
    });
    });
    })
 
  .get("/delete/:id", (req, res) => {
    if(typeof req.session.user !== 'undefined'){
    db.query("DELETE FROM blogs WHERE id = ?",[req.params.id], (err, result) => {
      if(err) throw err;
      db.query("DELETE FROM comments WHERE id = ?",[req.params.id], (err, result) => {
        if(err) throw err;
        res.redirect("/profilepage")
    });
  });
  }
  else{
    res.redirect("/");
  };
  })


  .get("/edit/:id", (req, res) => {
    if(typeof req.session.user !== 'undefined'){
    db.query("SELECT * FROM blogs WHERE id = ?",[req.params.id], (err, result) => {
      if(err) throw err;
      var username = req.session.user;
      res.render("editblog", {blogs: result, username:username});
    });
  }else{
    res.redirect("/");
  };
  })

  .post("/edit/:id", (req, res) => {
    if(typeof req.session.user !== 'undefined'){
      var { title, message} = req.body;
      title = sanitizeHtml(title);
      message = sanitizeHtml(message);
    db.query("UPDATE blogs SET title = ?, message = ? WHERE id = ?",[title, message, req.params.id], (err, result) => {
      if(err) throw err;
      var username = req.session.user
      res.redirect("/profilepage");
    });
  }else{
    res.redirect("/");
  };
  })
  
  .post("/comment/:id", (req, res) => {
    var { comment, name, email} = req.body;
    comment = sanitizeHtml(comment);
    name = sanitizeHtml(name);
    email = sanitizeHtml(email);
    var d = new Date();
    var comment_date = formatDate(d)
    const id = req.params.id;
    let comment_query = {id:id, comment:comment, postedBy: name, email:email, postedAt: comment_date}
    db.query('INSERT INTO comments SET ?',comment_query, (err, result) => {
      if(err) throw err;
      res.redirect('/blog/' + req.params.id);
    });
  })

  .get("/delete/:id/:comment_id", (req, res) => {
    db.query("SELECT * FROM comments WHERE comment_id = ?",[req.params.comment_id], (err, result) => {
      if(err) throw err;

    if (req.session.userid == result[0].email){
    db.query("DELETE FROM comments WHERE comment_id = ?",[req.params.comment_id], (err, result) => {
      if(err) throw err;
      db.query('SELECT * FROM blogs WHERE id = ?',[req.params.id], (err, results1) => {
        if(err) throw err;
        db.query('SELECT * FROM blogs LIMIT ?',[3], (err, results2) => {
          if(err) throw err;
          db.query('SELECT * FROM comments WHERE id = ?',[req.params.id], (err, results3) => {
            if(err) throw err;
            var msg1 = ''
            var username = req.session.user
          res.render("individual_blogloggedin", {blogs: results1, blogs_recent: results2, comments:results3, msg1:msg1, username:username});
    })
    });
    });
    })
    }
    
    else if(typeof req.session.user !== 'undefined'){
      db.query('SELECT * FROM blogs WHERE id = ?',[req.params.id], (err, results1) => {
        if(err) throw err;
        db.query('SELECT * FROM blogs LIMIT ?',[3], (err, results2) => {
          if(err) throw err;
          db.query('SELECT * FROM comments WHERE id = ?',[req.params.id], (err, results3) => {
            if(err) throw err;
           var msg1 = 'Sorry! You are not allowed to delete comments posted by others.'
           var username = req.session.user
          res.render("individual_blogloggedin", {blogs: results1, blogs_recent: results2, comments:results3, msg1:msg1, username:username});
        })
      });
      });
    }
    else{
      res.redirect("/");
    };
    });
    })

module.exports = router;

