'use strict';

const util = require('util');
const EventEmitter = require('events');

const samples = require('../data/sample');

module.exports = TestTempEmitter;

function TestTempEmitter(interval) {
  EventEmitter.call(this);

  this.interval = interval || 500;
  this.timer = null;

  this.index = 0;
  this.time = 0;
}

util.inherits(TestTempEmitter, EventEmitter);

TestTempEmitter.prototype.start = function() {
  if (this.timer !== null) return;
  this.timer = setInterval(this.poll.bind(this), this.interval);
}

TestTempEmitter.prototype.stop = function() {
  if (this.timer === null) return;
  clearInterval(this.timer);
  this.timer = null;
}

TestTempEmitter.prototype.poll = function() {
  if (this.index >= samples.length) this.index = 0;

  for(var i = this.index + 1; i < samples.length; i++) {
    if (Math.abs(samples[i][0] - this.time) >= (this.interval / 1000.0)) {
      this.index = i;
      break;
    }
  }

  this.time = samples[this.index][0];

  var tempc = samples[this.index][3];
  var tempf = (tempc * 1.8) + 32.0;

  this.emit('temperature', { 'time': (Date.now() / 1000.0), 'temp': tempf });

  this.index += 1;
}
