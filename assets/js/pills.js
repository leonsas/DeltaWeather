/*
 * Simple way to use HTML5 geolocation API to obtain the location of the user.
 * We'll need user's location to get the local weather.
 *
 */
$(function() {

	// this is using my api key from wunderground
	var baseURL = 'http://api.wunderground.com/api/1d0606d6ee23da9e';

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

	function getHourlyDeltas(currtemp, data) {

		deltas = [];
		for ( i = 0; i < 12; i++) {

			hour_string = data.hourly_forecast[i].FCTTIME.civil;
			feels_like_temp = data.hourly_forecast[i].feelslike.english;
			delta = feels_like_temp - currtemp;

			deltas.push({
				hour : hour_string,
				delta : {
					magnitude : Math.abs(delta),
					direction : delta ? delta < 0 ? 'colder' : 'warmer' : 0,
					percentage_change : Math.abs(delta) * 100 / currtemp
				},
				
			});

		}
		return deltas;
	};
	
	function transformBar(data) {
	for (i = 0; i < 12; i++)
	{
		if (data[i].delta.direction == "warmer")
		{
			$('.barswrapper').find('.bar-right :eq(' + i + ')').hide();
			$('.barswrapper').find('.bar-left :eq(' + i + ')').css('width', '' + data[i].delta.percentage_change + '%');
		}
		else
		{
			$('.barswrapper').find('.bar-left :eq(' + i + ')').hide();
			$('.barswrapper').find('.bar-right :eq(' + i + ')').css('width', '' + data[i].delta.percentage_change + '%');
		}
	}
	}

	function getCurrentConditions(state, city) {

		//new URL
		conditionURL = baseURL + '/conditions/q/' + state + '/' + city + '.json';
		yesterdayURL = baseURL + '/yesterday/q/' + state + '/' + city + '.json';
		hourlyURL = baseURL + '/hourly/q/' + state + '/' + city + '.json';
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
						$.ajax({
							url : hourlyURL,
							dataType : "jsonp",
							success : function(data3) {
								var date = new Date();
								var hour = date.getHours();
								var j = 0;
								var k = 0;
								console.log(data);

								while (j != hour) {
									j = data.history.observations[k].date.hour;
									k++;
								}
								k--;
								weatherpic = document.getElementById('weatherpic');
								current = data2.current_observation.temp_f;
								console.log(data3);
								deltas = getHourlyDeltas(current, data3);
								
								transformBar(deltas);
								yesterday = data.history.observations[k].tempi;
								/*
								for (var i = 1; i < 13; i++) {
									changeIcon(data3.hourly_forecast[i].condition, i);
								}
								test = current - yesterday;
								test = test.toFixed(0);
								if (test > 0) {
									stuff.innerHTML = 'It is ' + test + ' degrees warmer than yesterday.';
								} else if (test < 0) {
									test *= -1;
									stuff.innerHTML = 'It is ' + test + ' degrees colder than yesterday.';
								} else {
									stuff.innerHTML = 'It is the same temperature as yesterday.';
								}
								*/
							}
						});
					}
				});
			}
		});
	};

	function changeIcon(conditions, index) {
		var icons = new Skycons();
		var cond = "";
		switch(index) {
			case 1:
				cond = "condition";
				break;
			case 2:
				cond = "condition2";
				break;
			case 3:
				cond = "condition3";
				break;
			case 4:
				cond = "condition4";
				break;
			case 5:
				cond = "condition5";
				break;
			case 6:
				cond = "condition6";
				break;
			case 7:
				cond = "condition7";
				break;
			case 8:
				cond = "condition8";
				break;
			case 9:
				cond = "condition9";
				break;
			case 10:
				cond = "condition10";
				break;
			case 11:
				cond = "condition11";
				break;
			case 12:
				cond = "condition12";
				break;
		}
		switch(conditions) {
			case "Clear":
			case "Mostly Sunny":
				icons.set(cond, Skycons.CLEAR_DAY);
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
				icons.set(cond, Skycons.RAIN);
				break;
			case "Sleet":
				icons.set(cond, Skycons.SLEET);
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
				icons.set(cond, Skycons.SNOW);
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
				icons.set(cond, Skycons.FOG);
				break;
			case "Overcast":
			case "Scattered Clouds":
			case "Mostly Cloudy":
				icons.set(cond, Skycons.CLOUDY)
				break;
			case "Cloudy":
			case "Partly Cloudy":
			case "Partly Sunny":
				icons.set(cond, Skycons.PARTLY_CLOUDY_DAY);
				break;
			default:
				icons.set(cond, Skycons.CLEAR_DAY);
				break;
		}
		icons.play();
	};

	getGeoLocation();
});
