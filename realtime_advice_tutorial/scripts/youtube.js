	  var isPause = false;
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      //alert("Note: before submitting the HIT, you must view the video AND mark segments containing the action you are looking for!")

      // var startTime = 40; //start time. This is the only place the start time needs to be set.
      // var endTime = 90; //end time. This is the only place the end time needs to be set.

      var row; //JSON object containing setup info
      var startTime;
      var endTime;
      var vidId;

      //var vidId = 'A4QcyW-qTUg'; //youtube video ID

      startTime = 0;
      endTime = 600;
      if( gup('video') == '' ) {
		alert("No video selected. Please add a '?video=' value to the URL, then reload the page.");
      }
      else {
		//vidId = gup('video');
		if(sessionStorage.getItem("task_real")){
			vidId = gup('video');
			//console.log("TASK TRUE");
		}else{
			vidId = 'CU8Xe_Yh9Lc';
			//console.log("TUTORIAL TRUE");
		}
		
      }

      //alert("SUCCESS (yt.js) --> " + startTime + " | " + endTime + " | " + vidId)


      var currentTimeLeft = 0;
      var currentTimeRight = 0;

      var isScrolling = false; //used to prevent slider from snapping back and forth between old and new times
      
      $( "#timeSlider" ).slider({ //initializes the playback slider. The range of this slider is from the start time to the end time.
        step: .1,
        min: startTime,
        max: endTime,
        value: startTime,
        start: function( event, ui ) {startSliderChange(ui)},
        stop: function( event, ui ) {stopSliderChange(ui)}
        //slide: function( event, ui ) {slidingSliderChange(ui)}
      }); 
      var timeSliderVar;

      tag.src = "//www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('vidPlayer', {
          height: '390',
          width: '640',
          videoId: vidId,
          playerVars: {
            'controls': '0',
            'start': startTime,
            'end': endTime,
            'showinfo': '0',
            'modestbranding': '1',
            'rel': '0',
	    'iv_load_policy': '3',
	    'cc_load_policy': '0',
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        //event.target.playVideo();
        //endTime = player.getDuration();
        //player.setPlaybackRate(0.25);
		player.setOption('cc', 'fontSize', -1);
		//player.getOption('cc', 'track')['languageCode'] = "";
		//alert(player.getOptions('cc'));
		//player.setOption('cc', 'track', '');
		player.mute();
        startTimeSlider();
      }

      function onPlayerStateChange(event){
        //endTime = player.getDuration();
        player.setPlaybackRate(0.25);
        if(event.data == YT.PlayerState.PLAYING){
        	//console.log("play playing");
        	$("#but_swi").addClass("_pause").removeClass("_play");
			$("#but_swi").html("Pause");
         
        	
          if(isScrolling){
            startTimeSlider();
            isScrolling = false;
          }
          
          if(isPause){
          	if(!sessionStorage.getItem("task_real")){
            	$('.suggestEntry').empty();
          		player.seekTo(player.getCurrentTime()-10);
          	}else{
          		$('#play').hide();
          	}
          	
          }
        }
        else if(event.data == YT.PlayerState.PAUSED){
				$("#but_swi").addClass("_play").removeClass("_pause");
				$("#but_swi").html("Play");
				
				if(!sessionStorage.getItem("task_real")){
					$('#play').attr('value', 'Replay');
				}else{
					$('#play').hide();
				}
				
				isPause = true;
				

        }
        else if(event.data == YT.PlayerState.ENDED){
          var buttonVal = $('#play').attr('value');
          
          if(sessionStorage.getItem("task_real")){
			   if(buttonVal == 'Mistake!'){
				  $('#play').hide();
			   }
			   else if (buttonVal == 'Continue') {
				  $('#play').hide();
				  $('#stepf').hide();
				  $('#stepb').hide();
				  $('#jumpf').hide();
				  $('#jumpb').hide();
				  $('#inputContainer').hide(200);
			  }
          }else{
          		if (buttonVal == 'Mistake!') {
          	  //console.log("play end and wait button change to replay");
              $('#play').attr('value', 'Replay');
          }
		
		  
          else if (buttonVal == 'Continue') {
          	  //console.log("play end and continue button change to replay");
              $('#play').attr('value', 'Replay');
              $('#stepf').hide();
              $('#stepb').hide();
              $('#jumpf').hide();
              $('#jumpb').hide();
              $('#inputContainer').hide(200);
          }
          }
          
          if(sessionStorage.getItem("task_real")){
          	$("#legion-submit").removeAttr("DISABLED"); //enables submit button if video has ended
          }
          
        }
      }

      $("#playVid").click( function(event){ //controls the play/pause button
        if(player.getPlayerState() == 1){
          player.pauseVideo();
        }
        else{
          player.playVideo();
        }
      });


      var timeSliderVar;
      var timeTextVar;
      function startTimeSlider(){
        timeSliderVar = setInterval(function(){
          endTime = player.getDuration();
          $( "#timeSlider" ).slider( "option", "value", player.getCurrentTime());
        }, 100);
        timeTextVar = setInterval(function(){
          endTime = player.getDuration();
          $("#playTime").html(((10 * (player.getCurrentTime() - startTime)) / 10).toFixed(2) + "/" + (endTime - startTime).toFixed(2));
        }, 100);
      }

      function startSliderChange(ui){
        clearInterval(timeSliderVar);
        clearInterval(timeTextVar);
        isScrolling = true;
        timeTextVar = setInterval(function(){
          endTime = player.getDuration();
          $("#playTime").html(((10 * ($( "#timeSlider" ).slider( "option", "value" ) - startTime))/10).toFixed(2) + "/" + (endTime - startTime).toFixed(2));
        }, 100);
      }

      function stopSliderChange(ui){
        clearInterval(timeTextVar);
        player.seekTo(ui.value);
      }


    $(document).ready(function(){
    	
      $('#setEnd').click( function(){
        currentTimeRight = (player.getCurrentTime() - startTime).toFixed(3);
        currentTimeRight_float = parseFloat(currentTimeRight);//changes curr right to float
        var val_bar_r = $( "#slider-range" + activeBarID ).slider( "option" , "values");
        var set_left = val_bar_r[0];
        var set_right = val_bar_r[1];
        var set_right_float = parseFloat(set_right);
		$( "#slider-range" + activeBarID  ).slider( "values", 1, currentTimeRight );
		$( "#amount" + activeBarID ).val( val_bar_r[ 0 ] + "s - " + currentTimeRight_float +"s"); 
		val[(2 * activeBarID) + 1] = (val_bar_r[1] + startTime);

		    if( (set_left > currentTimeRight) ) //sets left marker to inital position if it adheres to one of two conditions: past the end marker on it's bar, or behind the end on the previos bar 
        	{
        		alert("You can't have the green slider (start) ahead of the red one(end)! [in the right]");
        		$( "#slider-range" + activeBarID ).slider( "values", 1, set_right );
        		val[(2 * activeBarID) + 1] = (set_right + startTime);
        		$( "#amount" + activeBarID ).val( val_bar_r[ 0 ] + "s - " + set_right_float +"s");
        	}
        	//alert(val.join('\n'));

	});

});
