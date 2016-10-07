'use strict';

const _ = require('lodash');

module.exports = Boiler;

function Boiler(options) {
  let opts = _.clone(options);
  _.defaultsDeep(opts, Boiler._default_options);

  self._thermostat = opts.thermostat;
  self._pid = opts.pid;
  self._temperatures = opts.temperatures;
  self.state = opts.initialState;
}

Boiler._default_options = {
  thermostat: null,
  pid: null,
  temperatures: {
    brew: 230,
    steam: 260
  },
  initialState: 'brew'
};

Boiler.prototype = {

  get state() {
    return self._state;
  },

  set state(value) {
    self._state = value;
    self._pid.setGoal(self._temperatures[value]);
  },

};
