## Three-Frame Solar System Model

Working model hosted at https://tearlant.github.io/solar-system/

This project demonstrates how simple it is to model a solar system with a sun, orbited by planets, which are orbited by moons, which could theoretically be orbited by moons of moons, and moons of moons of moons, etc.

In the source code, variable names use the astronomy terms "satellite" and "primary" to distinguish bodies. A satellite orbits its primary.

As all bodies are constantly moving and rotating, it is simple to animate a satellite with respect to its primary, but the system can become complex as every primary has a different set of local coordinates. By using a three-frame algorithm at the back end, the front end logic is simplified so that planets and moons can be added and their paramaters can be dynamically adjusted, and there are no calculations seen in the front end code.

# Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.3.

# Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# Licence

Shared under an MIT Licence. Copyright 2022 T.J. Anthony.
