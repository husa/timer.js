(function($) {
    $(function() {
        var $play  = $('.play'),
            $pause = $('.pause'),
            $stop  = $('.stop'),
            $time  = $('.time-input'),
            $timer = $('.timer');

        var timer = new Timer({
            onstart : function(millisec) {
                var sec = Math.round(millisec / 1000);
                $timer.text(sec);
            },
            ontick  : function(millisec) {
                var sec = Math.round(millisec / 1000);
                $timer.text(sec);
            },
            onpause : function() {
                $timer.text('pause');
            },
            onstop  : function() {
                $timer.text('stop');
            },
            onend   : function() {
                $timer.text('end');
            }
        });

        $play.on('click', function() {
            var time = $time.val();
            if (!time) return;
            if (isNaN(time)) {
                alert('Please input valid number');
                return;
            }

            timer.start(time);
        });

        $pause.on('click', function() {
            if (timer.getStatus() === 'started') {
                timer.pause();
            }
        });

        $stop.on('click', function() {
            if (/started|paused/.test(timer.getStatus())) {
                timer.stop();
            }
        });


    });
}(jQuery));
