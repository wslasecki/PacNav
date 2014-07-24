var instructions = document.getElementById("tutorialMessages");
var tutorial;
var next = false;

var tutorialMessage = 0;
var tutorialMessages = [
"In this study, you will watch a video with respect to a pac-man playing a game, and you will need to point out the time that the pac-man is making a mistake. There's only one mistake in each video. <br /><br />Click the screen to continue",
"To begin searching the mistake, click Play button to watch the video, remember that you can watch the video multiple times <br /><br />Click Play button to continue",
"If you think the pac-man is making a mistake, click Wait button and step back and forward to find the exact time that the pac-man is making a mistake <br /><br />Click Wait button to continue",
"After you find the exact mistake time, please click Mistake button to give your suggestion <br /><br />Click Mistake button to continue",
"Oh, no, pacman still doesn't make any mistake! <br /> You must keep watching the video to find the mistake time and give suggestion to move on",
"Oh, no, you have missed the correct mistake time! <br /> You can step back to find the mistake time and give suggestion to move on",
"Good job! You just give the correct suggestion. The pac-man did make a mistake at that time! <br /><br />Click the screen to continue",
"Now you can begin the real task to find the time that the pacman is making a mistake! <br /><br />Click the screen to continue"
];

window.addEventListener("click", mouseClicked, false);
document.getElementById("vidPlayer").addEventListener('readystatechange', function(e) {
 		 console.log("attach onreadystatechange");
       	 onPlayerStateChange(e);
    	});
tutorialSetup();

function tutorialSetup(){
	//disable play and submit buttons
	$("#play").prop('disabled', true);
	$("#submitButton").prop('disabled', true);
    instructions.innerHTML = tutorialMessages[0];
    tutorial = tutorialStart;
}

function tutorialStart(){
    $("#play").prop('disabled', false);
	$("#submitButton").prop('disabled', true);
	tutorial = tutorialWait;
	highlight("play");
	++tutorialMessage;
	instructions.innerHTML = tutorialMessages[tutorialMessage];
}

function tutorialWait(){
    if(signal == "PLAY"){
		$("#submitButton").prop('disabled', true);
		tutorial = tutorialMistake;
		highlight("play");
		++tutorialMessage;
		instructions.innerHTML = tutorialMessages[tutorialMessage];
    }
}

function tutorialMistake(){
    if(signal == "WAIT"){
		$("#submitButton").prop('disabled', true);
		tutorial = tutorialAnswer;
		highlight("mistake");
		++tutorialMessage;
		instructions.innerHTML = tutorialMessages[tutorialMessage];
		instructions.style.top = "615px";
    }
}

function tutorialAnswer(){
    if(signal == "MISTAKE"){
    	$("#submitButton").prop('disabled', true);
		var time = timeSec + '.' + timeFrac;
		time = parseFloat(time);
		
		if(time >= 5.11 && time <= 5.14){
			tutorialMessage = tutorialMessages.length - 2;
			$('#play').hide();
        	$('#stepf').hide();
        	$('#stepb').hide();
        	$('#jumpf').hide();
        	$('#jumpb').hide();
    		$('#inputContainer').hide(200);
			instructions.innerHTML = tutorialMessages[tutorialMessage];
			instructions.style.top = "550px";
			tutorial = tutorialFinish;
		}else{
			if(time < 5.11){
				tutorialMessage = tutorialMessages.length - 4;
			}else if(time > 5.14){
				tutorialMessage = tutorialMessages.length - 3;
			}
			instructions.innerHTML = tutorialMessages[tutorialMessage];
			tutorial = tutorialAnswer;
		}
		
	}
}

function tutorialFinish(){
    if(next){
    	$("#submitButton").prop('disabled', true);
    	++tutorialMessage;
		instructions.innerHTML = tutorialMessages[tutorialMessage];
		tutorial = taskStart;
	}
}

function taskStart(){
	if(next){
		$("#submitButton").prop('disabled', true);
		$('.suggestEntry').empty();		// clear the suggestion content
		instructions.innerHTML = "";
		
		var videoPath = document.getElementById("vidPlayer").src;
		var vidId = gup('video');

 		console.log("vidId: " + vidId);
 		console.log("videoPath: " + videoPath);
 		videoPath = changeUrl(videoPath, vidId);
 		document.getElementById("vidPlayer").src = videoPath;
 		
 		console.log("hi bei come on 4");
 		
		//document.getElementById("vidPlayer").onreadystatechange = ;
		
 		$('#play').show();
 		$('#play').attr('value', 'Play');
 		tutorial = finish;

	}
}

function finish(){
	console.log("finish");
}

function update(){
	console.log("in update");
	tutorial();
	next = false;
}

function mouseClicked(e){
    next = true;
    update();
}


//Highlighting

var isHighlight = false;
var htarget = null;
var hstep = 0;
var highlightTemp = 0;

function highlight(target){
    if(htarget != null)
	htarget.style.opacity = highlightTemp;
		
    hstep = 0;
    htarget = document.getElementById(target);
    highlightTemp = htarget.style.opacity;

    if(!isHighlight)
	setTimeout(highlightUpdate, 50);
	
    isHighlight = true;
}

function noHighlight(){
    if(htarget != null)
	htarget.style.opacity = highlightTemp;

    isHighlight = false;
    htarget = null;
}

function highlightUpdate(){
    if(isHighlight){
	htarget.style.opacity = 0.4*(Math.sin(hstep) + 1);
	hstep += 0.15;
	setTimeout(highlightUpdate, 50);
    }
}