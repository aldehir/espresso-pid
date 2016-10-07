'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const util = require('util');

module.exports = PIDController;

function PIDController(thermocouple, setpoint, histlen, pgain, igain, dgain) {
  EventEmitter.call(this);

  this.thermocouple = thermocouple;
  this.tickcb = this.tick.bind(this);
  this.setpoint = setpoint;
  this.histlen = histlen;

  this.gain = { p: pgain, i: igain, d: dgain };
}

util.inherits(PIDController, EventEmitter);

PIDController.prototype.start = function() {
  this.thermocouple.on('temperature', this.tickcb);
}

PIDController.prototype.stop = function() {
  this.thermocouple.removeListener('temperature', this.tickcb);
}

PIDController.prototype.tick = function(time, temp) {
  // Get history from thermocouple, keep only last 10 seconds
  let history = _.takeRightWhile(
    this.thermocouple.history,
    (x) => time - x.time < this.histlen
  );

  // Determine error rates for historical data
  let errors = _.map(history, (x) => [x.time, this._error(x.temp)]);

  // Determine error for current temperature
  let proportional = this._error(temp);

  // Calculate integral term
  let integral = this._trapz(errors);

  // Calculate the derivative
  let derivative = 0;
  if (history.length > 0) {
    let dy = temp - history[0].temp,
        dx = time - history[0].time;
    if (dx != 0) derivative = dy / dx;
  }

  // Produce PID output
  let pid = (this.gain.p * proportional)
            + (this.gain.i * integral)
            + (this.gain.d * derivative);

  // Emit recommendation
  this._recommend(pid);
}

PIDController.prototype._recommend = function(val) {
  let recommendation = 'off';
  if (val < 0) recommendation = 'on';

  this.emit('recommendation', recommendation);
}

PIDController.prototype._error = function(val) {
  return val - this.setpoint;
}

PIDController.prototype._trapz = function(list) {
  return _.transform(list, function(acc, p) {
    if (acc.last != null)
      acc.sum += ((p[0] - acc.last[0]) / 2.0) * (acc.last[1] + p[1]);
    acc.last = p
  }, { sum: 0, last: null }).sum;
}
