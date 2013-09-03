(function () {
	'use strict';
var Timer = function (options) {

	var defaultOptoins = {
		tick    : 1,
		onstart : function () {},
		onstop  : function () {},
		onpause : function () {},
		onend   : function () {},
		ontick  : function () {}
	};

	//extend options with defaultOptoins
	if (typeof(options) === 'object') {
		for (var prop in defaultOptoins) {
			if (!options.hasOwnProperty(prop)) {
				options[prop] = defaultOptoins[prop];
			}
		}
	} else {
		options = defaultOptoins;
	}

	// private variables
	var that = {
			id : +new Date(),
			duration : 0,
			status : 'initialized',
			start : 0
		},
		timeout,
		interval;

	function start(duration) {
		if (!+duration && !that.duration) {
			return end();
		} else {
			duration *= 1000;
		}

		if (timeout && that.status === 'started') return this;

		that.duration = duration = that.duration === 0 ? duration : that.duration;
		timeout = setTimeout(end, duration);
		that.start = +new Date();
		if (options.ontick !== defaultOptoins.ontick) {
			interval = setInterval(function() {
				options.ontick( getDuration() );
			}, +options.tick * 1000);
		}
        that.status = 'started';
		options.onstart();
		return this;
	}

	function stop() {
		clearTimeout(timeout);
		clearInterval(interval);
        that.duration = 0;
        that.status = 'stopped';
		options.onstop();
		return this;
	}

	function pause() {
		that.duration = that.duration - (+new Date() - that.start);
		clearTimeout(timeout);
		clearInterval(interval);
        that.status = 'paused';
		options.onpause();
		return this;
	}

	function end() {
		clearTimeout(timeout);
		clearInterval(interval);
        that.duration = 0;
        that.status = 'finished';
		options.onend();
		return this;
	}

	function getStatus() {
		return that.status;
	}

	function getDuration() {
		return Math.round((that.duration - (+new Date() - that.start)) / 1000);
	}

	function on(option, value) {
		if (typeof(option) !== 'string' || typeof(value) !== 'function') return;
		if (option.indexOf('on') !== 0) {
			option = 'on' + option;
		}
		if (options.hasOwnProperty(option)) {
			options[option] = value;
		}
		return this;
	}

	function off(option) {
		if (typeof(option) !== 'string') {
			return;
		} else {
			option = option.toLowerCase();
		}
		if (option === 'all') {
			options = defaultOptoins;
		} else {
			if (option.indexOf('on') !== 0) {
				option = 'on' + option;
			}
			if (options.hasOwnProperty(option)) {
				options[option] = defaultOptoins[option];
			}
		}
		return this;
	}

	return {
		start 		: start,
		stop 		: stop,
		pause 		: pause,
		on 			: on,
		off			: off,
		getStatus 	: getStatus,
		getDuration : getDuration
	};
};

	//export Timer for Node or as global variable in browser
	var root = this;

	if (typeof(exports) !== 'undefined') {
		if (typeof(module) !== 'undefined' && module.exports) {
			exports = module.exports = Timer;
		}
		exports.Timer = Timer;
	} else {
		root.Timer = Timer;
	}

}).call(this);