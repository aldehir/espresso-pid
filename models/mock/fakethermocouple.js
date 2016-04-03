'use strict';

const Thermocouple = require('../thermocouple');
const inherits = require('util').inherits;
const data = require('../../data/sample');

module.exports = FakeThermocouple;

function FakeThermocouple(interval) {
  Thermocouple.call(this);

  this.data = data;
  this.interval = interval || 500;
  this.timer = null;
  
  this.index = 0;
  this.time = 0;
}

inherits(FakeThermocouple, Thermocouple);

FakeThermocouple.prototype.start = function() {
  if (this.timer !== null) return;
  this.timer = setInterval(this.poll.bind(this), this.interval);
}

FakeThermocouple.prototype.stop = function() {
  if (this.timer === null) return;
  clearInterval(this.timer);
  this.timer = null;
}

FakeThermocouple.prototype.poll = function() {
  if (this.index >= this.data.length) this.index = 0;

  for(var i = this.index + 1; i < this.data.length; i++) {
    if (Math.abs(this.data[i][0] - this.time) >= (this.interval / 1000.0)) {
      this.index = i;
      break;
    }
  }

  this.time = this.data[this.index][0];

  var tempc = this.data[this.index][3];
  var tempf = (tempc * 1.8) + 32.0;

  this._add(Date.now() / 1000.0, tempf);

  this.index += 1;
}
