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
    const urlParameters = this.props.urlParameters || '';
    const data = { urlParams: urlParameters, state: this.props.state };
    let component = null;
    if (this.props.component) {
      component = React.cloneElement(this.props.component, data);
    }

    return (
      <div className="route" style={Object.assign(positionStyles, animationStyles)}>
        {component}
      </div>
    );
  }
}

Route.propTypes = {
  path: PropTypes.string.isRequired,
  component: PropTypes.object.isRequired,
  exact: PropTypes.bool,
  animations: PropTypes.object,
  absolute: PropTypes.bool,
  append: PropTypes.bool,
  state: PropTypes.object
};
