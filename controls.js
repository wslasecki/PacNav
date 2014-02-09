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
	},

	pausePlayback: function() {
		//
		if( !Viewer.isPaused ) {
			Viewer.startCurPauseTime = Control.getTime();
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

    $('#stepf').hide();
    $('#stepb').hide();
    $('#inputContainer').hide();

    // Event routing
    $('#play').click(function() {
        var buttonVal = $('#play').attr('value');
        console.log("Play clicked: " + buttonVal);

        if (buttonVal == 'Play') {
            $('#play').attr('value', 'Pause');
            $('#stepf').hide();
            $('#stepb').hide();
            $('#inputContainer').hide();

            Control.startPlayback();
            Control.vidIsPlaying = true;
        }
        else if (buttonVal == 'Pause') {
            $('#play').attr('value', 'Play');
            $('#stepf').show();
            $('#stepb').show();
            $('#inputContainer').show(500);

            Control.pausePlayback();
            Control.vidIsPlaying = false;
        };

        $('#playVid').click();
    });

    // TODO: Move this to youtube.js
    // Step Forward/Backward buttons:
    $('#stepb').click(function() {
	console.log("Seeking to (-2): " + (player.getCurrentTime()-2));
        player.seekTo(player.getCurrentTime()-2);

        // A hack. Ensure the video frame refreshes
        //player.playVideo();
        //player.pauseVideo();
    });
    $('#stepf').click(function() {
	console.log("Seeking to (+2): " + player.getCurrentTime()+2);
        player.seekTo(player.getCurrentTime()+2);

        // A hack. Ensure the video frame refreshes
        //player.playVideo();
        //player.pauseVideo();
    });


    // NOTE: This is depricated, right?
    $('#reset').click(function() {
        $('#reset').attr('class', 'disabled');
        $('#play').attr('value', 'Play');
        $('#reset').attr('disabled', true);
        Control.stopPlayback();
    });
    ///


    $('#vidCover').click( function() {
        console.log("Cover clicked...");
	$('#play').click();
    });
    
});

