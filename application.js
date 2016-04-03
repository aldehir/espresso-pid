'use strict';

const FakeThermocouple = require('./models/mock/fakethermocouple');
const TemperatureConfiguration = require('./models/temperatureconfiguration');
const WebServer = require('./web/server')

let tempConfigPath = __dirname + '/config/temperature.json';
let tempConfig = new TemperatureConfiguration(tempConfigPath);

// Configure thermocoupler
let thermocouple = new FakeThermocouple();
thermocouple.start();

// Start up webserver
let webserver = WebServer(thermocouple, tempConfig);
webserver.listen(8000);
