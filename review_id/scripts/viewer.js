var Viewer = {
	// Scolling on/off parameter
	scrolling: false,
	// Refresh frequency parameter
	refreshInterval: 200,

	// Track the current words displayed
	words: new Array(),
	newWords: new Array(),

	// Track the index of the last word displayed
	nextIdx: 0,
	startTime: 0,
	lastTime: 0,
	startCurPauseTime: 0,
	pauseTime: 0,
	lastWordTime: -1,

	numHistLines: 0,

	curStrVal: "",

	toCap: true,

	isPaused: false,
	isDone: false,
	isFF: false,

	refreshID: -1,

	load: function() {
	},

	refresh: function() {

			if( Viewer.isDone ) {
				// Then we have reached the end of the transcript
				// 
				console.log("Playback complete.")
				Viewer.isDone = true;

				var prevHTML = $('#transcript').html();
				$('#transcript').html(prevHTML + "<div class=punc>.</div>");
            			$('#play').hide();
            			$('#live').hide();
            			$('#reset').hide();
				$('#done-msg').show();

				Viewer.toCap = true;
			}

		// Update the status bar
		$('#status').progressbar({ value: (1.0-(Viewer.pauseTime/60000.0))*100.0 });
	},

}


$(document).ready( function() {
	// Event routing
	$('#done-msg').hide();
	$("#status").progressbar();
	$("#status").progressbar({ value: 100 });
	$('.ui-widget-header').css('background', '#EEE');
	$("#status").css({ background: "#000" });
	$("#status").progressbar("enable");
});

