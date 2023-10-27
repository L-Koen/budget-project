const request = require('supertest');
const app = require('./index.js');


describe('Sample Test', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
  })
  

describe('test app', () => {
    it('should be that / is a valid route', async () => {
        const res = await request(app).get('/').expect(200);
    });
});