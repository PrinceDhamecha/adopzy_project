const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let ssl = undefined;
if (process.env.DB_SSL === 'true') {
  if (process.env.DB_CA) {
    ssl = { ca: process.env.DB_CA, rejectUnauthorized: true };
  } else {
    const caPath = path.join(__dirname, 'ca.pem');
    if (fs.existsSync(caPath)) {
      ssl = { ca: fs.readFileSync(caPath), rejectUnauthorized: true };
    } else {
      ssl = { rejectUnauthorized: false };
    }
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pet_adoption',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  ssl
});

module.exports = pool.promise();
