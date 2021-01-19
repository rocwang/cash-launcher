# Cash Launcher

[Video Demo][video demo] | [Live Demo][live demo]

This is the web app running on a user's mobile to control the custom-built
Cash Launcher.

## Architecture

This app connects to [the server][server] running in the Raspberry Pi that is
installed inside Cash Launcher. It uses WebSocket to transmit controlling data
like device orientation and swipe speed to the server in real-time. The server
uses such data to control the physical Cash Launcher, e.g. panning, tilting and
enabling the motor.

The app comes with 2 pages:

* Menu: provide a list of banknotes for users to choose.
* Stack: render the selected banknote as a stack of money. Users swipe up to
  dispense the banknote.

The app is built with Vue 3. Routing is handled by vue-router.
To achieve the best performance on mobile, the rendering of banknote stacks is
built with [konva][konva], an HTML 2d canvas library. rxjs is used to help
pipe data from user actions and device orientation events to WebSockets.

## UI Design

The original design can be found at [`design/design.sketch`][design].
The specimens of banknotes can be found in the
[`design/original-specimens`][specimens] folder.

## Development

### Available scripts

* Compiles and hot-reloads for development: `npm run dev`
* Compiles and minifies for production: `npm run build`
* Lints and fixes files `npm run lint`

### Customize configuration

See [Configuring Vite][conf].

[video demo]: https://www.youtube.com/watch?v=qdm6b15lcD4
[live demo]: https://cash.kiwiberry.nz/
[server]: https://github.com/rocwang/cash-launcher-server
[conf]: https://vitejs.dev/config/
[konva]: https://github.com/konvajs/konva
[design]: design/design.sketch
[specimens]: design
