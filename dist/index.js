(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["react-transition-router"] = factory();
	else
		root["react-transition-router"] = factory();
})(this, function() {
return webpackJsonpreact_transition_router([1],{

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_velocity_react__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_velocity_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_velocity_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__state_History__ = __webpack_require__(71);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






// Class defining the actual transitions

var PageTransition = function (_React$Component) {
  _inherits(PageTransition, _React$Component);

  function PageTransition(props) {
    _classCallCheck(this, PageTransition);

    var _this = _possibleConstructorReturn(this, (PageTransition.__proto__ || Object.getPrototypeOf(PageTransition)).call(this, props));

    _this.setDefaults();
    _this.setBinds();
    _this.setRoutes();
    return _this;
  }

  _createClass(PageTransition, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Set the initial page to our current route
      this.setPageForRoute(this.state.currentRoute);
    }
  }, {
    key: 'setDefaults',
    value: function setDefaults() {
      this.state = {
        currentRoute: window.location.pathname,
        prevRoute: null,
        currentPage: null
      };
      // Current action --> POP or PUSH
      this.currentAction = '';
      // Start with empty route object, to be constructed in `setRoutes`
      this.routes = {};
      // Default to chaining animations
      this.serialize = this.props.serialize == null || this.props.serialize ? true : false;
    }
  }, {
    key: 'setBinds',
    value: function setBinds() {
      __WEBPACK_IMPORTED_MODULE_3__state_History__["a" /* default */].listen(this.historyChange.bind(this));
    }

    /**
     * setRoutes - Creates route object
     * Each route has a string path as a key, and a component (page)
     * as the value
     *
     * @return {void}
     */

  }, {
    key: 'setRoutes',
    value: function setRoutes() {
      var routes = {};
      for (var i = 0; i < this.props.routes.length; i += 1) {
        var routeItem = this.props.routes[i];
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

  }, {
    key: 'setPageForRoute',
    value: function setPageForRoute(route) {
      var page = this.getPageForRoute(route);
      this.setState({ currentPage: page });
    }

    /**
     * getPageForRoute - Retrieves the requested page or null
     * if it doesn't exist
     *
     * @param  {type} path - the page that should be loaded
     * @return {Page} Page component
     */

  }, {
    key: 'getPageForRoute',
    value: function getPageForRoute(path) {
      var page = this.routes[path];
      if ((typeof page === 'undefined' ? 'undefined' : _typeof(page)) === 'object') {
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

  }, {
    key: 'historyChange',
    value: function historyChange(location, action) {
      this.goToRoute(location.pathname, action);
    }

    /**
     * goToRoute - Begin page transition to requested page
     *
     * @param  {String} route - Page to transition to
     * @param  {String} action - OPTIONAL for handling history PUSH or POP differently
     * @return {void}
     */

  }, {
    key: 'goToRoute',
    value: function goToRoute(route, action) {
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

  }, {
    key: 'routeWillChange',
    value: function routeWillChange(route) {
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
      this.setState({
        currentRoute: route,
        prevRoute: this.state.currentRoute,
        currentPage: this.serialize ? null : this.getPageForRoute(route)
      });
    }

    /**
     * routeDidChange - Function called after route changed
     * Notifies parent if `routeDidChange` passed as prop
     *
     * @return {void}
     */

  }, {
    key: 'routeDidChange',
    value: function routeDidChange() {
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

  }, {
    key: 'enterPageBegin',
    value: function enterPageBegin() {
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

  }, {
    key: 'enterPageComplete',
    value: function enterPageComplete() {
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

  }, {
    key: 'exitPageBegin',
    value: function exitPageBegin() {
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

  }, {
    key: 'exitPageComplete',
    value: function exitPageComplete() {
      // Notify parent if needed
      if (typeof this.props.exitAnimationFinish === 'function') {
        this.props.exitAnimationFinish(route);
      }

      // If we're supposed to chain the animations
      if (this.serialize) {
        // Change the page to the new route
        this.setPageForRoute(this.state.currentRoute);
      }
    }

    /**
     * createAnimations - Creates animations based on current action and load status
     *
     * @return {Object}  Object containing `enterAnimation` and `exitAnimation`
     */

  }, {
    key: 'createAnimations',
    value: function createAnimations() {
      var currentPage = this.getPageForRoute(this.state.currentRoute);
      // All animations merged into one object. If a route has a specific animation,
      // that animation will override the general animations.
      var animations = Object.assign({}, this.props.animations, currentPage.props.animations);

      var newEnterAnimation = null;
      var newExitAnimation = null;

      // If we even have animations
      if (animations) {
        // HANDLE LOADING ANIMATIONS
        if (this.currentAction === '' && this.props.loadAnimationName && animations[this.props.loadAnimationName]) {
          newEnterAnimation = animations[this.props.loadAnimationName];
        } else if (this.currentAction === __WEBPACK_IMPORTED_MODULE_3__state_History__["a" /* default */].directions.push.toLowerCase() || this.currentAction === __WEBPACK_IMPORTED_MODULE_3__state_History__["a" /* default */].directions.pop.toLowerCase()) {
          // If we're coming from a history action
          var actionAnimations = animations[this.currentAction] || {};
          if (actionAnimations.enter) {
            newEnterAnimation = actionAnimations.enter;
          }
          if (actionAnimations.exit) {
            newExitAnimation = actionAnimations.exit;
          }
        }
      }

      // Set the default animations if no animations were found
      if (!newEnterAnimation) {
        newEnterAnimation = { animation: { opacity: [1, 0] }, duration: 500 };
      }
      if (!newExitAnimation) {
        newExitAnimation = { animation: { opacity: [0, 1] }, duration: 500 };
      }

      // Set completion handlers
      // BEGIN
      newEnterAnimation.begin = this.enterPageBegin.bind(this);
      newExitAnimation.begin = this.exitPageBegin.bind(this);
      // COMPLETE
      newEnterAnimation.complete = this.enterPageComplete.bind(this);
      newExitAnimation.complete = this.exitPageComplete.bind(this);

      return {
        enterAnimation: newEnterAnimation,
        exitAnimation: newExitAnimation
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _createAnimations = this.createAnimations(),
          enterAnimation = _createAnimations.enterAnimation,
          exitAnimation = _createAnimations.exitAnimation;

      var styles = { position: 'relative' };
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        { className: 'page-transition', style: styles },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2_velocity_react__["VelocityTransitionGroup"],
          {
            enter: enterAnimation,
            leave: exitAnimation,
            runOnMount: true
          },
          this.state.currentPage
        )
      );
    }
  }]);

  return PageTransition;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

/* harmony default export */ __webpack_exports__["a"] = (PageTransition);


PageTransition.propTypes = {
  routes: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.array.isRequired,
  routeWillChange: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
  routeDidChange: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
  exitAnimationFinish: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
  exitAnimationBegin: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
  enterAnimationBegin: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
  enterAnimationFinish: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
  animations: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object,
  loadAnimationName: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
  serialize: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool
};

/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var Route = function (_React$Component) {
  _inherits(Route, _React$Component);

  function Route(props) {
    _classCallCheck(this, Route);

    var _this = _possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).call(this, props));

    _this.animations = _this.props.animations;
    // Default to regular positioning
    _this.absolute = _this.props.absolute;
    // This would make it default to true
    // (this.props.absolute == null || this.props.absolute ? true : false);
    return _this;
  }

  _createClass(Route, [{
    key: 'render',
    value: function render() {
      var positionStyles = this.absolute ? { position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 } : {};
      var animationStyles = { backfaceVisibility: 'hidden', WebkitPerspective: 1000 };
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        { className: 'route', style: Object.assign(positionStyles, animationStyles) },
        this.props.component()
      );
    }
  }]);

  return Route;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

/* harmony default export */ __webpack_exports__["a"] = (Route);


Route.propTypes = {
  path: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  component: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  exact: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
  animations: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object,
  absolute: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool
};

/***/ }),

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_PageTransition__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_Route__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__state_History__ = __webpack_require__(71);




/* harmony default export */ __webpack_exports__["default"] = ({
  PageTransition: __WEBPACK_IMPORTED_MODULE_0__modules_PageTransition__["a" /* default */],
  Route: __WEBPACK_IMPORTED_MODULE_1__modules_Route__["a" /* default */],
  History: __WEBPACK_IMPORTED_MODULE_2__state_History__["a" /* default */]
});

/***/ }),

/***/ 71:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_history_createBrowserHistory__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_history_createBrowserHistory___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_history_createBrowserHistory__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var History = function () {
  function History() {
    _classCallCheck(this, History);

    this.history = __WEBPACK_IMPORTED_MODULE_0_history_createBrowserHistory___default()();
    this.unlisten = null;
    this.listeners = {};
    this.hashHistory = [window.location.pathname];
    this.historyLength = window.history.length;
    this.currentRoute - window.location.pathname;
    this.allowPushDuplicates = false;
    this.setBinds();

    this.directions = {
      push: 'PUSH',
      pop: 'POP'
    };
  }

  /* eslint-disable */


  _createClass(History, [{
    key: 'guid',
    value: function guid() {
      var s4 = function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      };
      return '' + s4() + s4() + '-' + s4() + s4();
    }
    /* eslint-enable */

  }, {
    key: 'setBinds',
    value: function setBinds() {
      this.unlisten = this.history.listen(this.historyChanged.bind(this));
    }

    /**
     * listen - Subscribe to history changes.
     *
     * @param  {Function} callback - Function to be run when history change occurs
     * @return {String} Unique ID to reference listener
     */

  }, {
    key: 'listen',
    value: function listen(callback) {
      var id = this.guid();
      this.listeners[id] = callback;
      return id;
    }

    /**
     * Unsubscribe to the history change notifications.
     *
     * @param  {String} id - The string identifier returned by 'listen'
     * @return {void}
     */

  }, {
    key: 'unlisten',
    value: function unlisten(id) {
      this.listeners[id] = null;
      delete this.listeners[id];
    }

    /**
     * push - Push a route to the page history. This will change the page.
     * Also, to prevent loading the same page over and over again, this prevents
     * pushing the current path again, unless `this.allowPushDuplicates` is set to true
     *
     * @param  {String} path - Route to be pushed to the history
     * @return {void}
     */

  }, {
    key: 'push',
    value: function push(path) {
      if (this.currentRoute !== path || this.allowPushDuplicates) {
        this.currentRoute = path;
        this.history.push(path);
      }
    }

    /**
     * pop - Pop the history state --> go back one in history
     *
     * @return {void}
     */

  }, {
    key: 'pop',
    value: function pop() {
      this.history.goBack();
    }

    /**
     * getHistoryDirection - description
     *
     * We've gotta determine which direction in history we're going.
     * `action` will be `PUSH` only if we called History.push,
     * but not if we pressed the forward arrow in the browser.
     * Here we're checking to see if the route we're requesting was
     * the last page we were on.  If it is, we probably went backwards (POP)
     * in history.  Otherwise, we probably pushed (PUSH) to the history
     *
     * @param  {String} location - The path about to be loaded
     * @return {String} The direction the history is moving (PUSH is forward, POP is backwards)
     */

  }, {
    key: 'getHistoryDirection',
    value: function getHistoryDirection(location) {
      var prevRoute = this.hashHistory[this.hashHistory.length - 2];
      var currentRoute = location.pathname;

      if (prevRoute === currentRoute) {
        this.hashHistory.pop();
        return this.directions.pop;
      } else {
        this.hashHistory.push(location.pathname);
        return this.directions.push;
      }
    }

    /**
     * historyChanged - Notifies all listeners of history changes
     *
     * @param  {Object} location - window location object for new route
     * @param  {String} action - direction the history is heading
     * @return {void}
     */

  }, {
    key: 'historyChanged',
    value: function historyChanged(location, action) {
      // Get the direction (back button is POP, forward button is PUSH)
      var direction = this.getHistoryDirection(location);
      var keys = Object.keys(this.listeners);
      for (var i = 0; i < keys.length; i += 1) {
        var listener = this.listeners[keys[i]];
        if (typeof listener === 'function') {
          listener(location, direction);
        }
      }
    }
  }]);

  return History;
}();

var history = new History();
/* harmony default export */ __webpack_exports__["a"] = (history);

/***/ })

},[122]);
});