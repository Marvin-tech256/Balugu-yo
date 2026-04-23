// backend/config/db.js
const mysql  = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               parseInt(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
  connectTimeout:     30000,
  ssl:                { rejectUnauthorized: false },
});

// Test the connection only when not in test mode
if (process.env.NODE_ENV !== 'test') {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err.message);
      console.error('DB Config:', {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
      });
      return;
    }
    console.log('Database connected successfully!');
    connection.release();
  });
}

module.exports = pool.promise();