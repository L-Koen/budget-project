// envelopes array to keep track of all envelopes
const envelopes = [];

// class to create envelopes
class Envelope {
    constructor(name, initialBudget) {
        this.name = name;
        this._budget = initialBudget || 0;
        this.id = envelopes.length;
        envelopes.push(this);
    };

    set name(name) {
        // check if name exists
        for (let i = 0; i < envelopes.length; i++) {
            if (envelopes[i].name === name) {
                throw new Error('Envelope already exists!');
            };
        };
        this._name = name;
    };

    get name() {
        return this._name;
    };

    withdraw(amount) {
        this._budget = this._budget - amount;
        return this._budget;
    };

    fund(amount) {
        this._budget = this._budget + amount;
        return this._budget;
    };

    get budget() {
        return this._budget;
    }

};
    


module.exports = { envelopes, Envelope };