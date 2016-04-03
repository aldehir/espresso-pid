'use strict';

const Transform = require('stream').Transform;
const util = require('util');

module.exports = SSE;

function SSE(options) {
  options = options || {};
  options.writableObjectMode = true;

  Transform.call(this, options);
}

util.inherits(SSE, Transform);

SSE.prototype._transform = function(data, enc, cb) {
  let event = data.event;
  let content = data.content;

  if (event !== null)
    this.push(`event: ${event.toString('utf8')}\n`);
  this.push(`data: ${content.toString('utf8')}\n\n`);

  cb();
};

