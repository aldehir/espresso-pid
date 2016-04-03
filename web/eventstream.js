'use strict';

const util = require('util');
const Readable = require('stream').Readable;

module.exports = EventStream;

function EventStream(emitter, propagate) {
  Readable.call(this, { objectMode: true });

  this._emitter = emitter;
  this._propagate = propagate;
  this._listeners = null;
}

util.inherits(EventStream, Readable);

EventStream.factory = function(emitter, propagate) {
  return () => new EventStream(emitter, propagate);
}

EventStream.prototype.stop = function() {
  this._cleanup();
}

EventStream.prototype._read = function(size) {
  if (this._listeners !== null) return;

  this._listeners = this._propagate.map((x) => {
    let listener = this._createCallback(x);
    this._emitter.on(x, listener);
    return { event: x, callback: listener };
  });
}

EventStream.prototype._cleanup = function() {
  if (this._listeners === null) return;

  this._listeners.forEach((x) => {
    this._emitter.removeListener(x.event, x.callback);
  });
  this._listeners = null;
}

EventStream.prototype._createCallback = function(event) {
  let callback = (obj) => {
    /*
    let json = JSON.stringify(obj);
    let pushed = this.push(`event: ${event}\n`) &&
                 this.push(`data: ${json}\n\n`);
    */
    let pushed = this.push({ event: event, content: JSON.stringify(obj) });

    if (!pushed) {
      this._cleanup();
    }
  };

  return callback;
}
