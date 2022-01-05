var express = require('express');

var prom = require('prom-client');

const register = prom.register;

var app = express();

const counter = new prom.Counter({
    name: 'aula_request_total',
    help: 'Contador de request',
    labelNames: ['statusCode']
});

const gauge = new prom.Gauge({
    name:   'aula_free_bytes',
    help: 'Exemplo de gauge'
});

const histogram = new prom.Histogram({
    name: 'aula_request_time_seconds',
    help: 'Tempo de resposta da API',
    buckets: [0.1, 0.2, 0.3, 0.4, 0.5]
});

app.get('/', function(req, res) {
    counter.labels('200').inc();
    counter.labels('300').inc();
    gauge.set(100*Math.random());
    histogram.observe(Math.random());
    res.send('Hello World!');
});

app.get('/metrics', async function(req, res) {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(3000);