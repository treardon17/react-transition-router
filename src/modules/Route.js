import React from 'react';
import PropTypes from 'prop-types';

export default class Route extends React.Component {
  constructor(props) {
    super(props);
    this.animations = this.props.animations;
    // Default to position absolute
    this.absolute = (this.props.absolute == null || this.props.absolute ? true : false);
  }

  render() {
    const styles = this.absolute ? { position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, } : { };
    return (
      <div className="route" style={styles}>
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
