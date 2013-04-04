/*
 * Simple way to use HTML5 geolocation API to obtain the location of the user.
 * We'll need user's location to get the local weather.
 * 
 */


function getLocation() {
	//check if geolocation is enabled (i.e browser supports it, and users enables it.)
	if (navigator.geolocation) {
		//use HTML5 geolocation API with our callback to show the position
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		console.log("geolocation not supported");
	}
}


function showPosition(position) {
	document.body.innerHTML="Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude
}

getLocation()

