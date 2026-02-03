# Timer.js

Tiny, zero-dependency, event-driven countdown timer for Node.js and browsers.
Simple and lightweight, zero-dependency library to create and manage, well, _timers_.

- Chainable API
- No runtime dependencies
- UMD build for browsers and CommonJS/ESM interop for Node.js
- TypeScript definitions included

## Install

```sh
npm install timer.js
```

## Quick start

```js
const Timer = require("timer.js");

const pizzaTimer = new Timer({
  onend: () => console.log("Pizza is ready"),
});

pizzaTimer.start(15 * 60);
```

## Usage

Timer.js is published as a UMD bundle and works in browsers and Node.js.

### Node.js (CommonJS)

```js
const Timer = require("timer.js");
const timer = new Timer();
```

### Node.js (ESM)

```js
import Timer from "timer.js";
const timer = new Timer();
```

### Browser (UMD)

```html
<script src="./node_modules/timer.js/dist/timer.js"></script>
<script>
  const timer = new Timer();
</script>
```

## API

All methods return `this` for chaining.

```js
myTimer.start(10).on("pause", doSmth).pause().on("end", doSmthElse).start(); // and so on
```

All callbacks and event handlers receive the timer instance as `this`.

### Constructor

```js
const timer = new Timer(options);
```

### Options

| Option    | Type                   | Default | Notes                                                |
| --------- | ---------------------- | ------- | ---------------------------------------------------- |
| `tick`    | `number`               | `1`     | Tick interval in seconds.                            |
| `onstart` | `(ms: number) => void` | `null`  | Called when the timer starts. Receives remaining ms. |
| `ontick`  | `(ms: number) => void` | `null`  | Called on each tick. Receives remaining ms.          |
| `onpause` | `() => void`           | `null`  | Called when the timer pauses.                        |
| `onstop`  | `() => void`           | `null`  | Called when the timer stops.                         |
| `onend`   | `() => void`           | `null`  | Called when the timer ends naturally.                |

### Events

You can register handlers with `on()` using either `"event"` or `"onevent"` names.

- `start` or `onstart`
- `tick` or `ontick`
- `pause` or `onpause`
- `stop` or `onstop`
- `end` or `onend`

### Methods

- `start(durationSeconds?)` Start a countdown in seconds. If omitted, it reuses the last duration (e.g., resume after pause).
- `pause()` Pause a running timer and preserve remaining time (no-op if not started).
- `stop()` Stop the timer and reset remaining time to 0 (no-op if not started or paused).
- `getDuration()` Return remaining time in milliseconds.
- `getStatus()` Return `"initialized" | "started" | "paused" | "stopped"`.
- `options(options | key, value)` Set one or many options.
- `on(event, handler)` Register an event handler.
- `off(event)` Remove handlers; `"all"` resets everything to defaults.
- `measureStart(label?)` Start a measurement timer (label optional).
- `measureStop(label?)` Stop the measurement and return elapsed ms.

### Behavior notes

- `start()` without a valid duration only works when resuming a paused timer.
- `start()` while already started is a no-op.
- `getDuration()` returns `0` when the timer is not started or paused.

## TypeScript

Type definitions are shipped in `dist/timer.d.ts`.

```ts
import Timer from "timer.js";

const timer = new Timer({
  ontick: (ms) => console.log(ms),
});
```

## Releasing

Releases are automated via `semantic-release` on the `master` branch and require
conventional commit messages. Commit hooks are enforced via Husky + lint-staged.

## Contributing

Issues and pull requests are welcome. Feel free to create an issue or a pull request.
A minimal repro when creating an issue is much appreciated.

## License

[MIT](LICENCE)
