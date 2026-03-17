// backend/tests/unit/prediction.test.js

// Copy the engine function here for unit testing
const calculateHarvestDate = (plantingData, weatherData) => {
  const BASE_DAYS = 270;
  const soilAdjustment = { loam: 0, clay: 10, sandy: -10 };
  let weatherAdjustment = 0;

  if (weatherData) {
    if (weatherData.avg_rainfall < 20)       weatherAdjustment += 15;
    else if (weatherData.avg_rainfall < 35)  weatherAdjustment += 7;
    if (weatherData.avg_temp_max > 32)       weatherAdjustment += 10;
    else if (weatherData.avg_temp_max > 28)  weatherAdjustment += 5;
    if (weatherData.avg_temp_max >= 24 &&
        weatherData.avg_temp_max <= 28)      weatherAdjustment -= 5;
  }

  const totalDays = BASE_DAYS +
    (soilAdjustment[plantingData.soil_type] || 0) +
    weatherAdjustment;

  const plantingDate = new Date(plantingData.planting_date);
  const harvestDate  = new Date(plantingDate);
  harvestDate.setDate(harvestDate.getDate() + totalDays);

  const today        = new Date();
  const daysRemaining = Math.ceil(
    (harvestDate - today) / (1000 * 60 * 60 * 24)
  );

  let confidence = 75;
  if (weatherData) confidence += 10;
  if (plantingData.soil_type !== 'loam') confidence -= 5;
  if (daysRemaining < 30) confidence += 10;
  confidence = Math.min(confidence, 95);

  return {
    predicted_harvest_date: harvestDate.toISOString().split('T')[0],
    days_remaining:         daysRemaining,
    confidence_percent:     confidence,
    total_days:             totalDays
  };
};

describe('🧠 PREDICTION ENGINE UNIT TESTS', () => {

  const goodWeather = { avg_rainfall: 38, avg_temp_max: 26 };
  const dryWeather  = { avg_rainfall: 15, avg_temp_max: 34 };
  const futureDate  = '2025-06-01';

  // ================================
  // BASE CALCULATION
  // ================================
  describe('Base harvest calculation', () => {

    it('should return 265 days for loam soil with good weather', () => {
      const result = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        goodWeather
      );
      expect(result.total_days).toBe(265);
    });

    it('should add 10 days for clay soil', () => {
      const result = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'clay' },
        goodWeather
      );
      expect(result.total_days).toBe(275);
    });

    it('should subtract 10 days for sandy soil', () => {
      const result = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'sandy' },
        goodWeather
      );
      expect(result.total_days).toBe(255);
    });

  });

  // ================================
  // WEATHER ADJUSTMENTS
  // ================================
  describe('Weather adjustments', () => {

    it('should add days for dry and hot weather', () => {
      const good = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        goodWeather
      );
      const dry = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        dryWeather
      );
      expect(dry.total_days).toBeGreaterThan(good.total_days);
    });

    it('should use 270 base days with no weather data', () => {
      const result = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        null
      );
      expect(result.total_days).toBe(270);
    });

  });

  // ================================
  // CONFIDENCE SCORE
  // ================================
  describe('Confidence score', () => {

    it('should be higher with weather data', () => {
      const withWeather = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        goodWeather
      );
      const noWeather = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        null
      );
      expect(withWeather.confidence_percent)
        .toBeGreaterThan(noWeather.confidence_percent);
    });

    it('should never exceed 95%', () => {
      const result = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        goodWeather
      );
      expect(result.confidence_percent).toBeLessThanOrEqual(95);
    });

    it('should be lower for non-loam soil', () => {
      const loam = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        goodWeather
      );
      const clay = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'clay' },
        goodWeather
      );
      expect(clay.confidence_percent)
        .toBeLessThan(loam.confidence_percent);
    });

  });

  // ================================
  // OUTPUT FORMAT
  // ================================
  describe('Output format', () => {

    it('should return a valid date string', () => {
      const result = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        goodWeather
      );
      expect(result.predicted_harvest_date)
        .toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return all required fields', () => {
      const result = calculateHarvestDate(
        { planting_date: futureDate, soil_type: 'loam' },
        goodWeather
      );
      expect(result).toHaveProperty('predicted_harvest_date');
      expect(result).toHaveProperty('days_remaining');
      expect(result).toHaveProperty('confidence_percent');
      expect(result).toHaveProperty('total_days');
    });

  });

});