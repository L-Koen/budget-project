/* To test the Envelope class and the array of envelopes created */
const Envelope = require('./envelopes.js');


describe('Test envelope Class', () => {
    it('can be created', () => {
        const home = new Envelope('home');
        expect(home.name).toBe('home');
        expect(home.budget).toBe(0)
    });
});