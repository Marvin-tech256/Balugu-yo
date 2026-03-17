// backend/controllers/predictionController.js
const Planting = require('../models/Planting');
const Prediction = require('../models/Prediction');
const Farm = require('../models/Farm');

// =============================================
// THE PREDICTION ENGINE
// Balugu takes ~270 days (9 months) base time
// Adjusted by soil type, rainfall, temperature
// =============================================

const calculateHarvestDate = (plantingData, weatherData) => {

  // Base maturity days for Balugu yam
  const BASE_DAYS = 270;

  // Soil type adjustment
  const soilAdjustment = {
    loam: 0,       // ideal — no adjustment
    clay: 10,      // clay retains water — slightly longer
    sandy: -10     // sandy drains fast — slightly shorter
  };

  // Weather adjustments
  let weatherAdjustment = 0;

  if (weatherData) {
    // Low rainfall slows growth
    if (weatherData.avg_rainfall < 20) weatherAdjustment += 15;
    else if (weatherData.avg_rainfall < 35) weatherAdjustment += 7;

    // High temperature stress
    if (weatherData.avg_temp_max > 32) weatherAdjustment += 10;
    else if (weatherData.avg_temp_max > 28) weatherAdjustment += 5;

    // Good temperature range speeds up growth
    if (weatherData.avg_temp_max >= 24 && weatherData.avg_temp_max <= 28) {
      weatherAdjustment -= 5;
    }
  }

  // Calculate total days
  const totalDays = BASE_DAYS +
    (soilAdjustment[plantingData.soil_type] || 0) +
    weatherAdjustment;

  // Calculate predicted harvest date
  const plantingDate = new Date(plantingData.planting_date);
  const harvestDate = new Date(plantingDate);
  harvestDate.setDate(harvestDate.getDate() + totalDays);

  // Calculate days remaining from today
  const today = new Date();
  const daysRemaining = Math.ceil(
    (harvestDate - today) / (1000 * 60 * 60 * 24)
  );

  // Calculate confidence based on data available
  let confidence = 75; // base confidence
  if (weatherData) confidence += 10;
  if (plantingData.soil_type !== 'loam') confidence -= 5;
  if (daysRemaining < 30) confidence += 10; // closer = more accurate
  confidence = Math.min(confidence, 95); // max 95%

  // Build explanation
  const basis = `Base maturity: ${BASE_DAYS} days. ` +
    `Soil adjustment (${plantingData.soil_type}): ${soilAdjustment[plantingData.soil_type] || 0} days. ` +
    `Weather adjustment: ${weatherAdjustment} days. ` +
    `Total: ${totalDays} days from planting date.`;

  return {
    predicted_harvest_date: harvestDate.toISOString().split('T')[0],
    days_remaining: daysRemaining,
    confidence_percent: confidence,
    total_days: totalDays,
    prediction_basis: basis
  };
};

// ADD PLANTING + GENERATE PREDICTION
const addPlanting = async (req, res) => {
  try {
    const { farm_id, yam_variety, planting_date, number_of_mounds, notes } = req.body;

    if (!farm_id || !planting_date) {
      return res.status(400).json({
        success: false,
        message: 'Farm ID and planting date are required'
      });
    }

    // Check farm belongs to user
    const farm = await Farm.getById(farm_id);
    if (!farm || farm.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Farm not found or not authorized'
      });
    }

    // Save planting
    const plantingResult = await Planting.create({
      farm_id,
      yam_variety,
      planting_date,
      number_of_mounds,
      notes
    });

    const planting_id = plantingResult.insertId;

    // Generate prediction
    const plantingData = {
      planting_date,
      soil_type: farm.soil_type
    };

    // Use average weather for now (will connect to API in Phase 7)
    const defaultWeather = {
      avg_rainfall: 38,
      avg_temp_max: 26
    };

    const prediction = calculateHarvestDate(plantingData, defaultWeather);

    // Save prediction to database
    await Prediction.create({
      planting_id,
      predicted_harvest_date: prediction.predicted_harvest_date,
      confidence_percent: prediction.confidence_percent,
      days_remaining: prediction.days_remaining,
      prediction_basis: prediction.prediction_basis
    });

    res.status(201).json({
      success: true,
      message: 'Planting recorded and harvest date predicted!',
      planting_id,
      prediction: {
        predicted_harvest_date: prediction.predicted_harvest_date,
        days_remaining: prediction.days_remaining,
        confidence_percent: prediction.confidence_percent,
        total_days: prediction.total_days,
        prediction_basis: prediction.prediction_basis
      }
    });

  } catch (error) {
    console.error('Add planting error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET MY PLANTINGS
const getMyPlantings = async (req, res) => {
  try {
    const plantings = await Planting.getByUserId(req.user.user_id);
    res.json({
      success: true,
      count: plantings.length,
      plantings
    });
  } catch (error) {
    console.error('Get plantings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET PREDICTION FOR A PLANTING
const getPrediction = async (req, res) => {
  try {
    const planting = await Planting.getById(req.params.planting_id);

    if (!planting) {
      return res.status(404).json({
        success: false,
        message: 'Planting not found'
      });
    }

    if (planting.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const prediction = await Prediction.getByPlantingId(req.params.planting_id);

    res.json({
      success: true,
      planting,
      prediction
    });

  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET ALL MY PREDICTIONS
const getMyPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.getByUserId(req.user.user_id);
    res.json({
      success: true,
      count: predictions.length,
      predictions
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { addPlanting, getMyPlantings, getPrediction, getMyPredictions };