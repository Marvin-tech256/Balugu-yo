// backend/controllers/weatherController.js
const axios = require('axios');
const db = require('../config/db');

// District to city mapping for Uganda
const districtCityMap = {
  'Buikwe':    'Lugazi,UG',
  'Bukunja':   'Lugazi,UG',
  'Mukono':    'Mukono,UG',
  'Kampala':   'Kampala,UG',
  'Jinja':     'Jinja,UG',
  'Mbale':     'Mbale,UG',
  'Masaka':    'Masaka,UG',
  'Mbarara':   'Mbarara,UG',
  'default':   'Kampala,UG'
};

// GET CURRENT WEATHER FOR A DISTRICT
const getCurrentWeather = async (req, res) => {
  try {
    const { district } = req.params;
    const city = districtCityMap[district] || districtCityMap['default'];
    const apiKey = process.env.WEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = response.data;

    const weather = {
      district,
      city: data.name,
      temperature: {
        current: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max)
      },
      humidity: data.main.humidity,
      rainfall_mm: data.rain ? data.rain['1h'] || 0 : 0,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      timestamp: new Date()
    };

    // Save to database
    await db.execute(
      `INSERT INTO weather_data 
        (district, recorded_date, rainfall_mm, temp_max, temp_min, humidity_percent, condition_text)
       VALUES (?, CURDATE(), ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        rainfall_mm=VALUES(rainfall_mm),
        temp_max=VALUES(temp_max),
        temp_min=VALUES(temp_min),
        humidity_percent=VALUES(humidity_percent),
        condition_text=VALUES(condition_text)`,
      [district, weather.rainfall_mm, weather.temperature.max,
       weather.temperature.min, weather.humidity, weather.condition]
    );

    res.json({ success: true, weather });

  } catch (error) {
    console.error('Weather error:', error.message);

    // Return fallback data if API fails
    res.json({
      success: true,
      weather: {
        district: req.params.district,
        temperature: { current: 24, min: 19, max: 28 },
        humidity: 68,
        rainfall_mm: 5,
        condition: 'Partly Cloudy',
        description: 'typical Uganda weather',
        note: 'Using estimated data — connect to internet for live weather'
      }
    });
  }
};

// GET 5-DAY FORECAST
const getForecast = async (req, res) => {
  try {
    const { district } = req.params;
    const city = districtCityMap[district] || districtCityMap['default'];
    const apiKey = process.env.WEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=40`
    );

    // Group by day
    const dailyMap = {};
    response.data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          temps: [],
          rainfall: 0,
          conditions: []
        };
      }
      dailyMap[date].temps.push(item.main.temp);
      dailyMap[date].rainfall += item.rain ? item.rain['3h'] || 0 : 0;
      dailyMap[date].conditions.push(item.weather[0].main);
    });

    // Build clean forecast array
    const forecast = Object.values(dailyMap).slice(0, 7).map(day => ({
      date: day.date,
      temp_max: Math.round(Math.max(...day.temps)),
      temp_min: Math.round(Math.min(...day.temps)),
      rainfall_mm: Math.round(day.rainfall * 10) / 10,
      condition: day.conditions[0],
      icon: day.conditions[0].toLowerCase()
    }));

    res.json({ success: true, district, forecast });

  } catch (error) {
    console.error('Forecast error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Could not fetch forecast. Check your API key.'
    });
  }
};

// GET WEATHER IMPACT ON YAMS
const getWeatherImpact = async (req, res) => {
  try {
    const { district } = req.params;
    const city = districtCityMap[district] || districtCityMap['default'];
    const apiKey = process.env.WEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const temp = response.data.main.temp;
    const humidity = response.data.main.humidity;
    const rainfall = response.data.rain ? response.data.rain['1h'] || 0 : 0;

    // Assess impact on yam growth
    const impact = {
      soil_moisture: humidity > 70 ? 'Good' : humidity > 50 ? 'Moderate' : 'Low',
      growth_rate: temp >= 22 && temp <= 28 ? 'Optimal' : temp > 28 ? 'Stressed' : 'Slow',
      pest_risk: humidity > 80 && temp > 25 ? 'High' : humidity > 70 ? 'Moderate' : 'Low',
      harvest_recommendation: null
    };

    // Harvest recommendation
    if (rainfall > 10) {
      impact.harvest_recommendation = 'Delay harvest — heavy rain may cause tuber rot';
    } else if (temp > 32) {
      impact.harvest_recommendation = 'Harvest early morning to avoid heat stress';
    } else {
      impact.harvest_recommendation = 'Conditions are suitable for harvesting';
    }

    res.json({ success: true, district, impact, current_temp: temp,
               current_humidity: humidity, current_rainfall: rainfall });

  } catch (error) {
    console.error('Impact error:', error.message);
    res.status(500).json({ success: false, message: 'Could not assess weather impact' });
  }
};

module.exports = { getCurrentWeather, getForecast, getWeatherImpact };