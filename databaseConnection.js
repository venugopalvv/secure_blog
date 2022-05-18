const mysql = require("mysql");

// MySQL database connection

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'datablog',
      password: '$ecurebl0g',
      database: 'secureblog'
    });
  
  db.connect((err) => {
    if(err){
      throw err;
    }
  console.log('Database Connected...')
  });

  module.exports = db