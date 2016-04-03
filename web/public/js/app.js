$(document).foundation();

var React = require('react');
var ReactDOM = require('react-dom');
var TemperatureControl = require('./controls/temperature');
var Graph = require('./controls/graph');
var _ = require('lodash');

ReactDOM.render(
  <TemperatureControl label="Brew" />,
  document.getElementById('brew-temp-control')
);

ReactDOM.render(
  <TemperatureControl label="Steam" />,
  document.getElementById('steam-temp-control')
);

function graphElementDimensions() {
  var chart = $("#chart");
  console.log(chart.width());

  return {
    width: chart.width(),
    height: chart.width() * (9.0/16.0)
  };
}

var dimensions = graphElementDimensions();
var graph = new Graph("#chart", dimensions.width, dimensions.height);

$(window).on('resize', _.throttle(function() {
  var dimensions = graphElementDimensions();
  graph.resize(dimensions.width, dimensions.height);
}, 22.0));

var source = new EventSource('api/events');

// Handle initial history
source.addEventListener('temperature-history', function(e) {
  var data = _.map(JSON.parse(e.data),
                   (item) => ({ time: item[0], temp: item[1] }));

  // FIXME: Ugly hack
  var first = data.slice(0, -1);
  var last = data.slice(-1)[0];

  graph.data = first;
  graph.update(last)
}, false);

// Add subsequent data points
source.addEventListener('temperature', function(e) {
  var data = JSON.parse(e.data);
  graph.update({ time: data[0], temp: data[1] });
}, false);
