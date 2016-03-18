var express = require('express');
var app = express();
var samples = require('./data/sample');

var api = express();

api.get('/temperature', function (req, res) {
  res.json({ 'temperature': 90.0 });
});


// TODO: Implement an actual events
api.get('/events', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/event-stream',
                      'Cache-Control': 'no-cache'});

  var index = 0,
      time = 0;

  var sendevent = function() {
    if (index >= samples.length) index = 0;

    for (var i = index + 1; i < samples.length; i++) {
      if (Math.abs(samples[i][0] - time) >= 0.5) {
        index = i;
        break;
      }
    }

    time = samples[index][0];

    var tempc = samples[index][3];
    var tempf = (tempc * 1.8) + 32.0;

    res.write(
      "data: " + JSON.stringify({ 'time': time, 'temp': tempf }) + "\n\n"
    );

    index += 1;
  };

  sendevent();
  setInterval(sendevent, 500);

});

app.use('/api', api);
app.use(express.static('public'));

app.listen(8000);
