'use strict';

const _ = require('lodash');

function TemperatureHistory(emitter, keep) {
  this.emitter = emitter;
  this.keep = keep;
  this._data = [];

  this.emitter.on('temperature', this._onTemperatureChange);
}

TemperatureHistory.prototype = {

  get data() {
    return this._data;
  },

  _onTemperatureChange: function(data) {
    // Push data
    this._data.push(data);

    // Drop old data
    this._data = _.dropWhile((item) => data.time - item.time >= keep);
  }

}
