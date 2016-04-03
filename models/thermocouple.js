'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const inherits = require('util').inherits;

module.exports = Thermocouple;

function Thermocouple(options) {
  EventEmitter.call(this);

  this._history = [];
  this._keep = 2 * 60;
}

Thermocouple.prototype = {
  get history() {
    return this._history;
  },

  get temperature() {
    return this._history[this._history.size - 1];
  },

  _add: function(time, temp) {
    // Add new point and remove any outdated data
    this._history.push([time, temp]);
    this._history = _.dropWhile(this._history,
                                (item) => time - item[0] > this._keep);

    this.emit('temperature', time, temp);
  }
};

inherits(Thermocouple, EventEmitter);
