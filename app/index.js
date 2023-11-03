const express = require('express');
const { envelopes, Envelope } = require('./envelopes');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const validateEnvelope = (req, res, next) => {
    console.log('validating');
    const newName = req.body.name;
    req.newEnvelope = {};
    if (newName != req.envelope.name) {
        try {
            const nameIdx = Envelope.nameIndex(newName);
        } catch (e) {
            req.newEnvelope.name = newName;
        }
        if (!req.newEnvelope.name) {
            err = new Error('Name already exists!');
            err.status = 400;
            next(err);
        };       
    } else {
        req.newEnvelope.name = newName;
    };
    
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

app.param('id', (req, res, next, id) => {
    let envId = Number(id);
    try {
        const idx = Envelope.idIndex(envId);
    } catch (e) {
        e.status = 404;
        next(e);
    };
    req.envId = envId;
    req.envelope = Envelope.selectId(envId).makePublic();
    next();
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

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err.message);
});

module.exports = app;