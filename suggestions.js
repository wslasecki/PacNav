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
		newID = "suggestion_" + player.getCurrentTime().toString().replace(".", "-");  // Use the current time to destinguish entries. Replace decimal because JQuery doesn't like them
		if( $('#'+newID) != null ) {
			// If the suggestion already exists, remove it
			$('#'+newID).remove();
		}
		newEntry = "<div id='" + newID + "' class='suggestEntry'>Sholud have gone " + Suggestions.buttonMap[toAddID] + "!</div>";
		$('#suggestContent').append(newEntry);
	},

	init: function() {
		Suggestions.defineButtons();


		$('.responseButton').click( function() {
			buttonID = $(this).attr('id');
			console.log("Button #" + buttonID + " clicked!");

			// Add this to the suggestions set
			Suggestions.addSugg(buttonID, player.getCurrentTime());
		});
	}
}


// Add the initilization hook
$(document).ready( function() {
	Suggestions.init();
});
