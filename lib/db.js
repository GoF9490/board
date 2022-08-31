var mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'dw9490',
    database : 'done'
  });
  db.connect();

  module.exports = db;