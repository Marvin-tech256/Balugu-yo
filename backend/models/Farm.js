// backend/models/Farm.js
const db = require('../config/db');

const Farm = {

  // Create a new farm
  create: async (farmData) => {
    const { user_id, farm_name, location, district, size_acres, soil_type, gps_lat, gps_lng } = farmData;
    const [result] = await db.execute(
      `INSERT INTO farms (user_id, farm_name, location, district, size_acres, soil_type, gps_lat, gps_lng)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, farm_name, location, district, size_acres, soil_type, gps_lat || null, gps_lng || null]
    );
    return result;
  },

  // Get all farms for a specific user
  getByUserId: async (user_id) => {
    const [rows] = await db.execute(
      `SELECT f.*, 
        p.planting_id, p.planting_date, p.yam_variety, p.status,
        pr.predicted_harvest_date, pr.confidence_percent,
        CEIL(DATEDIFF(pr.predicted_harvest_date, CURDATE())) AS days_remaining
       FROM farms f
       LEFT JOIN plantings p ON f.farm_id = p.farm_id
       LEFT JOIN predictions pr ON p.planting_id = pr.planting_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [user_id]
    );
    return rows;
  },

  // Get single farm by ID
  getById: async (farm_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM farms WHERE farm_id = ?`,
      [farm_id]
    );
    return rows[0];
  },

  // Get all farms (extension officer / admin)
  getAll: async () => {
    const [rows] = await db.execute(
      `SELECT f.*, u.full_name, u.phone, u.district as user_district
       FROM farms f
       JOIN users u ON f.user_id = u.user_id
       ORDER BY f.created_at DESC`
    );
    return rows;
  },

  // Update farm
  update: async (farm_id, farmData) => {
    const { farm_name, location, district, size_acres, soil_type } = farmData;
    const [result] = await db.execute(
      `UPDATE farms SET farm_name=?, location=?, district=?, size_acres=?, soil_type=?
       WHERE farm_id=?`,
      [farm_name, location, district, size_acres, soil_type, farm_id]
    );
    return result;
  },

  // Delete farm
  delete: async (farm_id) => {
    const [result] = await db.execute(
      `DELETE FROM farms WHERE farm_id = ?`,
      [farm_id]
    );
    return result;
  }

};

module.exports = Farm;