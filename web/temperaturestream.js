'use strict';

const Readable = require('stream').Readable;
const inherits = require('util').inherits;

module.exports = TemperatureStream;

function TemperatureStream(thermo) {
  Readable.call(this, { objectMode: true });

  this._listening = false;
  this._thermo = thermo;
  this._updatecb = this._update.bind(this);
}

inherits(TemperatureStream, Readable);

TemperatureStream.prototype._update = function(time, temp) {
  let pushed = this.push({
    event: 'temperature',
    content: JSON.stringify([time, temp])
  });

  if (!pushed) {
    this._thermo.removeListener('temperature', this._updatecb);
    this._listening = false;
  }
}

TemperatureStream.prototype._read = function(size) {
  if (this._listening) return;

  // Listen for temperature changes
  this._thermo.on('temperature', this._updatecb);

  // Push history
  this.push({
    event: 'temperature-history',
    content: JSON.stringify(this._thermo.history)
  });

  this._listening = true;
}
