// backend/tests/api/auth.test.js
const request = require('supertest');
const app    = require('../../server');

// Test user data
const testUser = {
  full_name: 'Test Farmer',
  phone:     '+256799999999',
  pin:       '5678',
  role:      'farmer',
  district:  'Buikwe'
};

let authToken = '';

describe('🔐 AUTH API TESTS', () => {

  // ================================
  // REGISTER TESTS
  // ================================
  describe('POST /api/auth/register', () => {

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Account created successfully!');
      expect(res.body.user_id).toBeDefined();
    });

    it('should fail if phone already registered', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Phone number already registered');
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ full_name: 'Test Only' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with empty body', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

  });

  // ================================
  // LOGIN TESTS
  // ================================
  describe('POST /api/auth/login', () => {

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          phone: testUser.phone,
          pin:   testUser.pin
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.phone).toBe(testUser.phone);
      expect(res.body.user.role).toBe('farmer');

      // Save token for protected route tests
      authToken = res.body.token;
    });

    it('should fail with wrong PIN', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          phone: testUser.phone,
          pin:   '0000'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Incorrect PIN');
    });

    it('should fail with unregistered phone', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '+256000000000',
          pin:   '1234'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ phone: testUser.phone });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

  });

  // ================================
  // PROTECTED ROUTE TESTS
  // ================================
  describe('GET /api/auth/me', () => {

    it('should return user data with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.full_name).toBe(testUser.full_name);
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

  });

});

module.exports = { authToken: () => authToken };