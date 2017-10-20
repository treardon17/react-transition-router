# A router for React with lifecycle hooks and animations

* Animations made with [velocity-react](https://github.com/google-fabric/velocity-react)
* Extends [history](https://github.com/ReactTraining/history) for directional animations


---

## Route
### Props
* `path`: PropTypes.string.isRequired
* `component`: PropTypes.func.isRequired
* `exact`: PropTypes.bool
* `absolute`: PropTypes.bool
* `animations`: PropTypes.object

#### path: REQUIRED
A unique path that determines the URL to a `component`

#### component: REQUIRED
The element that will be available at the `path`

#### exact
Not yet implemented

#### absolute
Helpful for when animations are not serialized. Prevents elements transitioning from affecting each other's place on the page.  Adds `position: 'absolute'` and `top:0`, `bottom:0`, `left:0`, `right:0` to the routes. Defaults to `false`.

#### animations
Specific animations for a particular page.  This will override any generic animations provided to the `PageTransition`.  See `animations` in `PageTransition` for more details on how to format the animations.

---

## PageTransition
### Props
* `routes`: PropTypes.array.isRequired
* `routeWillChange`: PropTypes.func
* `routeDidChange`: PropTypes.func
* `exitAnimationBegin`: PropTypes.func
* `exitAnimationFinish`: PropTypes.func
* `enterAnimationBegin`: PropTypes.func
* `enterAnimationFinish`: PropTypes.func
* `loadAnimationName`: PropTypes.string
* `serialize`: PropTypes.bool
* `animations`: PropTypes.object

#### routes: REQUIRED
List of `Route` items

#### routeWillChange
Callback function triggered before the route changes to a different page

#### routeDidChange
Callback function triggered after a route changed to a different page (after all animations have completed)

#### exitAnimationBegin
Callback function triggered when the animation of the leaving page begins

#### exitAnimationFinish
Callback function triggered when the animation of the leaving page completes

#### enterAnimationBegin
Callback function triggered when the animation of the entering page begins

#### enterAnimationFinish
Callback function triggered when the animation of the entering page completes

#### loadAnimationName
The name of the animation that should occur on page load. See `animations` for an example.

#### serialize
Boolean determining whether or not the animations should chain one after the other, or happen concurrently.  Defaults to true so animations will chain.

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

---

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

___

## History
### How to push and pop the state
`import { History } from 'react-transition-router'`
* `listen(location, direction)`
* `unlisten(id)`
* `push(path)`
* `pop()`
* `allowPushDuplicates`: boolean


#### listen(callback)
Takes a callback function as a parameter that will be called every time the history is modified with the `push` or `pop` command, and returns a unique identifier that can be used to later remove the callback if necessary. The callback will be passed two parameters: the `path` being pushed, as well as the `direction` the history is going (PUSH or POP).

#### unlisten(id)
Takes the unique identifier string returned by the `listen` function and unregisters the callback function so it no longer receives callback notifications

#### push(path)
Pushes a new path to the history. This event will trigger the callback function passed into `listen`.

#### pop()
Pops a path from the history. This event will trigger the callback function passed into `listen`.

#### allowPushDuplicates
Defaults to false so the current path cannot be pushed again. If set to true, it allows the current path to be pushed to the history again.

---

## Example Usage

```
import { History } from 'react-transition-router';

History.listen((location, direction) => {
  console.log(`History changed to: ${location}, via ${direction}`);
});

History.push('/test');
History.pop();

```
