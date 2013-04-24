/*
 * Simple way to use HTML5 geolocation API to obtain the location of the user.
 * We'll need user's location to get the local weather.
 *
 */
var geocoder;
$(function() {
	function initialize() {
		geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(40.730885, -73.997383);
	}

	function codeLatLng(lat, lng) {
		var latlng = new google.maps.LatLng(lat, lng);
		geocoder.geocode({
			'latLng' : latlng
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					
					$('#current_location').text(results[0].address_components[3].short_name);
				} else {
					console.log('No results found');
				}
			} else {
				console.log('Geocoder failed due to: ' + status);
			}
		});
	}

	function switchUnitsButtonTextUpdate() {

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
	// grossbill6 1d0606d6ee23da9e
	//var baseURL = 'http://api.wunderground.com/api/1d0606d6ee23da9e';
	//key from forecast.io
	var baseURL = 'https://api.forecast.io/forecast/fc590758007d8f0eb51877e6883ffda1/';

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
	
	function displayAccessories(data) {
		console.log("displayaccesories");
		temp = data.currently.temperature;
		console.log(temp);

		precip = data.currently.precipIntensity;

		//for 1st icon

		if (precip > .01){
			changeAccessoryIcon("umbrella", 0);
		}
		else {
			changeAccessoryIcon("sunglasses", 0);
		}
		
		//for 2nd icon
		if (temp > 60){
			changeAccessoryIcon("Tshirt", 1);
		}
		else if (temp > 50){
			changeAccessoryIcon("LongSleeveShirt", 1);
		}
		else if (temp > 40 ){
			changeAccessoryIcon("sweatshirt", 1);
		}		
		else {
			changeAccessoryIcon("jacket", 1);
		}


		//for 3rd icon
		if (temp > 70){
			changeAccessoryIcon("shorts", 2);
		}
		else {
			changeAccessoryIcon("pants", 2);
		}

		//for 4th icon
		if (temp > 70){
			changeAccessoryIcon("flipflops", 3);
		}
		else if (temp > 30){
			changeAccessoryIcon("sneaker", 3);
		}
		else {
			changeAccessoryIcon("snow_boots", 3);
		}

	}

	function changeAccessoryIcon(clothingtop, position) {
		accpathway = "assets/img/Accessories/" + clothingtop + ".svg"
		$(".accessory-icon").eq(position).attr("src", accpathway);

	}

	function getCityLocation(latitude, longitude) {
		initialize();
		codeLatLng(latitude, longitude);
		//new URL that does a geolookup to get a city name from lat/lon
		desired_unit = $.cookie('unit');
		if (desired_unit == 'celsius') {
			queryURL = baseURL + latitude + ',' + longitude + '?exclude=minutely,hourly,alerts,flags&units=si';
		} else {
			queryURL = baseURL + latitude + ',' + longitude + '?exclude=minutely,hourly,alerts,flags';
		}
		googleURL = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true';

		//GET call that returns the geolookup info
		$.ajax({
			url : queryURL,
			dataType : "jsonp",
			success : function(data) {
				displayAccessories(data);
				//state = data.location.state;
				//city = data.location.city;
				//$('#current_location').text(city)
				//Lets get the current conditions for this state and city.
				//getCurrentConditions(state, city);
				//new URL
				//conditionURL = baseURL + '/conditions/yesterday/astronomy/q/' + state + '/' + city + '.json';
				var delta_string = document.getElementById('delta_string');
				var currentlyfeelhtml = document.getElementById("current_feels_like");

				//now query wunderground for current conditions for the city/state, and display 		the Feels Like temp.
				/*$.ajax({
				url : conditionURL,
				dataType : "jsonp",
				success : function(data) {*/

				//var date = new Date();
				//var hour = date.getHours();
				var time = data.currently.time;
				/*
				var j = 0;
				var k = 0;
				while(j != hour){
				j = data.history.observations[k].date.hour;
				k++;
				}
				k--;
				weatherpic = document.getElementById('weatherpic');
				current = data.current_observation.temp_f;
				yesterday = data.history.observations[k].tempi;
				*/
				//var sunrise = data.moon_phase.sunrise.hour;
				var sunrise = data.daily.sunriseTime;
				//var sunset = data.moon_phase.sunset.hour;
				var sunset = data.daily.sunsetTime;
				var check = 1;
				if (time < sunrise || time > sunset) {
					check = 0;
				}

				weatherpic = document.getElementById('weatherpic');
				current = data.currently.temperature;
				if (desired_unit == 'celsius') {
					//current = data.current_observation.temp_c;
					current_feels_like.innerHTML = 'Feels like ' + current + '&#176; C';
					//yesterday = data.history.dailysummary[0].meantempm;
				} else {
					//current = data.current_observation.temp_f;
					current_feels_like.innerHTML = 'Feels like ' + current + '&#176; F';
					//yesterday = data.history.dailysummary[0].meantempi;
				}

				//console.log(data)
				//changeIcon(data.currently.icon, check);
				yesterdayTime = time - 86400;
				if (desired_unit == 'celsius') {
					yesterdayURL = baseURL + latitude + ',' + longitude + ',' + yesterdayTime + '?exclude=minutely,hourly,alerts,flags&units=si';
				} else {
					yesterdayURL = baseURL + latitude + ',' + longitude + ',' + yesterdayTime + '?exclude=minutely,hourly,alerts,flags';
				}
				$.ajax({
					url : yesterdayURL,
					dataType : "jsonp",
					success : function(data2) {
						yesterday = data2.currently.temperature;
						difference = current - yesterday;
						difference = difference.toFixed(0);
						if (difference > 0) {
							delta_string.innerHTML = '&uarr;' + difference + '&deg; from yesterday';
						} else if (difference < 0) {
							difference *= -1;
							delta_string.innerHTML = '&darr;' + difference + '&deg; from yesterday';
						} else {
							delta_string.innerHTML = 'It is the same temperature as yesterday.';
						}
					}
				});
			}
		});
		//}
		//});

	};

	//function getCurrentConditions(state, city) {
	//};

	function changeIcon(conditions, index) {
		var icons = new Skycons();
		switch(conditions) {
			case "clear-day":
				icons.set("condition", Skycons.CLEAR_DAY);
				break;
			case "clear-night":
				icons.set("condition", Skycons.CLEAR_NIGHT);
				break;
			case "rain":
				icons.set("condition", Skycons.RAIN);
				break;
			case "snow":
				icons.set("condition", Skycons.SNOW);
				break;
			case "sleet":
				icons.set("condition", Skycons.SLEET);
				break;
			case "wind":
				icons.set("condition", Skycons.WIND);
				break;
			case "fog":
				icons.set("condition", Skycons.FOG);
				break;
			case "cloudy":
				icons.set("condition", Skycons.CLOUDY);
				break;
			case "partly-cloudy-day":
				icons.set("condition", Skycons.PARTLY_CLOUDY_DAY);
				break;
			case "partly-cloudy-night":
				icons.set("condition", Skycons.PARTLY_CLOUDY_NIGHT);
				break;
			default:
				if (index) {
					icons.set("condition", Skycons.CLEAR_DAY);
				} else {
					icons.set("condition", Skycons.CLEAR_NIGHT);
				}
				break;
		}
		icons.play();
		/*case "Clear":
		 case "Mostly Sunny":
		 if(index){
		 icons.set("condition", Skycons.CLEAR_DAY);}
		 else{
		 icons.set("condition", Skycons.CLEAR_NIGHT);}
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
		 if(index){
		 icons.set("condition", Skycons.PARTLY_CLOUDY_DAY);}
		 else{
		 icons.set("condition", Skycons.PARTLY_CLOUDY_NIGHT);}
		 break;
		 default:
		 if(index){
		 icons.set("condition", Skycons.CLEAR_DAY);}
		 else{
		 icons.set("condition", Skycons.CLEAR_NIGHT);}
		 break;*/
	}

	//icons.play();
	//};

	$("#switch_units").click(function() {

		current_unit = $.cookie('unit');
		if (current_unit == 'celsius') {
			$.cookie('unit', 'fahrenheit', {
				expires : 7
			});
		} else {
			$.cookie('unit', 'celsius', {
				expires : 7
			});
		}

		window.location.reload();
		//force reload to make the changes appear
	});

	getGeoLocation();
	switchUnitsButtonTextUpdate();
});
