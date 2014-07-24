function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i<vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return(false);
}

Suggestions = {
	buttonMap: new Array(),
	numSugg: 0,

	//DELETED BY BEI
	// defineButtons: function() {
// 		Suggestions.buttonMap["respLeft"] = "left";
// 		Suggestions.buttonMap["respUp"] = "up";
// 		Suggestions.buttonMap["respDown"] = "down";
// 		Suggestions.buttonMap["respRight"] = "right";
// 	},

	addSugg: function(toAddID) {
		//
		timeSplit = player.getCurrentTime().toString().split(".");
		timeSec = timeSplit[0];
        // GABE made changes from substring(0,1)
		timeFrac = timeSplit[1].substring(0,2);  // Trim this to 1 number to avoid over-fitting the time
		newID = "suggestion_" + timeSec + "-" + timeFrac;  // Use the current time to destinguish entries. Replace decimal because JQuery doesn't like them

		//newEntry = "<div id='" + newID + "' class='suggestEntry'>PacMan should have gone <b>" + Suggestions.buttonMap[toAddID] + "</b> at " + timeSec + "." + timeFrac + "s!</div>";
		// ADDED BY BEI
		newEntry = "<div id='" + newID + "' class='suggestEntry'>PacMan has made a mistake <b>" + "</b> at " + timeSec + "." + timeFrac + "s!</div>";

		if( $('#'+newID).length != 0 ) {
			// If the suggestion already exists, replace it
			console.log("Suggestion already exists for this timestamp. Replacing...");
			$('#'+newID).replaceWith(newEntry);
		}
		else {
			console.log("Appending new suggestion...");
			$('.suggestEntry').empty();		// ADD BY BEI, MAKE THE USER CAN ONLY GIVE ONE SUGGESTION
			$('#suggestContent').append(newEntry);
		}

        var suggestVal = document.getElementById('suggestContent').textContent;
        if(suggestVal.length >= 0)
        {
            document.getElementById('submitButton').disabled = false;
        }
        document.getElementById('suggestId').value = suggestVal.trim();
        document.getElementById('videoId').value = getQueryVariable('video');
	},

	init: function() {
		//Suggestions.defineButtons();


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
