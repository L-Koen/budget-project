const express = require('express');
const { envelopes, Envelope } = require('./envelopes');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

function makePublic(envelope) {
    const output = {id: envelope.id, name: envelope.name, budget: envelope.budget};
    return output;
};

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.get('/envelopes', (req, res, next) => {
    res.json(envelopes);
});

app.get('/envelopes/:id', (req, res, next) => {
    const id = Number(req.params.id);
    if (id >= 0 && id < envelopes.length && Number.isInteger(id)) {
        res.json(Envelope.selectId(id));
    } else {
        res.status(404).send('Envelope not found!');
    };
})

app.put('/envelopes/:id', (req, res, next) => {
    const id = Number(req.params.id);
    if (id >= 0 && id < envelopes.length && Number.isInteger(id)) {
        const envelope = Envelope.selectId(id);
        envelope.budget = req.body.budget;
        envelope.name = req.body.name;
        res.json(makePublic(envelope));
    } else {
        res.status(404).send('Envelope not found!');
    };
})

module.exports = app;