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
    this.setRoutes(this.props.routes);
  }

  componentDidMount() {
    // Set the initial page to our current route
    this.setPageForRoute(this.state.currentRoute);
  }

  componentWillUpdate(nextProps, nextState) {
    this.setRoutes(this.props.routes);
  }

  setDefaults() {
    this.state = {
      currentRoute: window.location.pathname,
      prevRoute: null,
      currentPage: null,
      pageList: [],
    };
    // Current action --> POP or PUSH
    this.currentAction = '';
    // Start with empty route objects, to be constructed in `setRoutes`
    // exactRoutes have an exact path and don't anticipate parameters
    // at the end of a url
    this.exactRoutes = {};
    // approxRoutes can have parameters at the end of a url
    // but they are not as efficient
    this.approxRoutes = {};
    this.setRoutes(this.props.routes);
  }

  setBinds() {
    History.listen(this.historyChange.bind(this));
  }

  getSerialize() {
    // Default to chaining animations
    return (this.props.serialize == null || this.props.serialize ? true : false);
  }

  /**
   * setRoutes - Creates route object
   * Each route has a string path as a key, and a component (page)
   * as the value
   *
   * @return {void}
   */
  setRoutes(routes) {
    const exactRoutes = {};
    const approxRoutes = {};
    for (let i = 0; i < routes.length; i+=1) {
      const routeItem = routes[i];
      // If the route item path has a slash at the end of it
      // we want to get rid of that so it's easier to look up
      // that path later (consistent formatting wise)
      let routePath = this.getFormattedRoute(routeItem.props.path);
      // Set the route to the correct route object
      if (routeItem.props.exact) {
        exactRoutes[routePath] = routeItem;
      } else {
        approxRoutes[routePath] = routeItem
      }
    }
    this.exactRoutes = exactRoutes;
    this.approxRoutes = approxRoutes;
  }

  /**
   * setPageForRoute - Sets the current page
   *
   * @param  {String} route - the page that should be loaded
   * @return {void}
   */
  setPageForRoute(route) {
    const page = this.getPageForRoute(route);
    this.setPageList(page);
    this.setState({ currentPage: page });
  }

  setPageList(page) {
    // If the currentPage is meant to be appended (like if we want to do a modal or something)
    // then append it to the list of pages currently visible. Otherwise we just replace the
    let pageList = this.state.pageList;
    // current page list with the currentPage
    if (page && page.props.childOf) {
      const parentRoute = this.getFormattedRoute(page.props.childOf);
      const parent = this.getPageForRoute(parentRoute);
      pageList = [parent, page];
    } else {
      pageList = [page];
    }
    this.setState({ pageList: pageList })
  }

  /**
   * getFormattedRoute - Takes a route string and returns a route formatted correctly
   *
   * @param  {String} route - the string path of a route
   * @return {String}       the formatted route
   */
  getFormattedRoute(route) {
    if (route[route.length - 1] === '/') {
      return route.slice(0, -1);
    }
    return route;
  }

  /**
   * getPageForRoute - Retrieves the requested page or null
   * if it doesn't exist
   *
   * @param  {type} path - the page that should be loaded
   * @return {Page} Page component
   */
  getPageForRoute(path) {
    const testPath = this.getFormattedRoute(path);
    // First check to see if the page is in the exactRoutes object
    let page = this.exactRoutes[testPath];
    // Otherwise we check to see if it's in the approxRoutes object
    if (!page){
      const keys = Object.keys(this.approxRoutes);
      let bestMatchPath = '';
      let parameterString = '';
      for (let i = 0; i < keys.length; i++){
        const newPath = keys[i];
        const pathArray = testPath.split(newPath);
        // If there was a match, we found a possible winner
        if (pathArray && pathArray.length === 2 && bestMatchPath.length < newPath.length) {
          bestMatchPath = newPath;
          parameterString = pathArray[1];
        }
      }
      // We found our approximated page
      page = this.approxRoutes[bestMatchPath];
      // If we need to pass parameters to our page
      if (parameterString !== '') {
        page = React.cloneElement(page, { urlParameters: parameterString});
      }
    }

    // If the page exists, we just want to return it,
    // otherwise we return null so it never returns 'undefined'
    return page || null;
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
    // If we're meant to chain the animations, set the current page to null
    // so that the first page can transition out.
    // If we're not supposed to serialize, set the new current page to the current
    // route so that the new page can transition in while the other page is
    // transitioning out
    const currentPage = (this.getSerialize() ? null : this.getPageForRoute(route));
    this.setPageList(currentPage);

    this.setState({
      currentRoute: route,
      prevRoute: this.state.currentRoute,
      currentPage: currentPage,
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
    // Notify parent if needed
    if (typeof this.props.enterAnimationFinish === 'function') {
      this.props.enterAnimationFinish(route);
    }
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
    // Notify parent if needed
    if (typeof this.props.exitAnimationFinish === 'function') {
      this.props.exitAnimationFinish(route);
    }

    // If we're supposed to chain the animations
    if (this.getSerialize()) {
      // Change the page to the new route
      this.setPageForRoute(this.state.currentRoute);
    }
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
        const actionAnimations = animations[this.currentAction] || {};
        if (actionAnimations.enter) { newEnterAnimation = actionAnimations.enter; }
        if (actionAnimations.exit) { newExitAnimation = actionAnimations.exit; }
      }
    }

    // Set the default animations if no animations were found
    if (!newEnterAnimation) { newEnterAnimation = { animation: { opacity: [1, 0] }, duration: 500 }; }
    if (!newExitAnimation) { newExitAnimation = { animation: { opacity: [0, 1] }, duration: 500 }; }

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
    const styles = { position: 'relative' };
    return (
      <div className="page-transition" style={styles}>
        <VelocityTransitionGroup
          enter={enterAnimation}
          leave={exitAnimation}
          runOnMount
        >
          {this.state.pageList}
        </VelocityTransitionGroup>
      </div>
    );
  }
}

PageTransition.propTypes = {
  routes: PropTypes.array.isRequired,
  routeWillChange: PropTypes.func,
  routeDidChange: PropTypes.func,
  exitAnimationFinish: PropTypes.func,
  exitAnimationBegin: PropTypes.func,
  enterAnimationBegin: PropTypes.func,
  enterAnimationFinish: PropTypes.func,
  animations: PropTypes.object,
  loadAnimationName: PropTypes.string,
  serialize: PropTypes.bool,
};
