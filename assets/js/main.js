/*
 * Simple way to use HTML5 geolocation API to obtain the location of the user.
 * We'll need user's location to get the local weather.
 *
 */
$(function() {
	
	function switchUnitsButtonTextUpdate(){
		
		current_unit = $.cookie('unit');
		if (current_unit == 'celsius') {
			$("#switch_units").text("Switch to Fahrenheit");
		} else {
			$("#switch_units").text("Switch to Celsius");
		}
	}
	// this is using my api key from wunderground
	// 394yellow@gmail.com 	def220061728b00b
	// leonsassonha  da56c81ebb4c6a60
	// fitzcn 52469e66c6aa5600
	var baseURL = 'http://api.wunderground.com/api/52469e66c6aa5600';

	function getGeoLocation() {
		//check if geolocation is enabled (i.e browser supports it, and users enables it.)
		if (navigator.geolocation) {
			//use HTML5 geolocation API with our callback to show the position
			navigator.geolocation.getCurrentPosition(getConditions);
		} else {
			alert("geolocation not supported");
		}
	}

	function getConditions(position) {
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
				getCurrentConditions(state, city);
			}
		});

	};

	function getCurrentConditions(state, city) {

		//new URL
		conditionURL = baseURL + '/conditions/q/' + state + '/' + city + '.json';
		yesterdayURL = baseURL + '/yesterday/q/' + state + '/' + city + '.json';
		var stuff = document.getElementById('stuff');
		var currentlyfeelhtml = document.getElementById("current_feels_like");

		//now query wunderground for current conditions for the city/state, and display 		the Feels Like temp.
		$.ajax({
			url : yesterdayURL,
			dataType : "jsonp",
			success : function(data) {

				$.ajax({
					url : conditionURL,
					dataType : "jsonp",
					success : function(data2) {

						weatherpic = document.getElementById('weatherpic');
						desired_unit = $.cookie('unit');
						if (desired_unit == 'celsius') {
							current = data2.current_observation.temp_c;
							current_feels_like.innerHTML = 'Feels like ' + current + '&#176; C';
							yesterday = data.history.dailysummary[0].meantempm;
						} else {
							current = data2.current_observation.temp_f;
							current_feels_like.innerHTML = 'Feels like ' + current + '&#176; F';
							yesterday = data.history.dailysummary[0].meantempi;
						}

						
						console.log(data)
						changeIcon(data2.current_observation.weather);

						test = current - yesterday;
						test = test.toFixed(0);
						if (test > 0) {
							stuff.innerHTML = '&uarr;' + test + '&deg; from yesterday';
						} else if (test < 0) {
							test *= -1;
							stuff.innerHTML = '&darr;' + test + '&deg; from yesterday';
						} else {
							stuff.innerHTML = 'It is the same temperature as yesterday.';
						}
					}
				});
			}
		});
	};

	function changeIcon(conditions) {
		var icons = new Skycons();
		switch(conditions) {
			case "Clear":
			case "Mostly Sunny":
				icons.set("condition", Skycons.CLEAR_DAY);
				break;
			case "Drizzle":
			case "Light Drizzle":
			case "Heavy Drizzle":
			case "Rain":
			case "Light Rain":
			case "Heavy Rain":
			case "Rain Mist":
			case "Light Rain Mist":
			case "Heavy Rain Mist":
			case "Rain Showers":
			case "Light Rain Showers":
			case "Heavy Rain Showers":
			case "Unknown Precipitation":
			case "Thunderstorm":
			case "Light Thunderstorm":
			case "Heavy Thunderstorm":
			case "Thunderstorms and Rain":
			case "Light Thunderstorms and Rain":
			case "Heavy Thunderstorms and Rain":
			case "Thunderstorms and Snow":
			case "Light Thunderstorms and Snow":
			case "Heavy Thunderstorms and Snow":
			case "Thunderstorms and Ice Pellets":
			case "Light Thunderstorms and Ice Pellets":
			case "Heavy Thunderstorms and Ice Pellets":
			case "Thunderstorms and Hail":
			case "Light Thunderstorms and Hail":
			case "Heavy Thunderstorms and Hail":
			case "Thunderstorms and Small Hail":
			case "Light Thunderstorms and Small Hail":
			case "Heavy Thunderstorms and Small Hail":
			case "Freezing Drizzle":
			case "Light Freezing Drizzle":
			case "Heavy Freezing Drizzle":
			case "Freezing Rain":
			case "Light Freezing Rain":
			case "Heavy Freezing Rain":
				icons.set("condition", Skycons.RAIN);
				break;
			case "Sleet":
				icons.set("condition", Skycons.SLEET);
				break;
			case "Snow":
			case "Light Snow":
			case "Heavy Snow":
			case "Snow Grains":
			case "Light Snow Grains":
			case "Heavy Snow Grains":
			case "Ice Crystals":
			case "Light Ice Crystals":
			case "Heavy Ice Crystals":
			case "Ice Pellets":
			case "Light Ice Pellets":
			case "Heavy Ice Pellets":
			case "Hail":
			case "Light Hail":
			case "Heavy Hail":
			case "Low Drifting Snow":
			case "Light Low Drifting Snow":
			case "Heavy Low Drifting Snow":
			case "Blowing Snow":
			case "Light Blowing Snow":
			case "Heavy Blowing Snow":
			case "Snow Showers":
			case "Light Snow Showers":
			case "Heavy Snow Showers":
			case "Snow Blowing Snow Mist":
			case "Light Snow Blowing Snow Mist":
			case "Heavy Snow Blowing Snow Mist":
			case "Ice Pellet Showers":
			case "Light Ice Pellet Showers":
			case "Heavy Ice Pellet Showers":
			case "Hail Showers":
			case "Light Hail Showers":
			case "Heavy Hail Showers":
			case "Small Hail Showers":
			case "Light Small Hail Showers":
			case "Heavy Small Hail Showers":
			case "Small Hail":
				icons.set("condition", Skycons.SNOW);
				break;
			case "Fog":
			case "Light Fog":
			case "Heavy Fog":
			case "Fog Patches":
			case "Light Fog Patches":
			case "Heavy Fog Patches":
			case "Haze":
			case "Light Haze":
			case "Heavy Haze":
			case "Mist":
			case "Light Mist":
			case "Heavy Mist":
			case "Freezing Fog":
			case "Light Freezing Fog":
			case "Heavy Freezing Fog":
			case "Patches of Fog":
			case "Shallow Fog":
			case "Partial Fog":
				icons.set("condition", Skycons.FOG);
				break;
			case "Overcast":
			case "Scattered Clouds":
			case "Mostly Cloudy":
				icons.set("condition", Skycons.CLOUDY);
				break;
			case "Cloudy":
			case "Partly Cloudy":
			case "Partly Sunny":
				icons.set("condition", Skycons.PARTLY_CLOUDY_DAY);
				break;
			default:
				icons.set("condition", Skycons.CLEAR_DAY);
				break;
		}
		icons.play();
	};

	$("#switch_units").click(function() {

		current_unit = $.cookie('unit');
		if (current_unit == 'celsius') {
			$.cookie('unit', 'fahrenheit', {expires : 7});
		} else {
			$.cookie('unit', 'celsius', {expires : 7});
		}
		
		window.location.reload(); //force reload to make the changes appear
	});

	getGeoLocation();
	switchUnitsButtonTextUpdate();
});
