// backend/models/Planting.js
const db = require('../config/db');

const Planting = {

  // Create a new planting
  create: async (data) => {
    const { farm_id, yam_variety, planting_date, number_of_mounds, notes } = data;
    const [result] = await db.execute(
      `INSERT INTO plantings (farm_id, yam_variety, planting_date, number_of_mounds, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [farm_id, yam_variety || 'Local Balugu', planting_date, number_of_mounds || null, notes || null]
    );
    return result;
  },

  // Get all plantings for a farm
  getByFarmId: async (farm_id) => {
    const [rows] = await db.execute(
      `SELECT p.*, pr.predicted_harvest_date, pr.days_remaining, 
              pr.confidence_percent, pr.generated_at
       FROM plantings p
       LEFT JOIN predictions pr ON p.planting_id = pr.planting_id
       WHERE p.farm_id = ?
       ORDER BY p.planting_date DESC`,
      [farm_id]
    );
    return rows;
  },

  // Get single planting
  getById: async (planting_id) => {
    const [rows] = await db.execute(
      `SELECT p.*, f.farm_name, f.soil_type, f.district,
              f.user_id, f.size_acres
       FROM plantings p
       JOIN farms f ON p.farm_id = f.farm_id
       WHERE p.planting_id = ?`,
      [planting_id]
    );
    return rows[0];
  },

  // Get all plantings for a user
  getByUserId: async (user_id) => {
    const [rows] = await db.execute(
      `SELECT p.*, f.farm_name, f.district, f.soil_type,
              pr.predicted_harvest_date, pr.days_remaining,
              pr.confidence_percent
       FROM plantings p
       JOIN farms f ON p.farm_id = f.farm_id
       LEFT JOIN predictions pr ON p.planting_id = pr.planting_id
       WHERE f.user_id = ?
       ORDER BY p.planting_date DESC`,
      [user_id]
    );
    return rows;
  },

  // Update planting status
  updateStatus: async (planting_id, status) => {
    const [result] = await db.execute(
      `UPDATE plantings SET status = ? WHERE planting_id = ?`,
      [status, planting_id]
    );
    return result;
  },

  // Delete planting
  delete: async (planting_id) => {
    const [result] = await db.execute(
      `DELETE FROM plantings WHERE planting_id = ?`,
      [planting_id]
    );
    return result;
  }

};

module.exports = Planting;