// backend/tests/setup.js
process.env.NODE_ENV = 'test';

const db = require('../config/db');

afterAll(async () => {
  await db.end().catch(() => {});
});