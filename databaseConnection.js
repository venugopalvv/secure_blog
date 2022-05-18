const mysql = require("mysql");

// MySQL database connection

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'venu@1982',
      database: 'secureblog'
    });
  
  db.connect((err) => {
    if(err){
      throw err;
    }
  console.log('Database Connected...')
  });

  module.exports = db