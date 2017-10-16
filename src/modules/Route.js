import React from 'react';
import PropTypes from 'prop-types';

export default class Route extends React.Component {
  constructor(props) {
    super(props);
    this.animations = this.props.animations;
  }

  render() {
    return this.props.component();
  }
}

Route.propTypes = {
  path: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
  exact: PropTypes.bool,
  animations: PropTypes.object,
};
