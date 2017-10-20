import React from 'react';
import PropTypes from 'prop-types';

export default class Route extends React.Component {
  constructor(props) {
    super(props);
    this.animations = this.props.animations;
    // Default to regular positioning
    this.absolute = this.props.absolute;
    // This would make it default to true
    // (this.props.absolute == null || this.props.absolute ? true : false);
  }

  render() {
    const positionStyles = this.absolute ? { position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, } : { };
    const animationStyles = { backfaceVisibility: 'hidden', WebkitPerspective: 1000 };
    return (
      <div className="route" style={Object.assign(positionStyles, animationStyles)}>
        {this.props.component()}
      </div>
    );
  }
}

Route.propTypes = {
  path: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
  exact: PropTypes.bool,
  animations: PropTypes.object,
  absolute: PropTypes.bool,
};
