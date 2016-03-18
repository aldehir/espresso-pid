var React = require('react');

var TemperatureControl = React.createClass({
  getInitialState: function() {
    return { locked: true };
  },

  handleClick: function() {
    this.setState({ locked: !this.state.locked });
  },

  render: function() {
    var locked = this.state.locked;

    return (
        <div className="input-group">
          <span className="input-group-label">{this.props.label} (&deg;F)</span>
          <input
            className="input-group-field" 
            type="text"
            disabled={locked ? "disabled" : null}
          />
          <div className="input-group-button">
            <input
              className="button"
              type="button"
              value={locked ? "Unlock" : "Set"}
              onClick={this.handleClick}
            />
          </div>
        </div>
    );
  }
});

module.exports = TemperatureControl;
