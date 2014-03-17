Suggestions = {
	buttonMap: new Array(),
	numSugg: 0,

	defineButtons: function() {
		Suggestions.buttonMap["respLeft"] = "left";
		Suggestions.buttonMap["respUp"] = "up";
		Suggestions.buttonMap["respDown"] = "down";
		Suggestions.buttonMap["respRight"] = "right";
	},

	addSugg: function(toAddID) {
		//
		timeSplit = player.getCurrentTime().toString().split(".");
		timeSec = timeSplit[0];
		timeFrac = timeSplit[1].substring(0,1);  // Trim this to 1 number to avoid over-fitting the time
		newID = "suggestion_" + timeSec + "-" + timeFrac;  // Use the current time to destinguish entries. Replace decimal because JQuery doesn't like them

		newEntry = "<div id='" + newID + "' class='suggestEntry'>PacMan sholud have gone <b>" + Suggestions.buttonMap[toAddID] + "</b> at " + timeSec + "." + timeFrac + "s!</div>";

		if( $('#'+newID).length != 0 ) {
			// If the suggestion already exists, replace it
			console.log("Suggestion already exists for this timestamp. Replacing...");
			$('#'+newID).replaceWith(newEntry);
		}
		else {
			console.log("Appending new suggestion...");
			$('#suggestContent').append(newEntry);
		}
	},

	init: function() {
		Suggestions.defineButtons();


		$('.responseButton').click( function() {
			buttonID = $(this).attr('id');
			console.log("Button #" + buttonID + " clicked!");

			// Add this to the suggestions set
			Suggestions.addSugg(buttonID, player.getCurrentTime());

			$('#legion-submit').removeAttr('DISABLED');
		});
	}
}


// Add the initilization hook
$(document).ready( function() {
	Suggestions.init();
});
