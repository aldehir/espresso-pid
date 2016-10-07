'use strict';

const _ = require('lodash');
const fs = require('fs');

module.exports = ApplicationConfiguration;

function ApplicationConfiguration(config) {
  // Set the pins to some defaults
  this._pins = {
    power_button: 27,
    brew_button: 22,
    water_button: 23,
    steam_button: 24,
    power_relay: 5,
    boiler_relay: 6,
    pump_relay: 12,
    valve_relay: 13
  }

  // Set thermocouple defaults
  this._thermocouple = {
    range: [200, 290],
    device: '/dev/spidev0.0'
  }

  this.load(config);
}

ApplicationConfiguration.prototype = {
  get pins() {
    return this._pins;
  },

  get thermocouple() {
    return this._thermocouple;
  },

  load: function(path) {
    let data =fs.readFileSync(path);
    let parsed = JSON.parse(data)

    _.assign(this._pins, parsed.pins);
    _.assign(this._thermocouple, parsed.thermocouple);
  }
}
