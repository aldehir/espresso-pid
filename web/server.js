'use strict';

const _  = require('lodash');

const koa = {
  app: require('koa'),
  router: require('koa-router'),
  serve: require('koa-static'),
  parse: require('co-body')
}

const SSE = require('./sse/sse');
const TemperatureStream = require('./sse/temperaturestream');

const DEFAULTS = {
};

module.exports = function(thermocouple, tempConfig, options) {
  let opts = {};
  _.defaults(opts, options, DEFAULTS);

  let app = koa.app();
  let router = koa.router();

  router.get('/api/temperature', function *(next) {
    this.body = 'Hello World!';
  });

  router.get('/api/temperature/brew', function *(next) {
    this.type = 'application/json'
    this.body = JSON.stringify({ temperature: tempConfig.brew });
  });

  router.post('/api/temperature/brew', function *(next) {
    let body = yield koa.parse.json(this);

    try {
      tempConfig.brew = body.temperature;
      this.body = JSON.stringify({
        success: true,
        message: 'Temperature successfully updated'
      });
    } catch(err) {
      this.body = JSON.stringify({ success: false, message: err });
    }
  });

  router.get('/api/temperature/steam', function *(next) {
    this.type = 'application/json'
    this.body = JSON.stringify({ temperature: tempConfig.steam });
  });

  router.post('/api/temperature/steam', function *(next) {
    let body = yield koa.parse.json(this);

    try {
      tempConfig.steam = body.temperature;
      this.body = JSON.stringify({
        success: true,
        message: 'Temperature successfully updated'
      });
    } catch(err) {
      this.body = JSON.stringify({ success: false, message: err });
    }
  });

  router.get('/api/events', function *(next) {
    this.req.setTimeout(Number.MAX_VALUE);

    this.type = 'text/event-stream; charset=utf-8';
    this.set('Cache-Control', 'no-cache');
    this.set('Connection', 'keep-alive');

    let body = this.body = new SSE();
    let stream = new TemperatureStream(thermocouple);
    stream.pipe(body);

    let close = (err) => {
      stream.unpipe(body);
      socket.removeListener('error', close);
      socket.removeListener('close', close);
    };

    let socket = this.socket;
    socket.on('error', close);
    socket.on('close', close);
  });

  app.use(router.routes())
     .use(router.allowedMethods())
     .use(koa.serve(__dirname + '/public'));

  return app;
}
