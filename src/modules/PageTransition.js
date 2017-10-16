import React from 'react';
import PropTypes from 'prop-types';
import { VelocityTransitionGroup } from 'velocity-react';
import History from '../state/History';

// Class defining the actual transitions
export default class PageTransition extends React.Component {
  constructor(props) {
    super(props);
    this.setDefaults();
    this.setBinds();
    this.setRoutes();
  }

  componentDidMount() {
    this.setPageForRoute(this.state.currentRoute);
  }

  setDefaults() {
    this.state = {
      currentRoute: window.location.pathname,
      prevRoute: null,
      currentPage: null,
    };
    this.currentAction = '';
    this.routes = {};
  }

  setBinds() {
    History.listen(this.historyChange.bind(this));
  }

  /**
   * setRoutes - Creates route object
   * Each route has a string path as a key, and a component (page)
   * as the value
   *
   * @return {void}
   */
  setRoutes() {
    const routes = {};
    for (let i = 0; i < this.props.routes.length; i+=1) {
      const routeItem = this.props.routes[i];
      routes[routeItem.props.path] = routeItem;
    }
    this.routes = routes;
  }

  /**
   * setPageForRoute - Sets the current page
   *
   * @param  {String} route - the page that should be loaded
   * @return {void}
   */
  setPageForRoute(route) {
    const page = this.getPageForRoute(route);
    this.setState({ currentPage: page });
  }

  /**
   * getPageForRoute - Retrieves the requested page or null
   * if it doesn't exist
   *
   * @param  {type} path - the page that should be loaded
   * @return {Page} Page component
   */
  getPageForRoute(path) {
    const page = this.routes[path];
    if (typeof page === 'object') {
      return page;
    } else {
      return null;
    }
  }

  /**
   * historyChange - History callback function
   * Initiates page change
   *
   * @param  {Object} location - Window location object
   * @param  {String} action - PUSH or POP
   * @return {void}
   */
  historyChange(location, action) {
    this.goToRoute(location.pathname, action);
  }

  /**
   * goToRoute - Begin page transition to requested page
   *
   * @param  {String} route - Page to transition to
   * @param  {String} action - OPTIONAL for handling history PUSH or POP differently
   * @return {void}
   */
  goToRoute(route, action) {
    this.currentAction = action ? action.toLowerCase() : null;
    this.routeWillChange(route);
  }

  /**
   * routeWillChange - Function called before route changes.
   * Notifies parent if `routeWillChange` passed as prop
   *
   * @param  {String} route - Page to be loaded
   * @return {void}
   */
  routeWillChange(route) {
    // Notify parent if needed
    if (typeof this.props.routeWillChange === 'function') {
      this.props.routeWillChange(route);
    }

    // Set current route and previous route.
    this.setState({
      currentRoute: route,
      prevRoute: this.state.currentRoute,
      currentPage: null,
    });
  }

  /**
   * routeDidChange - Function called after route changed
   * Notifies parent if `routeDidChange` passed as prop
   *
   * @return {void}
   */
  routeDidChange() {
    // Notify parent if needed
    if (typeof this.props.routeDidChange === 'function') {
      this.props.routeDidChange(route);
    }
  }

  /**
   * enterPageBegin - Function called when enter animation begins
   *
   * @return {void}
   */
  enterPageBegin() {
    // Notify parent if needed
    if (typeof this.props.enterAnimationBegin === 'function') {
      this.props.enterAnimationBegin(route);
    }
  }

  /**
   * enterPageComplete - Function called after page enter animation complete
   *
   * @return {void}
   */
  enterPageComplete() {
    this.routeDidChange();
  }


  /**
   * exitPageBegin - Function called when exit animation begins
   *
   * @return {void}
   */
  exitPageBegin() {
    // Notify parent if needed
    if (typeof this.props.exitAnimationBegin === 'function') {
      this.props.exitAnimationBegin(route);
    }
  }

  /**
   * exitPageComplete - Function called after page finished exiting
   *
   * @return {type}  description
   */
  exitPageComplete() {
    this.setPageForRoute(this.state.currentRoute);
  }

  /**
   * createAnimations - Creates animations based on current action and load status
   *
   * @return {Object}  Object containing `enterAnimation` and `exitAnimation`
   */
  createAnimations() {
    const currentPage = this.getPageForRoute(this.state.currentRoute);
    // All animations merged into one object. If a route has a specific animation,
    // that animation will override the general animations.
    const animations = Object.assign({}, this.props.animations, currentPage.props.animations);

    let newEnterAnimation = null;
    let newExitAnimation = null;

    // If we even have animations
    if (animations) {
      // HANDLE LOADING ANIMATIONS
      if (this.currentAction === ''
        && this.props.loadAnimationName
        && animations[this.props.loadAnimationName]) {
        newEnterAnimation = animations[this.props.loadAnimationName];
      } else if (this.currentAction === History.directions.push.toLowerCase()
        || this.currentAction === History.directions.pop.toLowerCase()) {
        // If we're coming from a history action
        const actionAnimations = animations[this.currentAction];
        if (actionAnimations.enter) { newEnterAnimation = actionAnimations.enter; }
        if (actionAnimations.exit) { newExitAnimation = actionAnimations.exit; }
      }
    }

    // Set the default animations if no animations were found
    if (!newEnterAnimation) { newEnterAnimation = { animation: { opacity: [1, 0] }, duration: 300 }; }
    if (!newExitAnimation) { newExitAnimation = { animation: { opacity: [0, 1] }, duration: 300 }; }

    // Set completion handlers
    // BEGIN
    newEnterAnimation.begin = this.enterPageBegin.bind(this);
    newExitAnimation.begin = this.exitPageBegin.bind(this);
    // COMPLETE
    newEnterAnimation.complete = this.enterPageComplete.bind(this);
    newExitAnimation.complete = this.exitPageComplete.bind(this);

    return {
      enterAnimation: newEnterAnimation,
      exitAnimation: newExitAnimation,
    };
  }

  render() {
    const { enterAnimation, exitAnimation } = this.createAnimations();
    return (
      <div className="page-transition">
        <button onClick={() => { History.push('/test'); }} />
        <VelocityTransitionGroup
          enter={enterAnimation}
          leave={exitAnimation}
          runOnMount
        >
          {this.state.currentPage}
        </VelocityTransitionGroup>
      </div>
    );
  }
}

PageTransition.propTypes = {
  routes: PropTypes.array.isRequired,
  routeWillChange: PropTypes.func,
  routeDidChange: PropTypes.func,
  exitAnimationBegin: PropTypes.func,
  enterAnimationBegin: PropTypes.func,
  animations: PropTypes.object,
  loadAnimationName: PropTypes.string,
};
