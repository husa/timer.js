/* jshint indent: 2*/
/* global Timer, jasmine, describe, it, beforeEach, expect, afterEach */
'use strict';

describe('Timer', function() {
  var timer, start, stop, pause, end, tick;

  beforeEach(function(){
    timer = new Timer();
    start = jasmine.createSpy();
    pause = jasmine.createSpy();
    stop = jasmine.createSpy();
    tick = jasmine.createSpy();
    end = jasmine.createSpy();

    jasmine.clock().install();
    jasmine.clock().mockDate();
  });

  afterEach(function(){
    jasmine.clock().uninstall();
  })

  it('should be available as global', function() {
    expect(Timer).toBeDefined();
  });

  describe('#constructor', function() {
    it('should self invoke without "new" keyword', function() {
      var timer = new Timer(),
        timer2 = Timer();

      expect(timer instanceof Timer).toBe(true);
      expect(timer2 instanceof Timer).toBe(true);
    });

    it('should accept object as arguments', function() {
      timer = new Timer({
        onstart : start,
        onpause : pause,
        onstop : stop
      });

      timer.start();
      expect(start).not.toHaveBeenCalled();
      timer.start(10);
      expect(start).toHaveBeenCalled();
      timer.pause();
      expect(pause).toHaveBeenCalled();
      timer.stop();
      expect(stop).toHaveBeenCalled();
    });
  });

  describe('#getStatus', function() {

    it('should always be string', function(){
      expect(timer.getStatus()).toEqual(jasmine.any(String));
    });

    it('should be valid status', function() {
      var match = /^(initialized|started|paused|stopped|finished)$/;

      expect(timer.getStatus()).toMatch(match);
    });
  });

  describe('#getDuration', function() {

    it('should return 0 if timer isn\'t started or paused', function() {
      //initial
      expect(timer.getDuration()).toEqual(0);
      //after start
      timer.start(10);
      expect(timer.getDuration()).toEqual(10000);
      //after pause
      timer.pause();
      expect(timer.getDuration()).toEqual(10000);
      //after stop
      timer.stop();
      expect(timer.getDuration()).toEqual(0);
    });

    it('should return actual value', function() {
      timer.start(10);
      jasmine.clock().tick(100);
      expect(timer.getDuration()).toEqual(9900);
      jasmine.clock().tick(1100);
      expect(timer.getDuration()).toEqual(8800);
      timer.pause();
      jasmine.clock().tick(100);
      expect(timer.getDuration()).toEqual(8800);
      timer.start();
      jasmine.clock().tick(100);
      expect(timer.getDuration()).toEqual(8700);
    });
  });

  describe('#start', function() {

    it('should not change status if no arguments', function(){
      timer.start();
      expect(timer.getStatus()).toEqual('initialized');
      timer.start(10);
      expect(timer.getStatus()).toEqual('started');
      timer.start();
      expect(timer.getStatus()).toEqual('started');
    });

    it('should change status to "started" if valid arguments', function(){
      expect(timer.getStatus()).toEqual('initialized');
      timer.start(10);
      expect(timer.getStatus()).toEqual('started');
    });

    it('should trigger "onstart" callback', function() {
      timer.on('start', start);
      timer.start(1);
      expect(start).toHaveBeenCalled();
      expect(start).toHaveBeenCalledWith(1000);
    });

    it('should resume timer after pause', function() {
      timer.on('end', end);
      timer.start(5);
      jasmine.clock().tick(1000);
      timer.pause();
      expect(timer.getStatus()).toBe('paused');
      timer.start();
      expect(timer.getStatus()).toBe('started');
      jasmine.clock().tick(3900);
      expect(timer.getDuration()).toBe(100);
      jasmine.clock().tick(101);
      expect(end).toHaveBeenCalled();
    });

    it('should restart timer if argument provided after pause', function () {
      timer.on('end', end);
      timer.start(5);
      jasmine.clock().tick(1000);
      timer.pause();
      expect(timer.getStatus()).toBe('paused');
      timer.start(10);
      expect(timer.getDuration()).toBe(10000);
      jasmine.clock().tick(4001);
      expect(end).not.toHaveBeenCalled();
      expect(timer.getDuration()).toBe(5999);
      jasmine.clock().tick(6000);
      expect(end).toHaveBeenCalled();
    });
  });

  describe('#pause', function() {

    it('should return if timer hasn\'t started', function() {
      timer.on('pause', pause);
      timer.pause();
      expect(timer.getStatus()).toEqual('initialized');
      expect(pause).not.toHaveBeenCalled();
    });

    it('should change status to "paused"', function() {
      timer.start(1);
      timer.pause();
      expect(timer.getStatus()).toEqual('paused');
    });

    it('should trigger "onpause" callback', function() {
      timer.on('pause', pause);
      timer.start(1);
      timer.pause();
      expect(pause).toHaveBeenCalled();
      timer.pause();
      expect(pause.calls.count()).toEqual(1);
    });
  });

  describe('#stop', function() {

    it('should return if timer hasn\'t started', function() {
      timer.on('stop', stop);
      timer.stop();
      expect(timer.getStatus()).toEqual('initialized');
      expect(stop).not.toHaveBeenCalled();
    });

    it('should change status to "stopped" after start', function() {
      timer.on('stop', stop);
      timer.start(1);
      timer.stop();
      expect(timer.getStatus()).toEqual('stopped');
      expect(stop).toHaveBeenCalled();
    });

    it('should change status to "stopped" after pause', function() {
      timer.on('stop', stop);
      timer.start(1);
      timer.pause();
      timer.stop();
      expect(timer.getStatus()).toEqual('stopped');
      expect(stop).toHaveBeenCalled();
    });

    it('should trigger "onstop" callback', function() {
      timer.on('stop', stop);
      timer.start(1);
      timer.stop();
      expect(stop).toHaveBeenCalled();
      timer.stop();
      expect(stop.calls.count()).toEqual(1);
    });
  });

  describe('#on', function() {

    it('should attach start callback', function() {
      timer.on('start', start);
      timer.start(1);
      expect(start).toHaveBeenCalled();
    });

    it('should attach pause callback', function() {
      timer.on('pause', pause);
      timer.start(1);
      timer.pause();
      expect(pause).toHaveBeenCalled();
    });

    it('should attach stop callback', function() {
      timer.on('stop', stop);
      timer.start(1);
      timer.stop();
      expect(stop).toHaveBeenCalled();
    });

    it('should attach end callback', function() {
      timer.on('end', end);
      timer.start(1);
      jasmine.clock().tick(1001);
      expect(end).toHaveBeenCalled();
    });

    it('should attach tick callback', function() {
      timer.on('tick', tick);
      timer.start(2);
      jasmine.clock().tick(1001);
      expect(tick).toHaveBeenCalled();
    });

    it('should accept options with/without "on"', function() {
      timer.on('tick', tick);
      timer.on('onstart', start);
      timer.on('onstop', stop);
      timer.start(2);
      jasmine.clock().tick(1001);
      timer.stop();
      expect(start).toHaveBeenCalled();
      expect(tick).toHaveBeenCalled();
      expect(stop).toHaveBeenCalled();
    });
  });

  describe('#off', function() {

    beforeEach(function() {
      timer.on('tick', tick);
      timer.on('onstart', start);
      timer.on('stop', stop);
    });

    it('should remove callbacks', function(){
      timer.off('tick');
      timer.off('onstart');
      timer.off('stop');
      timer.start(2);
      jasmine.clock().tick(1900);
      timer.stop();
      expect(start).not.toHaveBeenCalled();
      expect(tick).not.toHaveBeenCalled();
      expect(stop).not.toHaveBeenCalled();
    });

    it('should remove all callbacks if "all" passed', function() {
      timer.off('all');
      timer.start(2);
      jasmine.clock().tick(1900);
      timer.stop();
      expect(start).not.toHaveBeenCalled();
      expect(tick).not.toHaveBeenCalled();
      expect(stop).not.toHaveBeenCalled();
    });
  });

  describe('#callbacks execution', function() {

    beforeEach(function(){
      timer.options({
        onstart : start,
        ontick : tick,
        onpause : pause,
        onend : end,
        onstop : stop
      });
    });

    it('should trigger "tick" every second', function() {
      timer.start(3);
      jasmine.clock().tick(1001);
      expect(tick).toHaveBeenCalled();
      jasmine.clock().tick(2000);
      expect(tick.calls.count()).toEqual(3);
    });

    it('should trigger "end"', function() {
      timer.start(2);
      jasmine.clock().tick(2001);
      expect(end).toHaveBeenCalled();
    });

    it('should not trigger "end" if stopped', function() {
      timer.start(2);
      jasmine.clock().tick(1900);
      timer.stop();
      jasmine.clock().tick(1000);
      expect(end).not.toHaveBeenCalled();
      expect(stop).toHaveBeenCalled();
    });

  });

  describe('#chaining', function() {

    it('should chain any way', function() {
      expect(function(){
        timer.pause().stop().start().start(20).stop().pause().start().on().off().options().stop();
      }).not.toThrow();
    });
  });
});
