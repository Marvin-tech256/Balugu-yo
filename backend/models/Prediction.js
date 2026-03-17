// backend/models/Prediction.js
const db = require('../config/db');

const Prediction = {

  // Save a prediction
  create: async (data) => {
    const { planting_id, predicted_harvest_date, confidence_percent, days_remaining, prediction_basis } = data;
    const [result] = await db.execute(
      `INSERT INTO predictions 
        (planting_id, predicted_harvest_date, confidence_percent, days_remaining, prediction_basis)
       VALUES (?, ?, ?, ?, ?)`,
      [planting_id, predicted_harvest_date, confidence_percent, days_remaining, prediction_basis]
    );
    return result;
  },

  // Get prediction for a planting
  getByPlantingId: async (planting_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM predictions WHERE planting_id = ? 
       ORDER BY generated_at DESC LIMIT 1`,
      [planting_id]
    );
    return rows[0];
  },

  // Get all predictions for a user
  getByUserId: async (user_id) => {
    const [rows] = await db.execute(
      `SELECT pr.*, p.planting_date, p.yam_variety, p.status,
              f.farm_name, f.district
       FROM predictions pr
       JOIN plantings p ON pr.planting_id = p.planting_id
       JOIN farms f ON p.farm_id = f.farm_id
       WHERE f.user_id = ?
       ORDER BY pr.generated_at DESC`,
      [user_id]
    );
    return rows;
  },

  // Update days remaining (run daily)
  updateDaysRemaining: async (prediction_id, days_remaining) => {
    await db.execute(
      `UPDATE predictions SET days_remaining = ? WHERE prediction_id = ?`,
      [days_remaining, prediction_id]
    );
  }

};

module.exports = Prediction;