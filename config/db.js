// const mysql = require('mysql');
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "admin",
//   database: "crmdb"
// });

// db.connect(err => {
//   if (err) {
//     console.error('MySQL connection failed:', err);
//     process.exit(1);
//   }
//   console.log('Connected to MySQL');
// });

// module.exports = db;

// aws aws 
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,   // RDS endpoint
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err.message);
    return;
  }
  console.log("DB connected");
});


module.exports = db;
