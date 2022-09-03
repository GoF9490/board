const mysql = require('mysql');

let db = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : '',
    charset  : 'utf8'
});
db.connect();

module.exports = db;