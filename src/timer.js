(function (root, factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) define([], factory)
  else if (typeof exports === 'object') module.exports = factory()
  else root.Timer = factory()
}(this, function () {
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
      id       : +new Date,
      options  : {},
      duration : 0,
      status   : 'initialized',
      start    : 0,
      measures : []
    }
    for (var prop in defaultOptions) this._.options[prop] = defaultOptions[prop]
    this.options(options)
  }

  Timer.prototype.start = function (duration) {
    if (!+duration && !this._.duration) return this
    duration && (duration *= 1000)
    if (this._.timeout && this._.status === 'started') return this
    this._.duration = duration || this._.duration
    this._.timeout = setTimeout(end.bind(this), this._.duration)
    if (typeof this._.options.ontick === 'function')
      this._.interval = setInterval(function () {
        trigger.call(this, 'ontick', this.getDuration())
      }.bind(this), +this._.options.tick * 1000)
    this._.start = +new Date
    this._.status = 'started'
    trigger.call(this, 'onstart', this.getDuration())
    return this
  }

  Timer.prototype.pause = function () {
    if (this._.status !== 'started') return this
    this._.duration -= (+new Date - this._.start)
    clear.call(this, false)
    this._.status = 'paused'
    trigger.call(this, 'onpause')
    return this
  }

  Timer.prototype.stop = function () {
    if (!/started|paused/.test(this._.status)) return this
    clear.call(this, true)
    this._.status = 'stopped'
    trigger.call(this, 'onstop')
    return this
  }

  Timer.prototype.getDuration = function () {
    if (this._.status === 'started')
      return this._.duration - (+new Date - this._.start)
    if (this._.status === 'paused') return this._.duration
    return 0
  }

  Timer.prototype.getStatus = function () {
    return this._.status
  }

  Timer.prototype.options = function (option, value) {
    if (option && value) this._.options[option] = value
    if (!value && typeof option === 'object')
      for (var prop in option)
        if (this._.options.hasOwnProperty(prop))
          this._.options[prop] = option[prop]
    return this
  }

  Timer.prototype.on = function (option, value) {
    if (typeof option !== 'string' || typeof value !== 'function') return this
    if (!(/^on/).test(option))
      option = 'on' + option
    if (this._.options.hasOwnProperty(option))
      this._.options[option] = value
    return this
  }

  Timer.prototype.off = function (option) {
    if (typeof option !== 'string') return this
    option = option.toLowerCase()
    if (option === 'all') {
      this._.options = defaultOptions
      return this
    }
    if (!(/^on/).test(option)) option = 'on' + option
    if (this._.options.hasOwnProperty(option))
      this._.options[option] = defaultOptions[option]
    return this
  }

  Timer.prototype.measureStart = function (label) {

    if (!this._.measures[label || '']) this._.measures[label || ''] = []

    this._.measures[label || '']._ = {
      startTime: +new Date,
      paused: false
    }
    return this
  }

  Timer.prototype.measurePause = function (label) {
    var measureArr = this._.measures[label || '']
    if (measureArr && !measureArr._.paused) {
      measureArr.push(+new Date - measureArr._.startTime)
      measureArr._.paused = true
    }
    return this
  }

  Timer.prototype.measureStop = function (label) {
    this.measurePause(label)
    var arr = this._.measures[label || ''],
      result = 0
    if (!arr) return result

    var len = arr.length
    for (var i = 0; i < len; ++i)
      result += arr[i]

    delete this._.measures[label || '']

    return result
  }

  function end () {
    clear.call(this)
    this._.status = 'stopped'
    trigger.call(this, 'onend')
  }

  function trigger (event) {
    var callback = this._.options[event],
      args = [].slice.call(arguments, 1)
    typeof callback === 'function' && callback.apply(this, args)
  }

  function clear (clearDuration) {
    clearTimeout(this._.timeout)
    clearInterval(this._.interval)
    if (clearDuration === true) this._.duration = 0
  }

  return Timer
}))
