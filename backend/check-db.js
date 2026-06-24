const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'hopper.proxy.rlwy.net',
  port: 29635,
  user: 'root',
  password: 'WeFRMDxSbWoAGEeFOatUCLFqEyGeXNUy',
  ssl: { rejectUnauthorized: false },
  connectTimeout: 30000,
});

console.log('Attempting connection...');
conn.connect(err => {
  if (err) {
    console.error('Failed:', err.message);
    console.error('Code:', err.code);
    process.exit(1);
  }
  console.log('Connected!');
  conn.query('SHOW DATABASES', (e, r) => {
    if (e) console.error(e.message);
    else console.log('Databases:', JSON.stringify(r));
    conn.end();
  });
});
