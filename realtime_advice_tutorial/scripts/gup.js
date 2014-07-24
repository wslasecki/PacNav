// function for getting URL parameters
function gup(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null)
	    return "";
    else
	    return unescape(results[1]);
}

// function for changing URL parameters
function changeUrl(url, vidId) {
	var patt = /\?/;
	var index = url.search(patt);
	//console.log("position of ?: " + index);
	var str1 = url.substring(0, index-11);
	var str2 = url.substring(index);
	url = str1.concat(vidId, str2);
	
	//url = str1.concat("video=", vidId);
	console.log("changeUrl url: " + url);
	return url;
}