/* Test the api and the endpoints */
// import supertest for endpoints, and import the app
const request = require('supertest');
const app = require('./index.js');

// Import envelopes for testing
const { envelopes, Envelope } = require('./envelopes.js');

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

describe('get all envelopes', () => {
  it('should be that get /envelopes returns the envelopes as json', async () => {
    const res = await request(app).get('/envelopes').expect(200);
    expect(res.body).toEqual(envelopes);
  });
});

describe('get envelope by id', () => {
  it('should be possible to get an envelope by id', async () => {
    for (let i = 0; i < envelopes.length; i++) {
      const res = await request(app).get(`/envelopes/${i}`).expect(200);
      expect(res.body).toEqual(envelopes[i]);
    }
  });

  it('should return a 404 if the id is invalid', async () => {
    const testOutOfRange = await request(app).get(`/envelopes/${envelopes.length}`).expect(404);
    expect(testOutOfRange.text).toEqual('Envelope not found!');
    const teststring = await request(app).get(`/envelopes/blabla`).expect(404);
    const testNaN = await request(app).get(`/envelopes/NaN`).expect(404);
    const testFloat = await request(app).get(`/envelopes/0.5`).expect(404);
  });
});

describe('Updating envelopes by id', () => {
  it('should be possible to update them with the right JSON', async () => {
    const newHouse = {name: 'house', budget: 400};
    const res = await request(app).put('/envelopes/0').send(newHouse).expect(200);
    newHouse.id = 0;
    expect(res.body).toEqual(newHouse);
  });

  it('should detect bad input', async () => {
    const duplicateName = {name: 'house', budget: 400};
    const resDuplicateName = await request(app).put('/envelopes/1').send(duplicateName).expect(400);
  });
});