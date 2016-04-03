'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const samples = require('./data/sample');
const Configuration = require('../models/configuration');

let app = express();
let api = express();
let validator = express.Router();

let config = new Configuration('../config/temperatures.json');

app.locals.config = config;
api.locals.config = config;

validator.post(/\/temperature\/(brew|steam)/, function(req, res, next) {
  if (req.body.temperature == undefined) {
    res.json({ 'success': false, 'message': "No temperature specified." });
    return;
  }

  res.locals.temp = Number.parseFloat(req.body.temperature);
  if (Number.isNaN(res.locals.temp)) {
    res.json({ 'success': false, 'message': "Invalid temperature." });
    return;
  }

  next();
});

api.use(bodyParser.json(), validator);

api.get('/temperature', function(req, res) {
  res.json({ 'temperature': 90.0 });
});

api.get('/temperature/brew', function(req, res) {
  res.json({ 'temperature': api.locals.config.brewTemperature() });
});

api.post('/temperature/brew', function(req, res) {
  try {
    api.locals.config.brewTemperature(res.locals.temp);
    res.json({ success: true, message: "Successfully updated temperature." });
  } catch(msg) {
    res.json({ success: false, message: msg });
  }
});

api.get('/temperature/steam', function(req, res) {
  res.json({ 'temperature': api.locals.config.steamTemperature() });
});

api.post('/temperature/steam', function(req, res) {
  try {
    api.locals.config.steamTemperature(res.locals.temp);
    res.json({ success: true, message: "Successfully updated temperature." });
  } catch(msg) {
    res.json({ success: false, message: msg });
  }
});


// TODO: Implement an actual events
api.get('/events', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/event-stream',
                      'Cache-Control': 'no-cache'});

  var index = 0,
      time = 0;

  var sendevent = function() {
    if (index >= samples.length) index = 0;

    for (var i = index + 1; i < samples.length; i++) {
      if (Math.abs(samples[i][0] - time) >= 0.5) {
        index = i;
        break;
      }
    }

    time = samples[index][0];

    var tempc = samples[index][3];
    var tempf = (tempc * 1.8) + 32.0;

    res.write(
      "data: " + JSON.stringify({ 'time': time, 'temp': tempf }) + "\n\n"
    );

    index += 1;
  };

  sendevent();
  setInterval(sendevent, 500);

});

app.use('/api', api);
app.use(express.static('public'));

app.listen(8000);
