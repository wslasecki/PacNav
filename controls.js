var Control = {
	getTime: function() {
		var sDate = new Date();
		//return sDate.getTime();
		return player.getCurrentTime()*1000;
	},

	startPlayback: function() {
		//alert("Starting...");

		if( !Viewer.isPaused ) {
       	         	Viewer.startTime = Control.getTime();

			// Run the first time
			Viewer.load();
			// Setup a callback for future runs
			Viewer.refreshID = setInterval( function() { Viewer.refresh(); }, Viewer.refreshInterval);
		}
		else {
			Viewer.pauseTime += Control.getTime() - Viewer.startCurPauseTime;
		}

		Viewer.isPaused = false;
		Viewer.isFF = false;
	},

	pausePlayback: function() {
		//
		if( !Viewer.isPaused ) {
			Viewer.startCurPauseTime = Control.getTime();
			Viewer.isPaused = true;
			Viewer.isFF = false;
		}
	},
	fastForwardPlayback: function() {
		if( !Viewer.isFF ) {
			Viewer.isFF = true;
		}
		else {
			Viewer.isFF = false;
		}
	},
	goLivePlayback: function() {
		// Update all content to the 'real' wall-clock time
		Viewer.pauseTime = 0;
		Viewer.startCurPauseTime = 0;
		Viewer.isPaused = false;
	},

	stopPlayback: function() {
		// 
		$('#transcript').text("");
		clearInterval(Viewer.refreshID);

		Viewer.words = new Array();
		Viewer.nextIdx = 0;
		Viewer.startTime = 0;
		Viewer.lastTime = 0;
		Viewer.refreshID = 0;

		Viewer.pauseTime = 0;
		Viewer.startCurPauseTime = 0;
		Viewer.isPaused = false;
		Viewer.isDone = false;
	},

	vidIsPlaying: false,
	holdingIdx: -1,

	pauseMode: false,
	holdMode: false
}


$(document).ready( function() {
    Control.pauseMode = true;
    Control.holdMode = true;


    // Event routing
    $('#play').click(function() {
        var buttonVal = $('#play').attr('value');
        console.log("Play clickd: " + buttonVal);

        if (buttonVal == 'Play') {
            $('#reset').attr('class', 'button');
            $('#reset').removeAttr('disabled');
            $('#play').attr('value', 'Pause');
	    $('.ui-widget-header').css('background', '#0E0');

	    // Enable / deactivate FF
	    if( Viewer.pauseTime > 0 ) {
                $('#ff').removeClass('disabled');
                $('#ff').addClass('enabled');
	    }
	    else {
                $('#ff').removeClass('enabled');
                $('#ff').addClass('disabled');
	    }
            $('#ff').removeClass('active');
            $('#ff').addClass('inactive');
            Control.startPlayback();
        }
        else if (buttonVal == 'Pause') {
            $('#reset').attr('class', 'button');
            $('#play').attr('value', 'Play');
	    $('.ui-widget-header').css('background', '#E00');

	    // Disable / deactivate FF
            $('#ff').removeClass('enabled');
            $('#ff').addClass('disabled');
            $('#ff').removeClass('active');
            $('#ff').addClass('inactive');
            Control.pausePlayback();
        };

        $('#playVid').click();
        Control.vidIsPlaying = true;
    });
    $('#ff').click(function() {
	if( $('#ff').hasClass('enabled') ) {
        if ( !Viewer.isFF ) {
	    // Activate / enable FF
            $('#ff').removeClass('inactive');
            $('#ff').addClass('active');
            //$('#ff').removeClass('disabled');
            //$('#ff').addClass('enabled');
        }
        else {
	    // Deactivate / enable FF
            $('#ff').removeClass('active');
            $('#ff').addClass('inactive');
            //$('#ff').removeClass('disabled');
            //$('#ff').addClass('enabled');
        }
        Control.fastForwardPlayback();
	}
    });
    $('#live').click(function() {
        if (!Viewer.isPaused) {
            $('#reset').attr('class', 'button');
            $('#reset').removeAttr('disabled');
            Control.goLivePlayback();
        }
        else {
            $('#play').attr('value', 'Pause');
            $('#reset').attr('class', 'button');
	    $('.ui-widget-header').css('background', '#0E0');
            Control.goLivePlayback();
        }

	// Disable / deactivate FF
        $('#ff').removeClass('enabled');
        $('#ff').addClass('disabled');
        $('#ff').removeClass('active');
        $('#ff').addClass('inactive');
    });
    $('#reset').click(function() {
        $('#reset').attr('class', 'disabled');
        $('#play').attr('value', 'Play');
        $('#reset').attr('disabled', true);
        Control.stopPlayback();
    });

    // When '.' is pressed...
    $(document).keydown( function(e) {
      if( Control.pauseMode ) {
    	// When 'Down Arrow' is hit...
        if( e.which == 40 ) {
	    //$('.ui-widget-header').css('background', '#E00');
            //Control.pausePlayback();
	    //
            if( $('#play').attr('value') == 'Pause' ) {
        	$('#play').click();
	    }
        }
    	// When 'Up Arrow' is hit...
        if( e.which == 39 ) {
            $('#ff').click();
        }
    	// When 'Right Arrow' is hit...
        else if( e.which == 38 ) {
            $('#live').click();
        }
        // When 'Left Arrow' is hit...
        if( e.which == 37 ) {
            $('#play').click();
        }
      }
      if( Control.holdMode ) {
        if( e.which == 188 ) {
            // Start highlighting a word
	    if( Control.holdingIdx < 0 && Viewer.nextIdx > 0 ) {
		Control.holdingIdx = Viewer.nextIdx-1;
		$('#word_' + Control.holdingIdx).css("background", "#FF0");
	    }
	    else {
		$('#word_' + Control.holdingIdx).css("background", "#FFF");
		Control.holdingIdx = -1;
	    }
        }
        else if( e.which == 190 ) {
            // Start highlighting a word
	    if( Control.holdingIdx < 0 && Viewer.nextIdx > 0 ) {
		Control.holdingIdx = Viewer.nextIdx-1;
		$('#word_' + Control.holdingIdx).css("background", "#FF0");
	    }
	}
        // When 'p' is hit...
        else if( e.which == 80 ) {
            $('#play').click();
        }
        //else { alert(e.which) }
      }

	return false;
    });
    $(document).keyup( function(e) {
      if( Control.pauseMode ) {
    	// When 'Down Arrow' is un-hit...
        if( e.which == 40 ) {
	    //$('.ui-widget-header').css('background', '#0E0');
            //Control.startPlayback()
            if( $('#play').attr('value') == 'Play' ) {
            	$('#play').click();
	    }
	}
      }
      if( Control.holdMode ) {
        if( e.which == 190 ) {
            // Start highlighting a word
	    if( Control.holdingIdx >= 0 ) {
		$('#word_' + Control.holdingIdx).css("background", "#FFF");
		Control.holdingIdx = -1;
	    }
	}
      }

	return false;
    });

    $('#vidCover').click( function() {
        console.log("Cover clicked...");
    });
    
});

