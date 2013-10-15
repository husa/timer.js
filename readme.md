#### Timer.js is lightweight(1.9kb) JavaScript library for creating timers, supporting browsers and Node.js applications

----
If you've found a bug, something is not working as it shoud be or you came up with some new cool
feature, feel free to create an issue [here](https://github.com/husa/timer.js/issues "timer.js issues")

----

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

### Modular

#### CommonJS(Node)

```JavaScript
var Timer = require('./timer'); // import timer

var myTimer = new Timer(); //use it as you want

```
#### AMD

```JavaScript

define(['timer'], function(Timer){
    var myTimer = new Timer(); //use it as you want
})

```

## API

All methods listed below support chainig, so you can write your code as:

```javascript
myTimer.start(10).on('pause', doSmth).pause(); // and so on
```

Also you can use ```this``` keyword inside of methods as a reference to the instance of Timer

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

#### .options()

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

#### .measureStart(label)

Start a high-performance measurement with an associated label, you need to use
the same label to stop measurement, so be sure you've saved it

#### .measureStop(label)

Stop the measument with the associated label, returns the numbers of elapsed ms

Example

```javascript

myTimer.measureStart('just a stupid loop');
var a = [];
for (var i = 10000000; i >= 0; i--) {
    a.push(i * Math.random());
};
var loopTime = myTimer.measureStop('just a stupid loop');
```
