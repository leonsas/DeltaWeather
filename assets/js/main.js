/*
 * Simple way to use HTML5 geolocation API to obtain the location of the user.
 * We'll need user's location to get the local weather.
 *
 */
$(function() {
	
	// this is using my api key from wunderground
	var baseURL = 'http://api.wunderground.com/api/da56c81ebb4c6a60';

	function getGeoLocation() {
		//check if geolocation is enabled (i.e browser supports it, and users enables it.)
		if (navigator.geolocation) {
			//use HTML5 geolocation API with our callback to show the position
			navigator.geolocation.getCurrentPosition(getConditions);
		} else {
			console.log("geolocation not supported");
		}
	}

	function getConditions(position) {
		//document.body.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
		getCityLocation(position.coords.latitude, position.coords.longitude);
	}

	function getCityLocation(latitude, longitude) {
		//new URL that does a geolookup to get a city name from lat/lon
		queryURL = baseURL + '/geolookup/q/' + latitude + ',' + longitude + '.json';
		
		//GET call that returns the geolookup info
		$.ajax({
			url : queryURL,
			dataType : "jsonp",
			success : function(data) {
				state = data.location.state;
				city = data.location.city;
				
				//Lets get the current conditions for this state and city.
				getCurrentConditions(state,city);
			}
		});

	};
	
	function getCurrentConditions(state,city){
		
		//new URL
		conditionURL = baseURL + '/conditions/q/' + state + '/' + city + '.json';
		yesterdayURL = baseURL + '/yesterday/q/' + state + '/' + city + '.json';
		var stuff = document.getElementById('stuff');
		
		//now query wunderground for current conditions for the city/state, and display 		the Feels Like temp.
		$.ajax({
			url : yesterdayURL,
			dataType : "jsonp",
			success : function(data) {
			
			$.ajax({
			        url : conditionURL,
			        dataType : "jsonp",
			        success : function(data2) {
				current = data2.current_observation.temp_f;
				yesterday = data.history.dailysummary[0].meantempi;
				test = current - yesterday;
				test = test.toFixed(0);
				if (test > 0)
				{
				stuff.innerHTML = 'It is ' + test + ' degrees warmer than yesterday.';
				}
				else
				{
				test *= -1;
				stuff.innerHTML = 'It is ' + test + ' degrees colder than yesterday.';
				}}
			      });
						 }
		     });
};
	
	getGeoLocation();
});
