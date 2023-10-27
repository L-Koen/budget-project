/* Test the api and the endpoints */
// import supertest for endpoints, and import the app
const request = require('supertest');
const app = require('./index.js');

// This is my first time working with Jest.
// Ideally you remove this
describe('Sample Test', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
  })
  
// The basic endpoint should return 'Hello World' 
describe('test app', () => {
    it('should be that / is a valid route', async () => {
        const res = await request(app).get('/').expect(200);
        expect(res['text']).toBe('Hello World');        
    });
});

