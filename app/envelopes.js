// envelopes array to keep track of all envelopes
const envelopes = [];

// class to create envelopes
class Envelope {
    constructor(name, initialBudget) {
        this.name = name;
        this.budget = initialBudget || 0;
        this.id = Envelope.newId();
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

    makePublic() {
        const output = {id: this.id, name: this.name, budget: this.budget};
        return output;
    };

    static nameDelete(name) {
        const idx = Envelope.nameIndex(name);
        if (envelopes[idx].budget === 0) {
            envelopes.splice(idx, 1);
            return true;
        } else {
            throw new Error('Envelope not empty!');
        };
    };

    static selectName(name) {
        return envelopes[Envelope.nameIndex(name)];
    };

    static nameIndex(name) {
        const names = envelopes.map(envelope => envelope.name);
        const idx = names.indexOf(name);
        if (idx  >  -1) {
            return idx;
        } else {
            throw new Error('Envelope does not exist!');
        };
    };

    static idIndex(id) {
        const ids = envelopes.map(envelope => envelope.id);
        const idx = ids.indexOf(id);
        if (idx  >  -1) {
            return idx;
        } else {
            throw new Error('Envelope does not exist!');
        };
    };

    static selectId(id) {
        return envelopes[Envelope.idIndex(id)];
    };

    static newId() {
        let id = 0;
        let found = false
        while (!found) {
            try {
                Envelope.idIndex(id);
            } catch(e) {
                found = true
                return id;
            }; 
            id++;
        };
    };

    static idDelete(id) {
        const idx = Envelope.idIndex(id);
        if (envelopes[idx].budget === 0) {
            envelopes.splice(idx, 1);
            return true;
        } else {
            throw new Error('Envelope not empty!');
        };
    };
};

// initialize some envelopes as example
new Envelope('home', 300);
new Envelope('hobby', 200);
new Envelope('food', 800);
new Envelope('transport', 200);


module.exports = { envelopes, Envelope };