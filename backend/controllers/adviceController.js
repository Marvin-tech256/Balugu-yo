const Advice = require('../models/Advice');

exports.askAdvice = async (req, res) => {
  try {
    const { farm_id, question } = req.body;
    const farmer_id = req.user.user_id;

    if (!question || question.trim().length === 0) {
      return res.json({ success: false, message: 'Question cannot be empty' });
    }

    const advice_id = await Advice.create({
      farmer_id,
      farm_id: farm_id || null,
      question: question.trim(),
    });

    res.json({ success: true, advice_id, message: 'Question submitted to extension officer' });
  } catch (error) {
    console.error('[askAdvice] Error:', error.message, error.stack);
    res.json({ success: false, message: 'Failed to submit question: ' + error.message });
  }
};

exports.getMyAdvice = async (req, res) => {
  try {
    const farmer_id = req.user.user_id;
    const advice = await Advice.getByFarmer(farmer_id);
    res.json({ success: true, advice });
  } catch (error) {
    console.error('[getMyAdvice]', error);
    res.json({ success: false, message: 'Failed to fetch advice', advice: [] });
  }
};

exports.getAdviceRequests = async (req, res) => {
  try {
    const district = req.user.district;
    const requests = await Advice.getByDistrict(district);
    res.json({ success: true, requests });
  } catch (error) {
    console.error('[getAdviceRequests]', error);
    res.json({ success: false, message: 'Failed to fetch requests', requests: [] });
  }
};

exports.respondToAdvice = async (req, res) => {
  try {
    const { advice_id, response } = req.body;
    const officer_id = req.user.user_id;

    if (!response || response.trim().length === 0) {
      return res.json({ success: false, message: 'Response cannot be empty' });
    }

    const advice = await Advice.getById(advice_id);
    if (!advice) {
      return res.json({ success: false, message: 'Advice request not found' });
    }

    const updated = await Advice.respond(advice_id, response.trim(), officer_id);
    if (updated) {
      res.json({ success: true, message: 'Response sent to farmer' });
    } else {
      res.json({ success: false, message: 'Failed to send response' });
    }
  } catch (error) {
    console.error('[respondToAdvice]', error);
    res.json({ success: false, message: 'Failed to respond to advice' });
  }
};
