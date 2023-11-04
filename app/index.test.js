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
      expect(res.body).toEqual(envelopes[i].makePublic());
    }
  });

  it('should return a 404 if the id is invalid', async () => {
    const testOutOfRange = await request(app).get(`/envelopes/${envelopes.length}`).expect(404);
    expect(testOutOfRange.text).toEqual('Envelope does not exist!');
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
    expect(resDuplicateName.text).toEqual('Name already exists!');
    const noName = {name: '', budget: 400};
    const resNoName = await request(app).put('/envelopes/1').send(noName).expect(400);
    const wrong = {different: 'object', no: 'envelope'};
    const resWrong = await request(app).put('/envelopes/1').send(wrong).expect(400);
  });  
});

describe('Creating new envelopes', () => {
  it('works with the right input', async () => {
    const testEnvelope = {name: 'test', budget: 0};
    const response = await request(app).post('/envelopes').send(testEnvelope).expect(201);
    expect(response.body.name).toEqual(testEnvelope.name);
    expect(response.body.budget).toEqual(testEnvelope.budget);
  });

  it('fails with wrong input', async () => {
    let testEnvelope = {name: 'house', budget: 0};
    let response = await request(app).post('/envelopes').send(testEnvelope).expect(400);
    let testEnvelope1 = {name: 'test', budget: -1000};
    let response1 = await request(app).post('/envelopes').send(testEnvelope1).expect(400);
    let testEnvelope2 = {toe: 'house', shoe: 0};
    let response2 = await request(app).post('/envelopes').send(testEnvelope2).expect(400);
  })
});

describe('Deleting envelopes by id', () => {
  it('should be possible to delete empty envelopes by id', async () => {
    const testId = Envelope.selectName('test').id;
    const respone = await request(app).delete(`/envelopes/${testId}`).expect(204);
  });

  it('fails if the envelope is not empty', async () => {
    const response = await request(app).delete('/envelopes/0').expect(400);
  });
});

describe('Transferring between envelopes', () => {
  it('is possible to transfer between envelopes', async () => {
    const amount = {amount: 50};
    const response = await request(app).post('/envelopes/transfer/0/1').send(amount).expect(200);
  });
  it('is not possible if an envelope does not exist', async () => {
    const amount = {amount: 50};
    const response = await request(app).post('/envelopes/transfer/0/1000').send(amount).expect(400);
  });
  it('is not possible if the amount is not valid', async () => {
    const amount = {amount: -50};
    const response = await request(app).post('/envelopes/transfer/0/1').send(amount).expect(400);
  });
  it('is not possible if the amount exeeds the funds', async () => {
    const amount = {amount: 50000};
    const response = await request(app).post('/envelopes/transfer/0/1').send(amount).expect(400);
  });
});