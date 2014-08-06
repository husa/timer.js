(function(root, factory){
  if (typeof define === 'function' && define.amd)
    define([], factory)
  else if (typeof exports === 'object')
    module.exports = factory()
  else
    root.Timer = factory()
}(this, function(){
  'use strict'

  var defaultOptions = {
    tick    : 1,
    onstart : null,
    ontick  : null,
    onpause : null,
    onstop  : null,
    onend   : null
  }

  var Timer = function (options) {
    if (!(this instanceof Timer)) return new Timer(options)
    this._ = {
        id       : +new Date(),
        options  : {},
        duration : 0,
        status   : 'initialized',
        start    : 0,
        measures : []
      }
    for (var prop in defaultOptions)
      this._.options[prop] = defaultOptions[prop]
    this.options(options)
  }

  Timer.prototype.start = function(duration) {
      var instance = this
      if (!+duration && !this._.duration)
        return this._end()
      else
        duration *= 1000
      if (this._.timeout && this._.status === 'started')
        return this
      this._.duration || (this._.duration = duration)
      this._.timeout = setTimeout(function(){
        instance._end.call(instance)
      }, this._.duration)
      if (this._.options.ontick !== defaultOptions.ontick)
        this._.interval = setInterval(function() {
          instance._trigger('ontick', instance, [instance.getDuration()])
        }, +this._.options.tick * 1000)
      this._.start = +new Date()
      this._.status = 'started'
      this._trigger('onstart', this, [this.getDuration()])
      return this
    }

  Timer.prototype.pause = function() {
    this._.duration -= (+new Date() - this._.start)
    this._clear(false)
    this._.status = 'paused'
    this._trigger('onpause', this)
    return this
  }

  Timer.prototype.stop = function() {
    this._clear(true)
    this._.status = 'stopped'
    this._trigger('onstop', this)
    return this
  }

  Timer.prototype._end = function() {
    this._clear(true)
    this._.status = 'finished'
    this._trigger('onend', this)
    return this
  }

  Timer.prototype._clear = function(clearDuration) {
    clearTimeout(this._.timeout)
    clearInterval(this._.interval)
    if (clearDuration)
      this._.duration = 0
  }

  Timer.prototype._trigger = function(event, scope, params) {
    typeof this._.options[event] === 'function' && this._.options[event].apply(scope, params)
  }

  Timer.prototype.getDuration = function() {
    if (this._.status !== 'started') return 0
    return Math.round((this._.duration - (+new Date() - this._.start)) / 1000)
  }

  Timer.prototype.getStatus = function() {
    return this._.status
  }

  Timer.prototype.options = function(option, value) {
    if (option && value) this._.options[option] = value
    if (!value && typeof option === 'object')
      for (var prop in option)
        if (this._.options.hasOwnProperty(prop))
          this._.options[prop] = option[prop]
    return this
  }

  Timer.prototype.on = function(option, value) {
    if (typeof option !== 'string' || typeof value !== 'function') return
    if (!(/^on/).test(option))
      option = 'on' + option
    if (this._.options.hasOwnProperty(option))
      this._.options[option] = value
    return this
  }

  Timer.prototype.off = function(option) {
    if (typeof option !== 'string') return
    option = option.toLowerCase()
    if (option === 'all') {
      this._.options = defaultOptions
      return
    }
    if (!(/^on/).test(option)) option = 'on' + option
    if (this._.options.hasOwnProperty(option))
      this._.options[option] = defaultOptions[option]
    return this
  }

  Timer.prototype.measureStart = function(label) {
    this._.measures[label || ''] = +new Date()
    return this
  }

  Timer.prototype.measureStop = function(label) {
    return +new Date() - this._.measures[label || '']
  }

  return Timer
}));
