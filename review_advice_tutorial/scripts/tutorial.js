var instructions = document.getElementById("tutorialContent");
var tutorial;
var next = false;
var mistakeNum = 0;

var tutorialMessage = 0;
var tutorialMessages = [
"In this study, you will watch a video with respect to a PacMan playing a game, and you will need to point out the time that PacMan is making a mistake. There's only one mistake in each video. <br /><br />Click the screen to continue",
'Click <input type="button" class="button" id="play" value="Play"> to watch the video. <br /><br />If you think PacMan is making a mistake, click <input type="button" class="button" id="play" value="Wait!"> to give your suggestion.',
'If you think PacMan is making a mistake, click <input type="button" class="button" id="play" value="Wait!"> to give your suggestion. If the video ends, click <input type="button" class="button" id="play" value="Replay"> to watch it again.',
'You can click <input type="button" class="button" id="play" value="Replay"> to watch the video again to find the mistake time.',
'You can click <input type="button" class="button stepButton" id="stepb" value="< Step"></input> or <input type="button" class="button stepButton" id="stepf" value="Step >"> to find the exact time that PacMan is making a mistake. <br /><br /> After you find the exact mistake time, please click <input type="button" class="button" id="play" value="Mistake"> to give your suggestion.',
'You have made the wrong suggestion over three times. PacMan makes a mistake at roughly 5.50. Please step to time 5.50 and identify that a mistake was made.',
'PacMan has not made any mistakes yet! <br /><br /> Please continue watching the video to find the mistake.',
'PacMan has already made a mistake. <br /> <br /> Please replay the video or step back to find the time of the mistake.',
'Good job! You just gave the correct suggestion. The PacMan did make a mistake at that time! <br /><br />Click the screen to continue',
'Now you can start to do the real task to find the time that PacMan is making a mistake! <br /><br />Click the screen to continue'
];

initiate();

function initiate(){
	if(sessionStorage.getItem("task")){
		//console.log("NO TUTORIAL");
		instructions.innerHTML = "";
		document.getElementById("suggestContainer").style.top = "19px";	
		document.getElementById("suggestContainer").style.height = "370px";
		document.getElementById("submitButtonReview").style.display = "";
		document.getElementById("tutorialMessages").style.display = "none";
		document.getElementById("suggestInstruction").style.display = "none";
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
	
	if(isClose){
		instructions.innerHTML = tutorialMessages[0];
		tutorial = tutorialStart;
	}else{
		tutorial = tutorialSetup;
	}
	
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
    if(signal == "PLAY"){	// after clicking the play button
    	//console.log("tutorial wait signal play");
		//$("#submitButton").prop('disabled', true);
		tutorial = tutorialMistake;
		//highlight("play");
		instructions.innerHTML = tutorialMessages[2];
		//instructions.style.top = "550px";
    }
    else if(signal == "STEP" || signal == "MISTAKE"){
    	//console.log("wait mistake");
    	tutorial = tutorialAnswer;
    }
}

function tutorialMistake(){
	//console.log("tutorial mistake");
	//console.log("SIGNAL: " + signal);
    if(signal == "WAIT"){	// after clicking the wait button
		//$("#submitButton").prop('disabled', true);
		tutorial = tutorialAnswer;
		//highlight("mistake");
		instructions.innerHTML = tutorialMessages[4];
		//instructions.style.top = "615px";
    }
}

function tutorialAnswer(){
	//console.log("tutorial answer");
	
    if(signal == "MISTAKE"){
    	//console.log("BEI SIGNAL MISTAKE!!!");
    	//$("#submitButton").prop('disabled', true);
		var time = timeSec + '.' + timeFrac;
		time = parseFloat(time);
		
		if(time >= 5.50 && time <= 5.54){
			//console.log("CORRECT MISTAKE TIME");
			tutorialMessage = tutorialMessages.length - 2;
			$('#play').hide();
        	$('#stepf').hide();
        	$('#stepb').hide();
        	$('#jumpf').hide();
        	$('#jumpb').hide();
    		$('#inputContainer').hide(200);
			instructions.innerHTML = tutorialMessages[tutorialMessage];
			//instructions.style.top = "550px";
			tutorial = tutorialFinish;
		}else{
			//console.log("WRONG MISTAKE TIME");
			//console.log("mistakeNum: " + mistakeNum);
			if(mistakeNum < 3){
				if(time < 5.50){
					tutorialMessage = tutorialMessages.length - 4;
				}else if(time > 5.54){
					tutorialMessage = tutorialMessages.length - 3;
				}
			}else{
				tutorialMessage = tutorialMessages.length - 5;
			}
			
			instructions.innerHTML = tutorialMessages[tutorialMessage];
			tutorial = tutorialWait;
			mistakeNum++;
		}
		
	}
	else if(signal == "PLAY"){	// after clicking the continue button   	
		//$("#submitButton").prop('disabled', true);
		tutorial = tutorialMistake;
		//highlight("play");	
		instructions.innerHTML = tutorialMessages[2];
    	//instructions.style.top = "550px";
	}
}

function tutorialFinish(){
    if(next){
    	//$("#submitButton").prop('disabled', true);
    	++tutorialMessage;
		instructions.innerHTML = tutorialMessages[tutorialMessage];
		tutorial = taskStart;
	}
}

function taskStart(){
	if(next){
		//$("#submitButton").prop('disabled', true);
		$('.suggestEntry').empty();		// clear the suggestion content
		instructions.innerHTML = "";
		
		var videoPath = document.getElementById("vidPlayer").src;
		var vidId = gup('video');

 		//console.log("vidId: " + vidId);
 		//console.log("videoPath: " + videoPath);
 		//videoPath = changeUrl(videoPath, vidId);
 		//document.getElementById("vidPlayer").src = videoPath;
		
		var url = window.location.href;
		//console.log("url: " + url);
		sessionStorage.setItem("task", true);
 		//window.location = url.slice(0, -12) + vidId;
 		var tempUrl = url.split("=");
 		var newUrl = tempUrl[0] + "=" + vidId;
 		console.log("newUrl: " + newUrl);
 		window.location = newUrl;
 		
 		tutorial = finish;
	}
}

function finish(){
	console.log("finish");
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