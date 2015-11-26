# Timer.js
[![Build Status](https://travis-ci.org/husa/timer.js.svg?branch=master)](https://travis-ci.org/husa/timer.js)


Simple and lightweight library without any dependencies
 to create and manage, well, _timers_.

[Demo](https://husa.github.io/timer.js)

### Installation

The easiest way to install timer.js is via `npm`:

```console
$ npm install timer.js
```
or if you prefer good old files,
you can manually download [dev](https://raw.githubusercontent.com/husa/timer.js/master/dist/timer.js) or [min](https://raw.githubusercontent.com/husa/timer.js/master/dist/timer.min.js) versions.


### Examples

Let's cook pizza

```javascript
var pizzaTimer = new Timer();
var pizzaCookingTime = 15 * 60; // 15 minutes

timer.start(pizzaCookingTime).on('end', function () {
  alert('Pizza is ready, bon appetit!');
});
```

### Usage

Timer.js is written in ```UMD``` style, so it's compatible with AMD(Require.js), CommonJS(nodejs, browserify, etc.) and direct browser usage as a global.

### API

All methods listed below support chaining, so you can write:

```javascript
myTimer.start(10).on('pause', doSmth).pause(); // and so on
```

Also you can use ```this``` keyword inside of methods as a reference to the instance of Timer

#### initialization
To create Timer with specific event handlers and options you can pass them as argument to constructor

```javascript
var myTimer = new Timer(options);
```

list of available options:
* ontick - what to do on every tick
* tick - set specific tick(e.g. you can set it to 2, then your ontick handler will fire every 2 seconds)
* onstart - start event handler
* onstop - stop event handler
* onpause - pause event handler
* onend - end event handler(when Timer stops without interrupt)

```javascript
var myTimer = new Timer({
  tick    : 1,
  ontick  : function(sec) { console.log(sec + ' seconds left') },
  onstart : function() { console.log('timer started') },
  onstop  : function() { console.log('timer stop') },
  onpause : function() { console.log('timer set on pause') },
  onend   : function() { console.log('timer ended normally') }
});
```


#### `.start(time)`

starts a Timer for a specified time

```javascript
myTimer.start(10) // start a timer for 10 seconds
```

#### `.pause()`

pause timer

```javascript
myTimer.pause()
```
after pause you can continue the job by `myTimer.start()`

#### `.stop()`

to stop timer doing his job

```javaScript
myTimer.stop()
```

#### `.on(option, function)`

set some specific option,
support options without 'on' prefix. Available options are : ```tick, ontick, start, onstart, end, onend, stop, onstop, pause, onpause```

```javascript
myTimer.on('end', function() {
  console.log('woo-hooo! my timer ended normally')
})
```

#### `.off()`

similar to 'on()' but it will remove handler

```javascript
myTimer.off('pause')
```

#### `.options()`

define multiple specific options at once as an object


```javascript
myTimer.options({
    onend : function() {
        console.log('onend')
    },
    ontick : function() {
        console.log('every tick');
    }
})
```

You can use .off('all') to restore all previously defined options to defaults

```javascript
myTimer.off('all')
```

#### `.getStatus()`

get current status of timer. Available statuses are: ```'initialized', 'started', 'paused', 'stopped'```

```javaScript
myTimer.getStatus() // 'initialized'
myTimer.start(20).getStatus() // 'started'
myTimer.pause().getStatus() // 'paused'
```

#### `.getDuration()`

get remaining time(in ms)

```javaScript
myTimer.start(20)
// some operations that lasts for 2 seconds
myTimer.getDuration() // 18000
```

#### `.measureStart(label)`

Start a high-performance measurement with an associated label, you need to use
the same label to stop measurement, so make sure you've saved it

#### `.measureStop(label)`

Stop the measument with the associated label, returns the numbers of elapsed ms

Example:

```javascript

myTimer.measureStart('label1');
var a = [];
for (var i = 10000000; i >= 0; i--) {
    a.push(i * Math.random());
};
myTimer.measureStop('label1'); // 276 i.e.
```

> Note!
> '' (empty string) equals to absence of argument, and it is valid
> ```
> timer.measureStart();
> //some operations
> timer.measureStop();
> ```
> will work

## Tests
Running tests is pretty straightforward

```console
$ npm test
```
Tests are written with Jasmine, you can find all specs in `test/specs` folder.


## Contributing

If you've found a bug, something is not working as it shoud be or you came up with some new cool
feature, feel free to create an issue [here](http://github.com/husa/timer.js/issues "timer.js issues")
or send a pull request.


## Changelog
