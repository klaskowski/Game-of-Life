# Game-of-Life
Yet another naive implementation of a well-known cellular automaton.

- It's browser-only
- It has no external dependency, requires canvas and ES6 support though
- It's purpose is to play with the Conway's Game of Life concept in the browser and to be able to inject its visualization into components
- It creates infinite field with edges stitched together
- It is based on decoupled update-render loop and `requestAnimationFrame()` (no buffering, as computation takes more time than rendering)
- It has no optimizations applied to the algorithm, so that the code and game rules were easy to follow and extend

## Usage
Game-of-Life inserts a canvas into the first element with `data-gol-container` attribute, making the canvas same size as the container. Simply add the `gol.js` to the end of `<body>` - IIFE will fire then and visualization will begin. Simulation can be paused using `p` key

[Demo](http://klaskowski.github.io/Game-of-Life/)

## Future plans
- [ ] Random setup and parameterization

Currently, the field starts with predefined set of patterns. Instead, a random formation, based on user's input, would be preferable. Also, things like update frequency could be set by script caller.

- [ ] Algorithm optimization

In case Game-of-Life was used for visualizing greater fields or at higher speed, some optimizations may be neccessary. The simplest that comes to my mind, that could increase the speed of simulation is to cache neighbours count in cell model. Hashlife is supposed to be the fastest algorithm to cellular automata algorithm and might be interesting direction to move towards.

- [ ] Scaling

As of now, one cell has fixed size of 4 pixels (2x2). It looks ok now, but a parameter may come handy later on. Some parts of the code were already written with that in mind.

- [ ] Some way to interact with current state

As a viewer, sometimes I would like to "put some life" into the field when "still lives" took all over the place and nothing is happening.

- [ ] "Time travel"

As an extension to previous point - let's make it possible to rewind to some previous state and amend it.

- [ ] Universal module definition and ability to run simulation on demand instead of on load

Seems like a realistic need in further usage.

## Contributions
Anything will be welcome. Please refer to the [Future Plans](https://github.com/klaskowski/Game-of-Life#future-plans) and issues page to see what changes/improvements may be welcome, or suggest one yourself :)