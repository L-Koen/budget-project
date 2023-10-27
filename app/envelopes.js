class Envelope {
    constructor(name, initialBudget) {
        this.name = name;
        this.budget = initialBudget || 0;
    };
};

module.exports = Envelope