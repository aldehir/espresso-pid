'use strict';

const FakeThermocouple = require('./models/mock/fakethermocouple');
const WebServer = require('./web/server')

// Configure thermocoupler
let thermocouple = new FakeThermocouple();
thermocouple.start();

// Start up webserver
let webserver = WebServer(thermocouple);
webserver.listen(8000);
