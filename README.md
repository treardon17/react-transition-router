# A router for React with lifecycle hooks and animations

* Animations made with [velocity-react](https://github.com/google-fabric/velocity-react)
* Extends [history](https://github.com/ReactTraining/history) for directional animations

---

## Route
### Props
* `path`: PropTypes.string.isRequired
* `component`: PropTypes.func.isRequired
* `exact`: PropTypes.bool
* `animations`: PropTypes.object

#### path: REQUIRED
A unique path that determines the URL to a `component`

#### component: REQUIRED
The element that will be available at the `path`

#### exact
Not yet implemented

#### animations
Specific animations for a particular page.  This will override any generic animations provided to the `PageTransition`.  See `animations` in `PageTransition` for more details on how to format the animations.

---

## PageTransition
### Props
* `routes`: PropTypes.array.isRequired
* `routeWillChange`: PropTypes.func
* `routeDidChange`: PropTypes.func
* `exitAnimationBegin`: PropTypes.func
* `enterAnimationBegin`: PropTypes.func
* `loadAnimationName`: PropTypes.string
* `animations`: PropTypes.object

#### routes
List of `Route` items

#### routeWillChange
Callback function triggered before the route changes to a different page

#### routeDidChange
Callback function triggered after a route changed to a different page (after all animations have completed)

#### exitAnimationBegin
Callback function triggered when the animation of the leaving page begins

#### enterAnimationBegin
Callback function triggered when the animation of the entering page begins

#### loadAnimationName
The name of the animation that should occur on page load. See `animations` for an example.

#### animations
An object defining the animations that should happen. Every animation object should have a `push` and a `pop` key, which each should contain a `enter` and `exit` key.  `push` events occur when either a new route was pushed to the history, or when the forward button in the browser is clicked.  `pop` events occur when the back button in the browser is clicked. The `enter` animation refers to the page entering the screen, and the `exit` animation refers to the page exiting.

Each animation should be formatted via the [Velocity](http://velocityjs.org/) documentation.  All of these animations are placed into `Velocity`'s `VelocityTransitionGroup`.

Example:
```
const animationObject = {
  load: { animation: { opacity: [1, 0], translateY: ['0%', '100%'] }, duration: 600 },
  pop: {
    enter: { animation: { opacity: [1, 0], translateX: ['0%', '100%'] }, duration: 500 },
    exit: { animation: { opacity: [0, 1], translateX: ['-100%', '0%'] }, duration: 500 },
  },
  push: {
    enter: { animation: { opacity: [1, 0], translateX: ['0%', '-100%'] }, duration: 500 },
    exit: { animation: { opacity: [0, 1], translateX: ['100%', '0%'] }, duration: 500 },
  },
};
```


___

## Example Usage
```
import React from 'react';
import AppState from './state/AppState';
import { PageTransition, Route } from 'react-transition-router';
// import pages
import Home from './pages/Home';
import Test from './pages/Test';

// create global state
const appState = new AppState();

export default class Routes extends React.Component {
  constructor(props) {
    super(props);

    const animationObject = {
      load: { animation: { opacity: [1, 0], translateY: ['0%', '100%'] }, duration: 500 },
      pop: {
        enter: { animation: { opacity: [1, 0], translateX: ['0%', '100%'] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateX: ['-100%', '0%'] }, duration: 500 },
      },
      push: {
        enter: { animation: { opacity: [1, 0], translateX: ['0%', '-100%'] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateX: ['100%', '0%'] }, duration: 500 },
      },
    };

    this.state = {
      routes: [
        <Route exact path="/" key="Home" component={() => <Home state={appState} />} animations={animationObject} />,
        <Route exact path="/test" key="Test" component={() => <Test state={appState} />} />,
      ],
    };
  }

  render() {
    const animationObject = {
      load: { animation: { opacity: [1, 0], translateY: ['0%', '100%'] }, duration: 600 },
      pop: {
        enter: { animation: { opacity: [1, 0], translateX: ['0%', '100%'] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateX: ['-100%', '0%'] }, duration: 500 },
      },
      push: {
        enter: { animation: { opacity: [1, 0], translateX: ['0%', '-100%'] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateX: ['100%', '0%'] }, duration: 500 },
      },
    };

    return (
      <div id="app-container">
        <PageTransition
          routes={this.state.routes}
          animations={animationObject}
          loadAnimationName="load"
        />
      </div>
    );
  }
}

```
