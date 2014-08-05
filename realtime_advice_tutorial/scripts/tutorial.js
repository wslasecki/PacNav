var instructions = document.getElementById("tutorialMessages");

var tutorial;
var next = false;
var answer = false;
var isFirstMistake = true;

var tutorialMessage = 0;
var tutorialMessages = [
"In this study, you will watch a video with respect to a pac-man playing a game, and you will need to point out the time that the pac-man has made a mistake <br /><br />Click the screen to continue",
"To begin searching the mistake, click Play button to watch the video, remember that you can only watch the video once <br /><br />Click Play button to continue",
"If you think the pac-man is making a mistake, click Wait button and step back and forward to find the exact time that the pac-man is making a mistake <br /><br />Click Wait button to continue",
"After you find the exact mistake time, please click Mistake button to give your suggestion <br /><br />Click Mistake button to continue",
"Oh, no, your suggestion is wrong, the correct mistake time should be at 4.11s! You must step back or forward to find the mistake time and give suggestion to move on<br /><br />Click the screen to continue",
"Good job! You just give the correct suggestion. The pac-man did make a mistake at that time! <br /><br />Click the screen to continue",
"Now you can begin the real task to find the time that the pacman is making a mistake! <br /><br />Click the screen to continue"
];

window.addEventListener("click", mouseClicked, false);

tutorialSetup();

function tutorialSetup(){
	console.log("in tutorialSetup");
	//disable all buttons
	$("#play").prop('disabled', true);
	$("#submitButton").prop('disabled', true);
    instructions.innerHTML = tutorialMessages[0];
    tutorial = tutorialStart;
}

function tutorialStart(){
    console.log("in tutorialStart");
    $("#play").prop('disabled', false);
	$("#submitButton").prop('disabled', true);
	tutorial = tutorialWait;
	highlight("play");
	++tutorialMessage;
	instructions.innerHTML = tutorialMessages[tutorialMessage];
}

function tutorialWait(){
    if(signal == "PLAY"){
    console.log("in tutorialWait");
	tutorial = tutorialMistake;
	highlight("play");
	++tutorialMessage;
	instructions.innerHTML = tutorialMessages[tutorialMessage];
    }
}

function tutorialMistake(){
    if(signal == "WAIT"){
    console.log("in tutorialMistake");
	tutorial = tutorialAnswer;
	highlight("mistake");
	++tutorialMessage;
	instructions.innerHTML = tutorialMessages[tutorialMessage];
	instructions.style.top = "615px";
    }
}

function tutorialAnswer(){
    if(signal == "MISTAKE"){
		console.log("mistake time sec: " + timeSec);
		console.log("mistake time frac" + timeFrac);
		var time = timeSec + '.' + timeFrac;
		if(time == '4.09' || time == '4.10' || time == "4.10" || time == "4.11"){
			if(isFirstMistake){
				tutorialMessage += 2;
			}else{
				++tutorialMessage;
			}	
			$('#play').hide();
        	$('#stepf').hide();
        	$('#stepb').hide();
        	$('#jumpf').hide();
        	$('#jumpb').hide();
    		$('#inputContainer').hide(200);
			instructions.innerHTML = tutorialMessages[tutorialMessage];
			instructions.style.top = "550px";
			answer = true;
			tutorial = tutorialFinish;
		}else{
			if(isFirstMistake){
				++tutorialMessage;
				isFirstMistake = false;
			}
			instructions.innerHTML = tutorialMessages[tutorialMessage];
			answer = false;
			tutorial = tutorialAnswer;
		}
		
	}
}

function tutorialFinish(){
    if(next){
    	if(!answer){
    		tutorialMessage += 2;
    	}else{
    		++tutorialMessage;
    	}
    	
		instructions.innerHTML = tutorialMessages[tutorialMessage];
		
		tutorial = taskStart;
	}
	
}

function taskStart(){
	if(next){
		$('.suggestEntry').empty();		// clear the suggestion content
		instructions.innerHTML = "";
		
		var videoPath = document.getElementById("vidPlayer").src;
		var vidId = gup('video');

 		console.log("vidId: " + vidId);
 		console.log("videoPath: " + videoPath);
 		videoPath = changeUrl(videoPath, vidId);
 		document.getElementById("vidPlayer").src = videoPath;

 		$('#play').show();
 		$('#play').attr('value', 'Play');
 		tutorial = finish;

		// 添加代码开始真正的task 还原到最初的任务模式 ！！！  记得还有video的三角符号开始标记没有禁止！！！
	}
}

function finish(){
	console.log("finish");
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

function update(){
	console.log("in update");
	tutorial();
	next = false;
}

function mouseClicked(e){

    next = true;
    update();
}
