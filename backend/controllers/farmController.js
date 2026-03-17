// backend/controllers/farmController.js
const Farm = require('../models/Farm');

// CREATE FARM
const createFarm = async (req, res) => {
  try {
    const { farm_name, location, district, size_acres, soil_type, gps_lat, gps_lng } = req.body;

    if (!farm_name || !district) {
      return res.status(400).json({
        success: false,
        message: 'Farm name and district are required'
      });
    }

    const result = await Farm.create({
      user_id: req.user.user_id,
      farm_name,
      location,
      district,
      size_acres,
      soil_type: soil_type || 'loam',
      gps_lat,
      gps_lng
    });

    res.status(201).json({
      success: true,
      message: 'Farm created successfully!',
      farm_id: result.insertId
    });

  } catch (error) {
    console.error('Create farm error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET MY FARMS
const getMyFarms = async (req, res) => {
  try {
    const farms = await Farm.getByUserId(req.user.user_id);
    res.json({
      success: true,
      count: farms.length,
      farms
    });
  } catch (error) {
    console.error('Get farms error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET SINGLE FARM
const getFarm = async (req, res) => {
  try {
    const farm = await Farm.getById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Make sure farm belongs to the logged in user
    if (farm.user_id !== req.user.user_id && req.user.role === 'farmer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this farm'
      });
    }

    res.json({ success: true, farm });

  } catch (error) {
    console.error('Get farm error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET ALL FARMS (extension officer / admin)
const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.getAll();
    res.json({
      success: true,
      count: farms.length,
      farms
    });
  } catch (error) {
    console.error('Get all farms error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE FARM
const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.getById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    if (farm.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this farm'
      });
    }

    await Farm.update(req.params.id, req.body);
    res.json({ success: true, message: 'Farm updated successfully!' });

  } catch (error) {
    console.error('Update farm error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE FARM
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.getById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    if (farm.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this farm'
      });
    }

    await Farm.delete(req.params.id);
    res.json({ success: true, message: 'Farm deleted successfully!' });

  } catch (error) {
    console.error('Delete farm error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createFarm, getMyFarms, getFarm, getAllFarms, updateFarm, deleteFarm };