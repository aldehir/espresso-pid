'use strict';

const EventEmitter = require('events');
const util = require('util');
const fs = require('fs');

function TemperatureConfiguration(configFile, allowRange) {
  this.configFile = configFile;

  if (allowRange !== undefined) {
    this.min = allowRange[0];
    this.max = allowRange[1];
  } else {
    this.min = 0;
    this.max = 500;
  }

  this.configuration = {}
  this.load(configFile);
}

TemperatureConfiguration.prototype = {

  get brew() {
    return this.configuration.brew;
  },

  set brew(value) {
    this.validate(value);

    if (value >= this.steam)
      throw "Temperature must be below steam temperature";

    this.configuration.brew = value;
    this.emit('brew-temperature-update', value);
    this.save();
  },

  get steam() { 
    return this.configuration.steam;
  },

  set steam(value) {
    this.validate(value);

    if (value <= this.brew)
      throw "Temperature must be above brew temperature";

    this.configuration.steam = value;
    this.emit('steam-temperature-update', value);
    this.save();
  },

  validate: function(value) {
    if (value < this.min)
      throw "Temperature is below allowed minimum of " + this.min;

    if (value > this.max)
      throw "Temperature is allowed allowed maximum of " + this.max;
  },

  load: function(configFile) {
    let contents = fs.readFileSync(configFile, 'utf8');
    this.configuration = JSON.parse(contents);
  },

  save: function() {
    fs.writeFile(
      this.configFile,
      JSON.stringify(this.configuration, null, 2),
      'utf8'
    );
  }

};

util.inherits(TemperatureConfiguration, EventEmitter);

module.exports = TemperatureConfiguration;
