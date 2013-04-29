/*
 * Simple way to use HTML5 geolocation API to obtain the location of the user.
 * We'll need user's location to get the local weather.
 *
 */

 var geocoder;
 $(function() {
 	function initialize() {
 		console.log("entered initialize");
 		geocoder = new google.maps.Geocoder();
 		var latlng = new google.maps.LatLng(40.730885, -73.997383);
 	}

 	function codeLatLng(lat, lng) {
 		console.log("entered Codelatlng");
 		var latlng = new google.maps.LatLng(lat, lng);
 		geocoder.geocode({
 			'latLng' : latlng
 		}, function(results, status) {
 			if (status == google.maps.GeocoderStatus.OK) {
 				if (results[1]) {
 					
 					$('#current_location').text(results[2].formatted_address);
 				} else {
 					console.log('No results found');
 				}
 			} else {
 				console.log('Geocoder failed due to: ' + status);
 			}
 		});
 	}



	// api key from Forecast.io
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
		desired_unit = $.cookie('unit');

		if (desired_unit == 'celsius')
		{
		queryURL = baseURL + latitude + ',' + longitude + '?exclude=minutely,daily,alerts,flags&units=si';
		}
		else
		{
		queryURL = baseURL + latitude + ',' + longitude + '?exclude=minutely,daily,alerts,flags';

		}
		$.ajax({
			url : queryURL,
			dataType : "jsonp",
			success : function(data) {
				currtemp = data.hourly.data[0].temperature;
				hourlies = getHourlyData(currtemp,data);
				console.log(data);
					current = data.currently.temperature;
					
				if (desired_unit == 'celsius') {
					
					$("#current_feels_like").text('Feels like ' + current + '\u00B0 C');
					
				} else {
					
					$("#current_feels_like").text('Feels like ' + current + '\u00B0 F');
				
				}
				console.log(hourlies);
				linechart(hourlies);
				
			}
		});
		
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
