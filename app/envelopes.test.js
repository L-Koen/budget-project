/* To test the Envelope class and the array of envelopes created */
const { envelopes, Envelope } = require('./envelopes.js');


describe('Test envelope Class', () => {
    it('can be created', () => {
        const test = new Envelope('test');
        expect(test.name).toBe('test');
        expect(test.budget).toBe(0);
        expect(test.id).toEqual(envelopes.length -1);
        expect(test).toBe(envelopes[envelopes.length -1]);
    });

    it('can be created with an initial budget', () => {
        const test1 = new Envelope('test1', 100);
        expect(test1.name).toBe('test1');
        expect(test1.budget).toBe(100);
        expect(test1.id).toEqual(envelopes.length -1);
        expect(test1).toBe(envelopes[envelopes.length -1]);
    });

    it('should prevent envelopes with the same name', () => {
        expect(() => {new Envelope('test')}).toThrow('Envelope already exists!');
        expect(() => {envelopes[envelopes.length -1].name = 'test'}).toThrow('Envelope already exists!')
    });

    it('should have methods to add or subtract from the budget', () => {
        expect(envelopes[envelopes.length -1].withdraw(50)).toEqual(50);
        expect(envelopes[envelopes.length -1].fund(50)).toEqual(100);
    });
    
    it('should prevent that Envelopes go under budget', () => {
        expect(() => {envelopes[envelopes.length -1].withdraw(500)}).toThrow('Not enough budget!');
        expect(() => {new Envelope('itdoesnotexist', -200)}).toThrow('Not enough budget!');
    });

    it('should be possible to delete an empty envelope by name', () => {
        expect(Envelope.delete('test')).toBe(true);
        expect(() => {Envelope.delete('test')}).toThrow('Envelope does not exist!');
        expect(() => {Envelope.delete('test1')}).toThrow('Envelope not empty!');
    });
});

describe('envelopes array', () => {
    it('exists', () => {
        expect(envelopes.length > 1);
    });
    
})  