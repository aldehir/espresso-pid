'use strict'

const EventEmitter = require('events');
const util = require('util');
const fs = require('fs');

function TemperatureConfiguration(configFile, allowRange) {
  this._configFile = configFile;

  if (allowRange !== undefined) {
    this._max = allowRange[0];
    this._min = allowRange[1];
  } else {
    this._max = 500;
    this._min = 0;
  }

  this._configuration = {}
  this._dirty = false;

  this.load(configFile);
}

util.inherits(TemperatureConfiguration, EventEmitter);

TemperatureConfiguration.prototype.load = function(configFile) {
  let contents = fs.readFileSync(configFile, 'utf8');
  this._configuration = JSON.parse(contents);
}

TemperatureConfiguration.prototype.save = function() {
  if (this._dirty) {
    fs.writeFile(this._configFile,
                 JSON.stringify(this._configuration, null, 2),
                 'utf8',
                 () => { this._dirty = false; });
  }
}

TemperatureConfiguration.prototype.validateRange = function(temp) {
  if (temp < this._min)
    throw "Temperature is below allowed minimum of " + this._min;

  if (temp > this._max)
    throw "Temperature is allowed allowed maximum of " + this._max;
}

TemperatureConfiguration.prototype.brewTemperature = function(temp) {
  if (temp === undefined) {
    return this._configuration['brew'];
  }

  this.validateRange(temp);

  if (temp >= this._configuration['steam'])
    throw "Temperature must be below steam temperature";

  this._configuration['brew'] = temp;
  this._dirty = true;
  this.emit('brew-change', temp);
  this.save();
}

TemperatureConfiguration.prototype.steamTemperature = function(temp) {
  if (temp === undefined) {
    return this._configuration['steam'];
  }

  this.validateRange(temp);

  if (temp <= this._configuration['brew'])
    throw "Temperature must be above brew temperature";
  
  this._configuration['steam'] = temp;
  this._dirty = true;
  this.emit('steam-change', temp);
  this.save();
}

module.exports = TemperatureConfiguration;
