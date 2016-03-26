'use strict';

const koa = {
  app: require('koa'),
  router: require('koa-router'),
  serve: require('koa-static')
}

const EventStream = require('./eventstream');

let app = koa.app();
let router = koa.router();

router.get('/api/temperature', function *(next) {
  this.body = 'Hello World!';
});

router.get('/api/events', function *(next) {
  let stream = new EventStream();

  // When the socket closes, stop pushing to the event stream
  this.request.socket.on('close', (err) => {
    stream.clear();
  });

  this.response.append('Cache-Control', 'no-cache');
  this.response.type = 'text/event-stream';
  this.body = stream;
});

// router.get('/*', koa.serve(__dirname + '/public'));

app.use(router.routes())
   .use(router.allowedMethods())
   .use(koa.serve(__dirname + '/public'));

app.listen(8000);
