const express = require('express');
const { envelopes, Envelope } = require('./envelopes');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const validateId = (id) => {
    try {
        const idx = Envelope.idIndex(id);
        return true;
    } catch (e) {
        return false;
    };
}

const validateEnvelope = (req, res, next) => {
    // Validate name
    const newName = req.body.name;
    req.newEnvelope = {};
    // We need a name
    if (!newName) {
        err = new Error('Name cannot be empty!');
        err.status = 400;
        next(err);
    }
    // check if it exists
    try {
        const nameIdx = Envelope.nameIndex(newName);
    } catch (e) {
        req.newEnvelope.name = newName;
    };
    // if updating an existing envelope, the old name is valid.
    if (req.envelope && req.envelope.name === newName) {
        req.newEnvelope.name = newName;
    };
    // otherwise, reject duplicates
    if (!req.newEnvelope.name) {
        err = new Error('Name already exists!');
        err.status = 400;
        next(err);
    };
    
    // Validate budget
    const newBudget = Number(req.body.budget);
    if (newBudget >= 0 && !Number.isNaN(newBudget)) {
        req.newEnvelope.budget = newBudget;
        next();
    } else {
        err = new Error('Budget is invalid!');
        err.status = 400;
        next(err);
    };
};

const validateAmount = (req, res, next) => {
    const amount = Number(req.body.amount);
    if (amount >= 0 && !Number.isNaN(amount)) {
        req.amount = amount;
        next();
    } else {
        err = new Error('Amount is invalid!');
        err.status = 400;
        next(err);
    }
}

app.param('id', (req, res, next, id) => {
    let envId = Number(id);
    if (validateId(envId)) {
        req.envId = envId;
        req.envelope = Envelope.selectId(envId).makePublic();
        next();
    } else {
        const e = new Error('Envelope does not exist!')
        e.status = 404;
        next(e);
    };    
});

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.get('/envelopes', (req, res, next) => {
    res.json(envelopes);
});

app.get('/envelopes/:id', (req, res, next) => {
    res.json(req.envelope);
})

app.put('/envelopes/:id', validateEnvelope, (req, res, next) => {
    const envelope = Envelope.selectId(req.envId);
    envelope.budget = req.newEnvelope.budget;
    if (envelope.name != req.newEnvelope.name) {
        envelope.name = req.newEnvelope.name;
    };
    res.json(envelope.makePublic());
});

app.post('/envelopes', validateEnvelope, (req, res, next) => {
    newEnvelope = new Envelope(req.newEnvelope.name, req.newEnvelope.budget);
    res.status(201).json(newEnvelope.makePublic());
});

app.delete('/envelopes/:id', (req, res, next) => {
    if (req.envelope.budget === 0) {
        Envelope.idDelete(req.envId);
        res.status(204).send('Delete succesfull.')
    } else {
        err = new Error('Envelope is not empty!');
        err.status = 400;
        next(err);
    }

});

app.post('/envelopes/transfer/:from/:to', validateAmount, (req, res, next) => {
    const fromId = Number(req.params.from);
    const toId = Number(req.params.to);
    if (validateId(fromId) && validateId(toId)) {
        fromEnvelope = Envelope.selectId(fromId);
        if (fromEnvelope.budget >= req.amount) {
            fromEnvelope.withdraw(req.amount);
            Envelope.selectId(toId).fund(req.amount);
            res.send('Transfer succesfull.');
        } else {
            err = new Error('Insufficient funds!');
            err.status = 400;
            next(err); 
        };

    } else {
        err = new Error('Envelope does not exist!');
        err.status = 400;
        next(err);
    }
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err.message);
});

module.exports = app;