// backend/tests/api/farms.test.js
const request = require('supertest');
const app     = require('../../server');

let token = '';
let farmId = '';

// Login before tests
beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      phone: '+256707265146',
      pin:   '1234'
    });
  token = res.body.token;
});

describe('🌾 FARMS API TESTS', () => {

  // ================================
  // CREATE FARM
  // ================================
  describe('POST /api/farms', () => {

    it('should create a farm successfully', async () => {
      const res = await request(app)
        .post('/api/farms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          farm_name:  'Test Farm Plot A',
          district:   'Buikwe',
          location:   'Bukunja Village',
          size_acres: 3.5,
          soil_type:  'loam'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.farm_id).toBeDefined();

      farmId = res.body.farm_id;
    });

    it('should fail without farm name', async () => {
      const res = await request(app)
        .post('/api/farms')
        .set('Authorization', `Bearer ${token}`)
        .send({ district: 'Buikwe' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .post('/api/farms')
        .send({
          farm_name: 'No Auth Farm',
          district:  'Buikwe'
        });

      expect(res.statusCode).toBe(401);
    });

  });

  // ================================
  // GET MY FARMS
  // ================================
  describe('GET /api/farms/my', () => {

    it('should return all farms for logged in user', async () => {
      const res = await request(app)
        .get('/api/farms/my')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.farms)).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/api/farms/my');

      expect(res.statusCode).toBe(401);
    });

  });

  // ================================
  // GET SINGLE FARM
  // ================================
  describe('GET /api/farms/:id', () => {

    it('should return a single farm by ID', async () => {
      const res = await request(app)
        .get(`/api/farms/${farmId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.farm.farm_id).toBe(farmId);
    });

    it('should return 404 for non-existent farm', async () => {
      const res = await request(app)
        .get('/api/farms/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

  });

  // ================================
  // UPDATE FARM
  // ================================
  describe('PUT /api/farms/:id', () => {

    it('should update farm details', async () => {
      const res = await request(app)
        .put(`/api/farms/${farmId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          farm_name:  'Test Farm Updated',
          district:   'Mukono',
          location:   'Updated Village',
          size_acres: 4.0,
          soil_type:  'clay'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Farm updated successfully!');
    });

  });

  // ================================
  // DELETE FARM
  // ================================
  describe('DELETE /api/farms/:id', () => {

    it('should delete a farm', async () => {
      const res = await request(app)
        .delete(`/api/farms/${farmId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 after deletion', async () => {
      const res = await request(app)
        .get(`/api/farms/${farmId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

  });

});