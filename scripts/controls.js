var Controls = {
	getTime: function() {
		var sDate = new Date();
		//return sDate.getTime();
		return player.getCurrentTime()*1000;
	},

	startPlayback: function() {
		//alert("Starting...");

		if( !Viewer.isPaused ) {
       	         	Viewer.startTime = Controls.getTime();

			// Run the first time
			Viewer.load();
			// Setup a callback for future runs
			Viewer.refreshID = setInterval( function() { Viewer.refresh(); }, Viewer.refreshInterval);
		}
		else {
			Viewer.pauseTime += Controls.getTime() - Viewer.startCurPauseTime;
		}

		Viewer.isPaused = false;
	},

	pausePlayback: function() {
		//
		if( !Viewer.isPaused ) {
			Viewer.startCurPauseTime = Controls.getTime();
			Viewer.isPaused = true;
		}
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
    if( gup('assignmentId') == "ASSIGNMENT_ID_NOT_AVAILABLE" ) {
        $('#play').attr('disabled', 'disabled');
        $('#play').val("Accept the HIT to continue");
        $('#play').css('width', '230px');
    }

    $('#stepf').hide();
    $('#stepb').hide();
    $('#jumpf').hide();
    $('#jumpb').hide();
    $('#inputContainer').hide();

    // Event routing
    $('#play').click(function() {
        var buttonVal = $('#play').attr('value');
        console.log("Play clicked: " + buttonVal);

        if (buttonVal == 'Continue' || buttonVal == 'Play' || buttonVal == 'Replay') {
            $('#play').attr('value', 'Wait!');
            $('#stepf').hide();
            $('#stepb').hide();
            $('#jumpf').hide();
            $('#jumpb').hide();
            $('#inputContainer').hide(200);

            Controls.startPlayback();
            Controls.vidIsPlaying = true;
        }
        else if (buttonVal == 'Wait!') {
            $('#play').attr('value', 'Continue');
            $('#stepf').show();
            $('#stepb').show();
            $('#jumpf').show();
            $('#jumpb').show();
            $('#inputContainer').show(400);

            Controls.pausePlayback();
            Controls.vidIsPlaying = false;
        };

        $('#playVid').click();
    });

    // TODO: Move this to youtube.js
    // Step Forward/Backward buttons:
    $('#stepb').click(function() {
	console.log("Seeking to (-.01): " + (player.getCurrentTime()-.01));
        player.seekTo(player.getCurrentTime()-.03);
        // A hack. Ensure the video frame refreshes
        //player.playVideo();
        //player.pauseVideo();
    });
    $('#stepf').click(function() {
	console.log("Seeking to (+.01): " + player.getCurrentTime()+.01);
        player.seekTo(player.getCurrentTime()+.03);
        // A hack. Ensure the video frame refreshes
        //player.playVideo();
        //player.pauseVideo();
    });
    // Jump Forward/Backward buttons:
    $('#jumpb').click(function() {
    console.log("Seeking to (-1): " + (player.getCurrentTime()-1));
        player.seekTo(player.getCurrentTime()-.5);
    });
    $('#jumpf').click(function() {
    console.log("Seeking to (+1): " + player.getCurrentTime()+1);
        player.seekTo(player.getCurrentTime()+.5);
    });


    // NOTE: This is depricated, right?
    $('#reset').click(function() {
        $('#reset').attr('class', 'disabled');
        $('#play').attr('value', 'Play');
        $('#reset').attr('disabled', true);
        Controls.stopPlayback();
    });
    ///


    if( gup('assignmentId') == "ASSIGNMENT_ID_NOT_AVAILABLE" ) {
        $('#vidCover').html("<div style='font-size: 36px; font-weight: bold; color: #B11; text-align: center'><br><br>Please accept the HIT to continue!</div>");
    }
    else {
        $('#vidCover').click( function() {
            console.log("Cover clicked...");
            $('#play').click();
        });
    }
    
});

