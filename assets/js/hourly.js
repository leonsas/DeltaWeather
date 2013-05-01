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
		initialize();
		codeLatLng(latitude, longitude);
		
		desired_unit = $.cookie('unit');

		if (desired_unit == 'celsius')
		{
		queryURL = baseURL + latitude + ',' + longitude + '?exclude=minutely,alerts,flags&units=si';
		}
		else
		{
		queryURL = baseURL + latitude + ',' + longitude + '?exclude=minutely,alerts,flags';
		}
		$.ajax({
			url : queryURL,
			dataType : "jsonp",
			success : function(data) {
				currtemp = Math.round(data.hourly.data[0].temperature);
				yesterdayTime = data.currently.time - 86400;
				if (desired_unit == 'celsius') {
					$("#current_feels_like").text('Feels like ' + currtemp + '\u00B0 C');
					yesterdayURL = baseURL + latitude + ',' + longitude + ',' + yesterdayTime + '?exclude=minutely,currently,daily,alerts,flags&units=si';
					overlapURL = baseURL + latitude + ',' + longitude + ',' + data.currently.time + '?exclude=minutely,currently,daily,alerts,flags&units=si';
				} else {
					$("#current_feels_like").text('Feels like ' + currtemp + '\u00B0 F');
					yesterdayURL = baseURL + latitude + ',' + longitude + ',' + yesterdayTime + '?exclude=minutely,currently,daily,alerts,flags';
					overlapURL = baseURL + latitude + ',' + longitude + ',' + data.currently.time + '?exclude=minutely,currently,daily,alerts,flags';
				}
				$.ajax({
					url : yesterdayURL,
					dataType : "jsonp",
					success : function(data2) {
						reftime = data.hourly.data[0].time - 86400;
						index = 0;
						while (reftime != data2.hourly.data[index].time)
						{
						index++;
						}
						if (index + 11 > 23)
						{
						$.ajax({
							url : overlapURL,
							dataType : "jsonp",
							success : function(data3) {
								hourlies = getHourlyData(data,data2,data3,index,1);
								linechart(hourlies);
							}
						});
						}
						else
						{
							hourlies = getHourlyData(data,data2,undefined,index,0);
							linechart(hourlies);
						}
					}
				});
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
		var lineChartData = {
			labels : [input[0].hour,input[1].hour,input[2].hour,input[3].hour,input[4].hour,input[5].hour,input[6].hour,input[7].hour,input[8].hour,input[9].hour,input[10].hour,input[11].hour],
			datasets : [{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				data : [input[0].yesterdaytemp,input[1].yesterdaytemp,input[2].yesterdaytemp,input[3].yesterdaytemp,input[4].yesterdaytemp,input[5].yesterdaytemp,input[6].yesterdaytemp,input[7].yesterdaytemp,input[8].yesterdaytemp,input[9].yesterdaytemp,input[10].yesterdaytemp,input[11].yesterdaytemp]
			},
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				data : [input[0].todaytemp,input[1].todaytemp,input[2].todaytemp,input[3].todaytemp,input[4].todaytemp,input[5].todaytemp,input[6].todaytemp,input[7].todaytemp,input[8].todaytemp,input[9].todaytemp,input[10].todaytemp,input[11].todaytemp]
			}]
		}

		var myLine = $("#delta").get(0).getContext("2d");
		var myNewChart = new Chart(myLine).Bar(lineChartData, {
			scaleShowGridLines : false,
			scaleStartValue : 0,
			scaleOverride : 0,
			scaleShowLabels : true,
		});
	}

	function getHourlyData(data, data2, data3, index, overlap) {
		hourlies = [];
		if (overlap == 0)
		{
			for ( i = 1; i < 13; i++) {
			todaytime = new Date(data.hourly.data[i].time * 1000);
			yesterdaytime = new Date(data2.hourly.data[index + i - 1].time * 1000);
			hour_string = todaytime.toLocaleTimeString();
			today = Math.round(data.hourly.data[i].temperature);
			yesterday = Math.round(data2.hourly.data[index + i - 1].temperature);
			hourlies.push({
				hour : hour_string,
				todaytemp : today,
				yesterdaytemp : yesterday
			});
			}
		}
		else
		{
			for ( i = 1; i < 13; i++) {
				todaytime = new Date(data.hourly.data[i].time * 1000);
				if (index + i - 1 <= 23)
				{
					yesterday = Math.round(data2.hourly.data[index + i - 1].temperature);
					yesterdaytime = data2.hourly.data[index + i - 1].time;
				}
				else
					{
						newindex = (index + i - 1) - 24;
						yesterday = Math.round(data3.hourly.data[newindex].temperature);
						yesterdaytime = data3.hourly.data[newindex].time;
					}
					hour_string = todaytime.toLocaleTimeString();
					today = Math.round(data.hourly.data[i].temperature);
					hourlies.push({
						hour : hour_string,
						todaytemp : today,
						yesterdaytemp : yesterday
						});
				}
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
