var instructions = document.getElementById("tutorialMessages");
var tutorial;
var next = false;
var mistakeNum = 0;

var tutorialMessage = 0;
var tutorialMessages = [
"In this study, you will watch a video with respect to a pac-man playing a game, and you will need to point out the time that the pac-man is making a mistake. There's only one mistake in each video. <br /><br />Click the screen to continue",
"Click the Play button to watch the video. Remember that you can watch the video multiple times in this tutorial, but you can only watch the video one time in real task.",
"If you think the pac-man is making a mistake, click Mistake button to give your suggestion. If the video ends, click Replay button to watch it again. <br /><br />Click Mistake or Replay button to continue",
"You have made the wrong suggestion over three times. PacMan makes a mistake at roughly 5.50. Please step to time 5.50 and identify that a mistake was made.",
"PacMan has not made any mistakes yet! <br /> Please continue watching the video to find the mistake.",
"PacMan has already made a mistake. <br />  Please replay the video or step back to find the time of the mistake.",
"Good job! You just gave the correct suggestion. The pac-man did make a mistake at that time! <br /><br />Click the screen to continue",
"Now you can start to do the real task to find the time that the pacman is making a mistake! Remember that you can only watch the video once!<br /><br />Click the screen to continue"
];

initiate();

function initiate(){
	if(sessionStorage.getItem("task")){
		//console.log("NO TUTORIAL");
		instructions.innerHTML = "";
		document.getElementById("suggestContainer").style.height = "456px";
		document.getElementById("submitButton").style.display = "";
		return;
	}else{
		window.addEventListener("click", mouseClicked, false);
		tutorialSetup();
	}
}

function tutorialSetup(){
	//console.log("tutorial setup");
	//disable play and submit buttons
	$("#play").prop('disabled', true);
	if(isClose){
		instructions.innerHTML = tutorialMessages[0];
		tutorial = tutorialStart;
	}else{
		tutorial = tutorialSetup;
	}
}

function tutorialStart(){
	//console.log("tutorial start");
    $("#play").prop('disabled', false);
	//$("#submitButton").prop('disabled', true);
	tutorial = tutorialWait;
	highlight("play");
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
		highlight("play");
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
		if(time >= 5.50 && time <= 5.54){
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
				}else if(time > 5.54){
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

 		//console.log("vidId: " + vidId);
 		//console.log("videoPath: " + videoPath);
 		// videoPath = changeUrl(videoPath, vidId);
//  		document.getElementById("vidPlayer").src = videoPath;
		
		var url = window.location.href;
		//console.log("url: " + url);
		sessionStorage.setItem("task", true);
				
 		window.location = url.slice(0, -12) + vidId;		
 		
 		
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