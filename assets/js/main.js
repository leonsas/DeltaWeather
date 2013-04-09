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
				getWeather(state,city);
			}
		});

	};

	function getCurrentConditions(state,city){

		//new URL
		conditionURL = baseURL + '/conditions/q/' + state + '/' + city + '.json';
		yesterdayURL = baseURL + '/yesterday/q/' + state + '/' + city + '.json';
		var stuff = document.getElementById('stuff');
<<<<<<< HEAD
		
=======

>>>>>>> UI/Skycons
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

	function getWeather(state,city){
	weatherURL = baseURL + '/conditions/q/' + state + '/' + city + '.json';
	var weatherpic = document.getElementById('weatherpic');
	$.ajax({
		url : weatherURL,
		dataType : "jsonp",
		success : function(data) {
<<<<<<< HEAD
		weatherpic.innerHTML = data.current_observation.weather;
	}
	});	
};
	
=======
		changeIcon(data.current_observation.weather);
	}
	});	
};

	function changeIcon(conditions){
	var icons = new Skycons();
	switch(conditions)
	{
	case "Clear":
	icons.set("condition", Skycons.CLEAR_DAY);
	break;
	case "Cloudy":
	icons.set("condition", Skycons.CLOUDY);
	break;
	case "Rain":
	icons.set("condition", Skycons.RAIN);
	break;
	case "Sleet":
	icons.set("condition", Skycons.SLEET);
	break;
	case "Snow":
	icons.set("condition", Skycons.SNOW);
	break;
	case "Fog":
	icons.set("condition", Skycons.FOG);
	break;
	case "Thunderstorms":
	icons.set("condition", Skycons.RAIN);
	break;
	case "Thunderstorm":
	icons.set("condition", Skycons.RAIN);
	break;
	case "Overcast":
	icons.set("condition", Skycons.CLOUDY);
	break;
	case "Scattered Clouds":
	icons.set("condition", Skycons.CLOUDY);
	break;
	case "Mostly Cloudy":
	icons.set("condition", Skycons.CLOUDY);
	break;
	case "Mostly Sunny":
	icons.set("condition", Skycons.CLEAR_DAY);
	break;
	case "Partly Cloudy":
	icons.set("condition", Skycons.PARTLY_CLOUDY_DAY);
	break;
	case "Partly Sunny":
	icons.set("condition", Skycons.PARTLY_CLOUDY_DAY);
	break;
	case "Freezing Rain":
	icons.set("condition", Skycons.SLEET);
	break;
	default:
	icons.set("condition", Skycons.CLEAR_DAY);
	break;
	}
	icons.play();
	};

>>>>>>> UI/Skycons
	getGeoLocation();
});
