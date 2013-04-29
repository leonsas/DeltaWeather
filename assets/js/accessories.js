/*
 *
 */
var geocoder;
$(function() {
	function initialize() {
		geocoder = new google.maps.Geocoder();
		//var latlng = new google.maps.LatLng(40.730885, -73.997383);
	}

	function codeLatLng(lat, lng) {
		var latlng = new google.maps.LatLng(lat, lng);
		geocoder.geocode({
			'latLng' : latlng
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {					
					$('#current_location').text(results[2].formatted_address);
				} 
				else {
					console.log('No results found');
				}
			} 
			else {
				console.log('Geocoder failed due to: ' + status);
			}
		});
	}

	
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
		//googleURL = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true';

		//GET call that returns the geolookup info
		$.ajax({
			url : queryURL,
			dataType : "jsonp",
			success : function(data) {
				displayAccessories(data);
				
				var delta_string = document.getElementById('delta_string');
				var currentlyfeelhtml = document.getElementById("current_feels_like");

				var time = data.currently.time;
				
				var sunrise = data.daily.sunriseTime;

				var sunset = data.daily.sunsetTime;
				var check = 1;
				if (time < sunrise || time > sunset) {
					check = 0;
				}

				current = data.currently.temperature;
				if (desired_unit == 'celsius') {
					//current = data.current_observation.temp_c;
					$("#current_feels_like").text('Feels like ' + current + '\u00B0 C');
					//yesterday = data.history.dailysummary[0].meantempm;
				} else {
					//current = data.current_observation.temp_f;
					$("#current_feels_like").text('Feels like ' + current + '\u00B0 F');
					//yesterday = data.history.dailysummary[0].meantempi;
				}	
			}
		});

	};


	
	function displayAccessories(data) {
		console.log("displayaccesories");
		temp = data.currently.temperature;
		desired_unit = $.cookie('unit');
		if (desired_unit == "celsius"){
			temp = temp *1.8 + 32;
		}
		console.log(temp);

		precip = data.currently.precipIntensity;

		//for 1st icon

		if (precip > .01){
			changeAccessoryIcon("umbrella", 0);
		}
		else {
			changeAccessoryIcon("sunglasses", 0);
			document.getElementById("sunglasses_attribute").innerHTML="Sunglasses designed by Okan Benn from The Noun Project";
		}
		
		//for 2nd icon
		if (temp > 60){
			changeAccessoryIcon("Tshirt", 1);
		}
		else if (temp > 50){
			changeAccessoryIcon("LongSleeveShirt", 1);
			document.getElementById("long_sleeve_shirt_attribute").innerHTML="Shirt designed by Maurizio Fusillo from The Noun Project";
		}
		else if (temp > 40 ){
			changeAccessoryIcon("sweatshirt", 1);
			document.getElementById("jacket_attribute").innerHTML="Jacket designed by Toni Valdes Medina from The Noun Project";
		}		
		else {
			changeAccessoryIcon("jacket", 1);
		}


		//for 3rd icon
		if (temp > 70){
			changeAccessoryIcon("shorts", 2);
			document.getElementById("shorts_attribute").innerHTML="Shorts designed by iconoci from The Noun Project";
		}
		else {
			changeAccessoryIcon("pants", 2);
			document.getElementById("pants_attribute").innerHTML="Pants designed by Maurizio Fusillo from The Noun Project";
		}

		//for 4th icon
		if (temp > 70){
			changeAccessoryIcon("flipflops", 3);
		}
		else if (temp > 30){
			changeAccessoryIcon("sneaker", 3);
			document.getElementById("sneaker_attribute").innerHTML="Shoe designed by Linda Yuki Nakanishi from The Noun Project";
		}
		else {
			changeAccessoryIcon("snow_boots", 3);
			document.getElementById("snow_boots_attribute").innerHTML="Boots designed by Sebastian Langer from The Noun Project";
		}

	}

	function changeAccessoryIcon(clothingtop, position) {
		accpathway = "assets/img/Accessories/" + clothingtop + ".png"
		$(".accessory-icon").eq(position).attr("src", accpathway);

	}


	getGeoLocation();
});
