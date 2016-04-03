'use strict';

const util = require('util');
const samples = require('./data/sample');
const stream = require('stream');

function TestEventStream() {
  stream.Readable.call(this);

  this.index = 0;
  this.time = 0;
  this.poller = null;
}

util.inherits(TestEventStream, stream.Readable);

TestEventStream.prototype._read = function(size) {
  if (this.poller === null) {
    this.poller = setInterval(this.poll.bind(this), 500);
  }
}

TestEventStream.prototype.clear = function() {
  if (this.poller) {
    clearInterval(this.poller);
    this.index = 0;
    this.time = 0;
    this.poller = null;
  }
}

TestEventStream.prototype.poll = function() {
  if (this.index >= samples.length) this.index = 0;

  for(var i = this.index + 1; i < samples.length; i++) {
    if (Math.abs(samples[i][0] - this.time) >= 0.5) {
      this.index = i;
      break;
    }
  }

  this.time = samples[this.index][0];

  var tempc = samples[this.index][3];
  var tempf = (tempc * 1.8) + 32.0;

  let pushed = this.push(
    "data: " + JSON.stringify({ 'time': this.time, 'temp': tempf }) + "\n\n"
  );

  if (!pushed) {
    this.clear();
    return;
  }

  this.index += 1;
}

module.exports = TestEventStream;
