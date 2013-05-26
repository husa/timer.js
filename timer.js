(function (_global_) {
	'use strict';
_global_.Timer = function (options) {

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
		for (var i in defaultOptoins) {
			if (!options.hasOwnProperty(i)) {
				options[i] = defaultOptoins[i];
			}
		}
	} else {
		options = defaultOptoins;
	}

	this.id = +new Date();
	this.duration = 0;
	this.status = 'initialized';

	var that = this,
		timeout,
		interval,
		time = {};

	function start(duration) {
		if (!+duration && !that.duration) {
			return end();
		} else {
			duration *= 1000;
		}
		if (timeout && that.status === 'started') return this;

		that.duration = duration = that.duration === 0 ? duration : that.duration;
		timeout = setTimeout(end, duration);
		time.start = +new Date();
		if (options.ontick !== defaultOptoins.ontick) {
			interval = setInterval(function() {
				options.ontick( getDuration() );
			}, options.tick * 1000);
		}
		options.onstart();
		that.status = 'started';
		return this;
	}

	function stop() {
		clearTimeout(timeout);
		clearInterval(interval);
		options.onstop();
		this.status = 'stopped';
		return this;
	}

	function pause() {
		that.duration = that.duration - (+new Date() - time.start);
		clearTimeout(timeout);
		clearInterval(interval);
		options.onpause();
		that.status = 'paused';
		return this;
	}

	function end() {
		clearTimeout(timeout);
		clearInterval(interval);
		options.onend();
		this.status = 'finished';
		return this;
	}

	function getStatus() {
		return that.status;
	}

	function getDuration() {
		return Math.round((that.duration - (+new Date() - time.start)) / 1000);
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
}(this));