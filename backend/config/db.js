// backend/config/db.js
const mysql  = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

let poolConfig;

if (process.env.MYSQL_URL) {
  const url = new URL(process.env.MYSQL_URL);
  poolConfig = {
    host:               url.hostname,
    port:               parseInt(url.port) || 3306,
    user:               url.username,
    password:           url.password,
    database:           url.pathname.replace('/', ''),
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    connectTimeout:     30000,
    ssl:                { rejectUnauthorized: false },
  };
} else {
  poolConfig = {
    host:               process.env.DB_HOST,
    port:               parseInt(process.env.DB_PORT) || 3306,
    user:               process.env.DB_USER,
    password:           process.env.DB_PASSWORD,
    database:           process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    connectTimeout:     30000,
    ssl:                { rejectUnauthorized: false },
  };
}

const pool = mysql.createPool(poolConfig);

if (process.env.NODE_ENV !== 'test') {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err.message);
      console.error('DB Config used:', {
        host:     poolConfig.host,
        port:     poolConfig.port,
        user:     poolConfig.user,
        database: poolConfig.database,
        password_set: !!poolConfig.password,
      });
      return;
    }
    console.log('Database connected successfully!');
    connection.release();
  });
}

module.exports = pool.promise();