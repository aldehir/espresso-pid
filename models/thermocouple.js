'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const inherits = require('util').inherits;

module.exports = Thermocouple;

function Thermocouple(options) {
  EventEmitter.call(this);

  this._history = [];
  this._keep = 2 * 60 * 1000;
}

Thermocouple.prototype = {
  get history() {
    return this._history;
  },

  get temperature() {
    return this._history[this._history.size - 1].temp;
  },

  _add: function(time, temp) {
    // Drop old data
    this._history = _.dropWhile(
      this._history,
      (item) => time - item.time > this._keep
    );

    // Add temperature change to history
    this._history.push({ time: time, temp: temp });

    // Emit new temperature change
    this.emit('temperature', time, temp);
  }
};

inherits(Thermocouple, EventEmitter);
