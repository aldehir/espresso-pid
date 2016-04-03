'use strict';

const Readable = require('stream').Readable;
const inherits = require('util').inherits;

module.exports = TemperatureStream;

function TemperatureStream(thermo) {
  Readable.call(this, { objectMode: true });

  this._thermo = thermo;
  this._updatecb = this._update.bind(this);
}

inherits(TemperatureStream, Readable);

TemperatureStream.prototype.unpipe = function() {
  Readable.prototype.unpipe.apply(this, arguments);
  this.pause();
}

TemperatureStream.prototype.resume = function() {
  Readable.prototype.resume.apply(this, arguments);

  // Listen for temperature changes
  this._thermo.on('temperature', this._updatecb);

  // Push history
  this.push({
    event: 'temperature-history',
    content: JSON.stringify(this._thermo.history)
  });
}

TemperatureStream.prototype.pause = function() {
  Readable.prototype.pause.apply(this, arguments);
  this._thermo.removeListener('temperature', this._updatecb);
}


TemperatureStream.prototype._update = function(time, temp) {
  let pushed = this.push({
    event: 'temperature',
    content: JSON.stringify([time, temp])
  });

  if (!pushed) {
    this.pause();
  }
}

TemperatureStream.prototype._read = function() {
  // Don't really have to do anything, since this.push is triggered by events
}
