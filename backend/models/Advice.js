const db = require('../config/db');

const Advice = {
  // Create a new advice request
  async create(data) {
    const { farmer_id, farm_id, question } = data;
    const [result] = await db.execute(
      'INSERT INTO advice_requests (farmer_id, farm_id, question, status) VALUES (?, ?, ?, ?)',
      [farmer_id, farm_id || null, question, 'pending']
    );
    return result.insertId;
  },

  // Get all advice requests for extension officers in a district
  async getByDistrict(district) {
    const [rows] = await db.execute(`
      SELECT ar.advice_id, ar.farmer_id, ar.farm_id, ar.question, ar.response, ar.status, ar.created_at, ar.answered_at,
             u.full_name as farmer_name, u.phone as farmer_phone, f.farm_name, f.location
      FROM advice_requests ar
      JOIN users u ON ar.farmer_id = u.user_id
      LEFT JOIN farms f ON ar.farm_id = f.farm_id
      WHERE u.district = ?
      ORDER BY ar.status ASC, ar.created_at DESC
    `, [district]);
    return rows;
  },

  // Get advice requests for a specific farmer
  async getByFarmer(farmer_id) {
    const [rows] = await db.execute(`
      SELECT ar.advice_id, ar.question, ar.response, ar.status, ar.created_at, ar.answered_at, 
             f.farm_name, eo.full_name as officer_name, eo.phone as officer_phone
      FROM advice_requests ar
      LEFT JOIN farms f ON ar.farm_id = f.farm_id
      LEFT JOIN users eo ON ar.extension_officer_id = eo.user_id
      WHERE ar.farmer_id = ?
      ORDER BY ar.created_at DESC
    `, [farmer_id]);
    return rows;
  },

  // Get a single advice request
  async getById(advice_id) {
    const [rows] = await db.execute(`
      SELECT ar.*, 
             u.full_name as farmer_name, u.phone as farmer_phone,
             eo.full_name as officer_name, eo.phone as officer_phone
      FROM advice_requests ar
      JOIN users u ON ar.farmer_id = u.user_id
      LEFT JOIN users eo ON ar.extension_officer_id = eo.user_id
      WHERE ar.advice_id = ?`, [advice_id]
    );
    return rows[0] || null;
  },

  // Update advice with response
  async respond(advice_id, response, officer_id) {
    const [result] = await db.execute(
      'UPDATE advice_requests SET response = ?, status = ?, extension_officer_id = ?, answered_at = NOW() WHERE advice_id = ?',
      [response, 'answered', officer_id, advice_id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Advice;
