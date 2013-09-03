
#### Timer.js is lightweight(1.5kb) JavaScript library for creating timers with support for browsers and Node.js applications

## Basic Usage

### In Browser

To start using Timer.js in your client scripts you first have to include library

```
<script src="somepath/timer.js"></script>
```

And later somewhere in your script

```javascript
var myTimer = new Timer();
```

### Node.js

First you have to include 'timer' folder from '/node/node_modules' and import it to your 'node_modules'

```JavaScript
var Timer = require('timer'); // import timer

var myTimer = new Timer(); //use it as you want

```



## API

#### initialization

--

To create Timer with specific event handlers and options you can

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


#### .start(time)

starts a Timer for a specified time

```JavaScript
myTimer.start(10) // start a timer for 10 seconds
```

#### .pause()

set timer on pause

```javascript
myTimer.pause()
```
after pause you can continue job by ```myTimer.start()```

#### .stop()

to stop timer doing his job

```JavaScript
myTimer.stop()
```

#### .on(option, function)

set some specific option
support options without 'on' prefix. Available options are : ```tick, ontick, start, onstart, end, onend, stop, onstop, pause, onpause```

```javascript
myTimer.on('end', function() {
	console.log('woo-hooo! my timer ended normally')
})
```

#### .off()

similar to 'on()' but it will remove handler

```javascript
myTimer.off('pause')
```

You can use .off('all') to restore all previously defined options to defaults

```javascript
myTimer.off('all')
```

#### .getStatus()

get current status of timer. Available statuses are: ``` 'initialized', 'started', 'paused', 'stopped', 'finished' ```

```JavaScript
myTimer.getStatus() // 'initialized'
myTimer.start(20).getStatus() // 'started'
myTimer.pause().getStatus() // 'paused'
```

#### .getDuration()

get remaining time(in seconds)

```JavaScript
myTimer.start(20)
// some operations that lasts for 2 seconds
myTimer.getDuration() // 18
```

## TODO

- add support for high-performance measuring, something like measureStart() and measureStop() that returns elapsed time in ms between start and stop
- add .option() fuction to define multiple options as an objects
- reword extendinding functionality for defaultOptions