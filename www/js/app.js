$(document).foundation();

var React = require('react');
var ReactDOM = require('react-dom');
var TemperatureControl = require('./controls/temperature');

ReactDOM.render(
  <TemperatureControl label="Brew" />,
  document.getElementById('brew-temp-control')
);

ReactDOM.render(
  <TemperatureControl label="Steam" />,
  document.getElementById('steam-temp-control')
);
