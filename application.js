'use strict';

const path = require('path');

const ApplicationConfiguration = require('./models/applicationconfiguration');
const TemperatureConfiguration = require('./models/temperatureconfiguration');
const FakeThermocouple = require('./models/mock/fakethermocouple');
const WebServer = require('./web/server');
const PIDController = require('./controllers/pidcontroller.js');

let appConfigPath = path.join(__dirname, 'config', 'application.json');
let tempConfigPath = path.join(__dirname, 'config', 'temperature.json');

let appConfig = new ApplicationConfiguration(appConfigPath);
let tempConfig = new TemperatureConfiguration(tempConfigPath);

console.log(appConfig);

// Configure thermocoupler
let thermocouple = new FakeThermocouple(250);
thermocouple.start();

// Configure PID Controller
let pid = new PIDController(thermocouple, 230.0, 3000, 4, 0.025, 20);
pid.start();

// Start up webserver
let webserver = WebServer(thermocouple, tempConfig);
webserver.listen(8000);
