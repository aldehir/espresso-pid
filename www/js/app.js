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
source.addEventListener('message', function(e) {
  graph.update(JSON.parse(e.data));
}, false);
