// envelopes array to keep track of all envelopes
const envelopes = [];

// class to create envelopes
class Envelope {
    constructor(name, initialBudget) {
        this.name = name;
        this.budget = initialBudget || 0;
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
        this.budget = this.budget - amount;
        return this.budget;
    };

    fund(amount) {
        this.budget = this.budget + amount;
        return this.budget;
    };

    get budget() {
        return this._budget;
    };

    set budget(newBudget) {
        if (newBudget >= 0) {
            this._budget = newBudget;
        } else {
            throw new Error('Not enough budget!');
        };
    };

    static delete(name) {
        const names = envelopes.map(envelope => envelope.name);
        const index = names.indexOf(name);
        if (index  >  -1) {
            if (envelopes[index].budget === 0) {
                envelopes.splice(index, 1);
                return true;
            } else {
                throw new Error('Envelope not empty!');
            }
        } else {
            throw new Error('Envelope does not exist!');
        }
    };
};
    


module.exports = { envelopes, Envelope };