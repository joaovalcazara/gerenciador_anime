const mysql = require("mysql"); 
const db = mysql.createPool({
  host: "mysql",
  user: "root",
  password: "root",
  database: "animes_database"
})
 
module.exports = db;
