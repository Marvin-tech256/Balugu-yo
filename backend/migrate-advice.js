require('dotenv').config();
const db = require('./config/db');

async function createAdviceTable() {
  try {
    console.log('Creating advice_requests table...');
    
    const sql = `
      CREATE TABLE IF NOT EXISTS advice_requests (
        advice_id INT AUTO_INCREMENT PRIMARY KEY,
        farmer_id INT NOT NULL,
        extension_officer_id INT,
        farm_id INT,
        question TEXT NOT NULL,
        response TEXT,
        status ENUM('pending', 'answered') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        answered_at TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (extension_officer_id) REFERENCES users(user_id) ON DELETE SET NULL,
        FOREIGN KEY (farm_id) REFERENCES farms(farm_id) ON DELETE SET NULL
      )
    `;

    await db.execute(sql);
    console.log('✅ advice_requests table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    process.exit(1);
  }
}

createAdviceTable();
