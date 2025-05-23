const mysql = require('mysql');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "crmdb"
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

module.exports = db;
