var days = [null, {
		hotelArray: [],
		restaurantArray: [],
		activityArray: [],
		markers: [],
	}];

var currentDay = 1;
var numDays = 1;
var types = ['hotel', 'restaurant', 'activity'];
var today = days[currentDay];


var hotelLocations = [];
var restaurantLocations = [];
var activityLocations = [];

var locationCache = {};


var myLatlng, mapOptions, map_canvas_obj, map, markers;

$(document).ready(function(){

	initialize_gmaps();



	$('.add').on('click',function(){
		var dropdown = $(this).closest('div').find('select');
		var value = dropdown.val();
		var type = dropdown.attr('class');


		if (!(today[type+'Array'].some(function(a) {return a == value}))) {
			if (type == 'hotel' && today.hotelArray.length > 0) return;
			var html = '';
			html += '<li class="'+type+'Array'+'"><span>'+value+'</span>';
			html += '<button class="btn btn-xs btn-danger remove btn-circle pull-right">x</button></li>';
			$('#my-itinerary').find('.'+type).append(html);
			today[type+'Array'].push(value);

			var id = /\w+_(\d+)/.exec(dropdown.children(':selected').attr('id'))[1];
			var location;
			if (type == 'hotel') {
				location = all_hotels[id];
				hotelLocation = getLocation(location);
			}
			else if (type == 'restaurant') {
				location = all_restaurants[id];
				restaurantLocations.push(getLocation(location));
			}
			else if (type == 'activity') {
				location = all_activities[id];
				activityLocations.push(getLocation(location));
			}
			locationCache[value] = getLocation(location);
			updateMap();

		}
	});


	// remove itinerary items
	$('#my-itinerary').on('click', 'button', function(event) {
		var item = $(this).closest('li');
		var value = item.find('span').text();
		var type = item.attr('class');
		var typeArray = today[type];
		typeArray.splice(typeArray.indexOf(value), 1);



		item.remove();


		updateMap();
	});


	$('#add-day').on('click', function() {
		numDays++;
		$(this).before('<button class="btn btn-circle day-btn">'+numDays+'</button>');
		if (!days[numDays]) {
			days[numDays] = {
				hotelArray: [],
				restaurantArray: [],
				activityArray: [],
				markers: []
			};
		}
	})


	$('#remove-day').on('click', function() {
		days.splice(currentDay, 1);
		$('.day-buttons').children().last().prev().remove();
		numDays--;



		// automatically go to the new day that now has the number of the one
		// that was just removed
		// if the last day was removed, go to the new last day
		if (currentDay > numDays) currentDay = numDays;
		var newCurrentDay = $('button:contains("'+currentDay+'")');
		newCurrentDay.addClass('current-day');

		repopulate();

		updateMap();
	});


	$('.day-buttons').on('click', 'button', function() {
		if ($(this).text() == '+') return;
		currentDay = +$(this).text();
		$('.current-day').removeClass('current-day');
		$(this).addClass('current-day');

		repopulate();

		updateMap();
	})


	function repopulate() {
		today = days[currentDay];
		$('#day-title-text').text('Day '+currentDay);

		$('.list-group.hotel').empty();
		$('.list-group.restaurant').empty();
		$('.list-group.activity').empty();

		types.forEach(function(type) {
			if (today && today[type+'Array']) {
				today[type+'Array'].forEach(function(value) {
					var html = '';
					html += '<li class="'+type+'Array'+'">'+value;
					html += '<button class="btn btn-xs btn-danger remove btn-circle pull-right">x</button></li>';
					$('#my-itinerary').find('.'+type).append(html);
				})
			}
		});
	}

	function getLocation(thing) {
		return thing.place[0].location;
	}

	function updateMap() {
		deleteAllMarkers();

		today = days[currentDay];

		if (today.hotelArray.length) {
			var hotelLocation = locationCache[today.hotelArray[0]];
		  drawLocation(hotelLocation, {
		    icon: '/images/lodging_0star.png'
		  });
		}
		if (today.restaurantArray.length) {
		  today.restaurantArray.forEach(function (loc) {
		  	var restaurantLocation = locationCache[loc];
		    drawLocation(restaurantLocation, {
		      icon: '/images/restaurant.png'
		    });
		  });
		}
		if (today.activityArray.length) {
		  today.activityArray.forEach(function (loc) {
		  	var activityLocation = locationCache[loc];
		    drawLocation(activityLocation, {
		      icon: '/images/star-3.png'
		    });
		  });
		}

	}

	function deleteAllMarkers() {
		for (var i=1; i<days.length; i++) {
			days[i].markers.forEach(function(marker) {
				marker.setMap(null);
				marker = null;
			});
			days[i].markers = [];
		}
	}

	function drawLocation (location, opts) {
	  if (typeof opts !== 'object') {
	    opts = {}
	  }
	  opts.position = new google.maps.LatLng(location[0], location[1]);
	  opts.map = map;
	  var marker = new google.maps.Marker(opts);
	  days[currentDay].markers.push(marker);
	}






	function initialize_gmaps() {
	  // initialize new google maps LatLng object
	  myLatlng = new google.maps.LatLng(40.705189,-74.009209);
	  // set the map options hash
	  mapOptions = {
	    center: myLatlng,
	    zoom: 13,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    styles: styleArr
	  };
	  // get the maps div's HTML obj
	  map_canvas_obj = document.getElementById("map-canvas");
	  // initialize a new Google Map with the options
	  map = new google.maps.Map(map_canvas_obj, mapOptions);
	  // Add the marker to the map
	  // marker = new google.maps.Marker({
	  //   position: myLatlng,
	  //   title:"Hello World!"
	  // });
	

	}



	var styleArr = [{
	  featureType: "landscape",
	  stylers: [{
	    saturation: -100
	  }, {
	    lightness: 60
	  }]
	}, {
	  featureType: "road.local",
	  stylers: [{
	    saturation: -100
	  }, {
	    lightness: 40
	  }, {
	    visibility: "on"
	  }]
	}, {
	  featureType: "transit",
	  stylers: [{
	    saturation: -100
	  }, {
	    visibility: "simplified"
	  }]
	}, {
	  featureType: "administrative.province",
	  stylers: [{
	    visibility: "off"
	  }]
	}, {
	  featureType: "water",
	  stylers: [{
	    visibility: "on"
	  }, {
	    lightness: 30
	  }]
	}, {
	  featureType: "road.highway",
	  elementType: "geometry.fill",
	  stylers: [{
	    color: "#ef8c25"
	  }, {
	    lightness: 40
	  }]
	}, {
	  featureType: "road.highway",
	  elementType: "geometry.stroke",
	  stylers: [{
	    visibility: "off"
	  }]
	}, {
	  featureType: "poi.park",
	  elementType: "geometry.fill",
	  stylers: [{
	    color: "#b6c54c"
	  }, {
	    lightness: 40
	  }, {
	    saturation: -40
	  }]
	}];








	})