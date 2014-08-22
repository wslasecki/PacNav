var instructions = document.getElementById("tutorialContent");
var tutorial;
var next = false;
var mistakeNum = 0;

var tutorialMessage = 0;
var tutorialMessages = [
"In this study, you will watch a video with respect to a PacMan playing a game, and you will need to point out the time that PacMan is making a mistake. There's only one mistake in each video. <br /><br />Click the screen to continue",
'Click <input type="button" class="button" id="play" value="Play"> to watch the video. <br /><br />If you think PacMan is making a mistake, click <input type="button" class="button" id="play" value="Mistake!"> to give your suggestion. ',
'If you think PacMan is making a mistake, click <input type="button" class="button" id="play" value="Mistake!"> to give your suggestion. If the video ends, click <input type="button" class="button" id="play" value="Replay"> to watch it again.',
'You have made the wrong suggestion over three times. PacMan makes a mistake at roughly 5.50. Please step to time 5.50 and identify that a mistake was made.',
'PacMan has not made any mistake yet! <br /><br /> Please click <input type="button" class="button" id="play" value="Replay"> to watch the video again to find the mistake time. <br /><br /> Remember that you can only watch it once in the real task.',
'PacMan has already made a mistake. <br /><br />  Please click <input type="button" class="button" id="play" value="Replay"> to watch the video again to find the mistake time.',
'Good job! You just gave the correct suggestion. The PacMan did make a mistake at that time! <br /><br />Click the screen to continue',
'Now you can start to do the real task to find the time that PacMan is making a mistake! <br /><br />Remember that you can only watch the video once!<br /><br />Click the screen to continue'
];

initiate();

function initiate(){
	if(sessionStorage.getItem("task")){
		//console.log("NO TUTORIAL");
		instructions.innerHTML = "";
		document.getElementById("suggestContainer").style.top = "19px";
		document.getElementById("suggestContainer").style.height = "370px";	
		document.getElementById("submitButton").style.display = "";
		document.getElementById("tutorialMessages").style.display = "none";
		return;
	}else{
		window.addEventListener("click", mouseClicked, false);
		tutorialSetup();
	}
}

function tutorialSetup(){
	//console.log("tutorial setup");
	//disable play and submit buttons
	//$("#play").prop('disabled', true);
	document.getElementById("play").style.display = "none";
	// if(isClose){
// 		instructions.innerHTML = tutorialMessages[0];
// 		tutorial = tutorialStart;
// 	}else{
// 		tutorial = tutorialSetup;
// 	}
	
	instructions.innerHTML = tutorialMessages[0];
	tutorial = tutorialStart;
}

function tutorialStart(){
	//console.log("tutorial start");
    //$("#play").prop('disabled', false);
	//$("#submitButton").prop('disabled', true);
	document.getElementById("play").style.display = "";
	tutorial = tutorialWait;
	//highlight("play");
	instructions.innerHTML = tutorialMessages[1];
	
	sessionStorage.setItem("play", true);
}

function tutorialWait(){
	//console.log("tutorial wait");
	//$("#submitButton").prop('disabled', true);
	//console.log("tutorialWait signal: " + signal);
    if(signal == "PLAY"){	// after clicking the play button
    	//console.log("tutorial wait signal play");
		tutorial = tutorialAnswer;
		//highlight("play");
		instructions.innerHTML = tutorialMessages[2];
		//instructions.style.top = "550px";
    }
    else if(signal == "MISTAKE"){
    	//console.log("wait mistake");
    	tutorial = tutorialAnswer;
    }
}

function tutorialAnswer(){
	//console.log("tutorial answer");
	//$("#submitButton").prop('disabled', true);
	window.setTimeout(answer, 160);

}

function answer(){
    if(signal == "MISTAKE"){
    	//console.log("BEI SIGNAL MISTAKE!!!");
    	//console.log("timeSec: " + timeSec);
    	//console.log("timeFrac: " + timeFrac);
		var time = timeSec + '.' + timeFrac;
		time = parseFloat(time);
		//console.log("time: " + time);
		if(time >= 5.50 && time <= 6.00){
			//console.log("CORRECT MISTAKE TIME");
			$('#play').hide();
        	$('#stepf').hide();
        	$('#stepb').hide();
        	$('#jumpf').hide();
        	$('#jumpb').hide();
    		$('#inputContainer').hide(200);
			instructions.innerHTML = tutorialMessages[6];
			//instructions.style.top = "550px";
			tutorial = tutorialFinish;
		}else{
			//console.log("WRONG MISTAKE TIME");
			//console.log("mistakeNum: " + mistakeNum);
			if(mistakeNum < 3){
				if(time < 5.50){
					//console.log("time < 5.50");
					tutorialMessage = 4;
				}else if(time > 6.00){
					//console.log("time > 5.54");
					tutorialMessage = 5;
				}
			}else{
				tutorialMessage = 3;
			}
			
			//console.log("information: " + tutorialMessages[tutorialMessage]);
			instructions.innerHTML = tutorialMessages[tutorialMessage];
			tutorial = tutorialWait;
			mistakeNum++;
		}	
	}
}

function tutorialFinish(){
	//$("#submitButton").prop('disabled', true);
    if(next){
		instructions.innerHTML = tutorialMessages[7];
		tutorial = taskStart;
	}
}

function taskStart(){
	//$("#submitButton").prop('disabled', true);
	if(next){
		$('.suggestEntry').empty();		// clear the suggestion content
		instructions.innerHTML = "";
		
		var videoPath = document.getElementById("vidPlayer").src;
		var vidId = gup('video');		
		var url = window.location.href;
		
		sessionStorage.setItem("task", true);		
 		//window.location = url.slice(0, -12) + vidId;	
 		var tempUrl = url.split("=");
 		var newUrl = tempUrl[0] + "=" + vidId;
 		console.log("newUrl: " + newUrl);
 		window.location = newUrl;
 		window.location.reload(true);
 		
 		tutorial = finish;

	}
}


function finish(){
	console.log("finish");
	// alert("BEI : " + document.getElementById("suggestContainer").style.height);
// 	document.getElementById("suggestContainer").style.height = "456px";
// 	alert("BEI 2: " + document.getElementById("suggestContainer").style.height);
	
}

function update(){
	//console.log("in update");
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