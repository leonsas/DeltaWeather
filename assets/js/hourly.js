/*
 * Simple way to use HTML5 geolocation API to obtain the location of the user.
 * We'll need user's location to get the local weather.
 *
 */
$(function() {

	// this is using my api key from wunderground
	//var baseURL = 'http://api.wunderground.com/api/1d0606d6ee23da9e';
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

	function getCityLocation(latitude, longitude) {
		//new URL that does a geolookup to get a city name from lat/lon
		//queryURL = baseURL + '/geolookup/q/' + latitude + ',' + longitude + '.json';

		//GET call that returns the geolookup info
		/*$.ajax({
		 url : queryURL,
		 dataType : "jsonp",
		 success : function(data) {
		 state = data.location.state;
		 city = data.location.city;

		 //Lets get the current conditions for this state and city.
		 getCurrentConditions(state, city);
		 }
		 });
		 //new URL
		 conditionURL = baseURL + '/conditions/q/' + state + '/' + city + '.json';
		 yesterdayURL = baseURL + '/yesterday/q/' + state + '/' + city + '.json';
		 hourlyURL = baseURL + '/hourly/q/' + state + '/' + city + '.json';*/
		desired_unit = $.cookie('unit');
		if (desired_unit == 'celsius') {
			queryURL = baseURL + latitude + ',' + longitude + '?exclude=currently,minutely,daily,alerts,flags?units=si.jsonp';
		} else {
			queryURL = baseURL + latitude + ',' + longitude + '?exclude=currently,minutely,daily,alerts,flags.jsonp';
		}
		$.ajax({
			url : queryURL,
			dataType : "jsonp",
			success : function(data) {
				currtemp = data.hourly.data[0].temperature;
				hourlies = getHourlyData(currtemp,data);
				console.log(hourlies);
				//transformBar(deltas);
				linechart(hourlies);
				//for (i = 1; 1 < 13; i++)
				//{
				//changeIcon(data.hourly.data[i].icon, i);
				//}
			}
		});
		//now query wunderground for current conditions for the city/state, and display 		the Feels Like temp.
		/*$.ajax({
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
		 }
		 });
		 }
		 });
		 }
		 });*/
	};

	function getHourlyDeltas(currtemp, data) {

	 deltas = [];
	 for ( i = 0; i < 12; i++) {

	 hour_string = data.hourly_forecast[i].FCTTIME.civil;
	 feels_like_temp = data.hourly_forecast[i].feelslike.english;
	 icon_url = data.hourly_forecast[i].icon_url

	 delta = feels_like_temp - currtemp;

	 deltas.push({
	 hour : hour_string,
	 feels_like : feels_like_temp,
	 icon_url : icon_url,
	 delta : {
	 magnitude : Math.abs(delta),
	 direction : delta ? delta < 0 ? 'colder' : 'warmer' : 0,
	 percentage_change : Math.abs(delta) * 100 / currtemp
	 },

	 });

	 }
	 return deltas;
	};

	function linechart(input) {
		labels= []
		data_colder = [];
		data_warmer =[];
			for (i = 0; i< 12;i++){
				labels.push(input[i].hour);
				if (input[i].direction == "colder"){
				data_colder.push(input[i].percentage_change);
				}
				else{
					data_warmer.push(input[i].percentage_change);
				}
			}
		console.log(data_warmer)
		var lineChartData = {
			labels : labels,
			datasets : [{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : data_colder
			}
			
			
			
			
			]
		}

		var myLine = $("#delta").get(0).getContext("2d");

		var myNewChart = new Chart(myLine).Bar(lineChartData, {
			scaleShowGridLines : false,
			scaleStartValue : 0,
			scaleOverride : 0,
			scaleShowLabels : true,
		});
	}

	function getHourlyData(currtemp, data) {
		hourlies = [];
		for ( i = 1; i < 13; i++) {
			var timestamp = new Date(data.hourly.data[i].time * 1000);
			hour_string = timestamp.toLocaleTimeString();
			feels_like_temp = data.hourly.data[i].temperature;
			delta = feels_like_temp - currtemp;
			hourlies.push({
				hour : hour_string,
				temp : feels_like_temp,
				magnitude : Math.abs(delta),
	 			direction : delta ? delta < 0 ? 'colder' : 'warmer' : 0,
	 			percentage_change : Math.abs(delta) * 100 / currtemp
			});
		}
		return hourlies;
	};

	function transformBar(data) {

		num_bars = 12
		for ( i = 0; i < num_bars; i++) {
			$('.barswrapper').find('.curr_temp').eq(i).text(data[i].feels_like);
			$('.barswrapper').find('.condition_img').eq(i).attr("src", data[i].icon_url);
			$('.barswrapper').find('.time').eq(i).text(data[i].hour);
			if (data[i].delta.direction == "warmer") {
				$('.barswrapper').find('.bar-right').eq(i).hide();
				$('.barswrapper').find('.bar-left').eq(i).css('width', '' + data[i].delta.percentage_change + '%');
			} else {
				$('.barswrapper').find('.bar-left').eq(i).hide();
				$('.barswrapper').find('.bar-right').eq(i).css('width', '' + data[i].delta.percentage_change + '%');
			}
		}
	}

	//function getCurrentConditions(state, city) {};

	function changeIcon(conditions, index) {
		var icons = new Skycons();
		var cond = "";
		switch(index) {
			case 1:
				cond = "condition1";
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
			case "clear-day":
				icons.set(cond, Skycons.CLEAR_DAY);
				break;
			case "clear-night":
				icons.set(cond, Skycons.CLEAR_NIGHT);
				break;
			case "rain":
				icons.set(cond, Skycons.RAIN);
				break;
			case "snow":
				icons.set(cond, Skycons.SNOW);
				break;
			case "sleet":
				icons.set(cond, Skycons.SLEET);
				break;
			case "wind":
				icons.set(cond, Skycons.WIND);
				break;
			case "fog":
				icons.set(cond, Skycons.FOG);
				break;
			case "cloudy":
				icons.set(cond, Skycons.CLOUDY);
				break;
			case "partly-cloudy-day":
				icons.set(cond, Skycons.PARTLY_CLOUDY_DAY);
				break;
			case "partly-cloudy-night":
				icons.set(cond, Skycons.PARTLY_CLOUDY_NIGHT);
				break;
			default:
				icons.set(cond, Skycons.CLEAR_DAY);
				break;
		}
		icons.play();
	};

	getGeoLocation();
});
