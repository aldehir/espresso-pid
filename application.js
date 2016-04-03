'use strict';

const WebServer = require('./web/server')

let webserver = WebServer();
webserver.listen(8000);
