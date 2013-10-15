var Timer = require('./timer');

var t = new Timer({
    'ontick' : function(sec){
        console.log(this.getDuration());
    }
});

t.start(10);