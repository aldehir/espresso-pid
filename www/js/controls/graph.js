var _ = require('lodash');

function Graph(selector, width, height, period) {
  this.selector = selector;
  this.width = width;
  this.height = height;
  // this.margin = { top: 20, right: 50, left: 20, bottom: 30 };
  this.margin = { top: 20, right: 50, left: 20, bottom: 30 };
  this.period = period || 2.0;
  this.data = [];

  this.init();
}

Graph.prototype.graphWidth = function() {
  return this.width - this.margin.left - this.margin.right;
}

Graph.prototype.graphHeight = function() {
  return this.height - this.margin.top - this.margin.bottom;
}

Graph.prototype.offsetX = function() {
  return -1.0 * this.period;
}

Graph.prototype._xTransform = function(d) {
  // We want to map the times from -2 to 0.
  var last = _.last(this.data);
  return this.scaleX((d.time - last.time) / 60.0);
}

Graph.prototype.init = function() {

  this.scaleX = d3.scale.linear()
    .range([0, this.graphWidth()])
    .domain([this.offsetX(), 0]);

  this.scaleY = d3.scale.linear()
    .range([this.graphHeight(), 0])
    .nice()
    .domain([160, 250]);

  var tempFormat = d3.format("->3d");
  var timeFormat = d3.format("-.1f");

  this.xAxis = d3.svg.axis()
    .scale(this.scaleX)
    .orient("bottom")
    .ticks(4)
    .tickSize(0, 0)
    .tickPadding(10)
    .tickFormat(function (d) { return timeFormat(Math.abs(d)) + "s" });

  this.yAxis = d3.svg.axis()
    .scale(this.scaleY)
    .orient("right")
    .ticks(10)
    .tickSize(-1.0 * this.graphWidth(), 0)
    .tickPadding(10)
    .tickFormat(function (d) { return tempFormat(d) + "\u00B0F" });

  // Bind scaleX and scaleY to local variables so we can use them in functions
  // below.
  var x = this.scaleX,
      y = this.scaleY;

  this.area = d3.svg.area()
    .x(this._xTransform.bind(this))
    .y0(function (d) { return this.graphHeight(); }.bind(this))
    .y1(function (d) {
      if (d.temp < 180.0) {
        return y(d.temp);
      }

      return this.graphHeight();
    }.bind(this));

  this.line = d3.svg.line()
    .x(this._xTransform.bind(this))
    .y(function (d) { return y(d.temp); });

  this.svg = d3.select(this.selector).append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
    .append("g")
      .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + this.graphHeight() +")")
      .call(this.xAxis);

  this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + this.graphWidth() + ",0)")
      .call(this.yAxis);

  this.svg.append("path")
      .attr("class", "line");

  this.svg.append("path")
      .attr("class", "area");

}

Graph.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;

  this.scaleX.range([0, this.graphWidth()]);
  this.scaleY.range([this.graphHeight(), 0]);

  // Update tick width of the y axis
  this.yAxis.innerTickSize(-1.0 * this.graphWidth());

  d3.select(this.selector + " svg")
    .attr("width", this.width)
    .attr("height", this.height);

  this.svg.select(".y.axis")
      .attr("transform", "translate(" + this.graphWidth() + ",0)");

  this.svg.select(".x.axis")
      .attr("transform", "translate(0, " + this.graphHeight() +")");

  this.repaint();
}

Graph.prototype.repaint = function() {
  this.svg.select("path.line")
      .datum(this.data)
      .attr("d", this.line);

  this.svg.select("path.area")
      .datum(this.data)
      .attr("d", this.area);

  this.svg.select(".x.axis")
      .call(this.xAxis);

  this.svg.select(".y.axis")
      .call(this.yAxis);
}

Graph.prototype.update = function(data) {
  // Add to data
  this.data.push(data);

  // Remove outdated data
  var cutoff = data.time + (this.offsetX() * 60.0);
  this.data = _.dropWhile(this.data, function(d) { return cutoff > d.time; });

  // Scale X domain
  this.scaleX.domain([this.offsetX(), 0]);

  // Center around the midpoint between min/max of the data
  var mean = d3.mean(d3.extent(this.data, function(d) { return d.temp; }));
  var center = d3.round(mean, -1);

  this.scaleY.domain([center - 50, center + 50]);

  this.repaint();
}

module.exports = Graph;
