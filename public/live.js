$(document).ready(function(){

	var days = {
		'1': {
			hotelArray: [],
			restaurantArray: [],
			activityArray: []
		},
	};

	var types = ['hotel', 'restaurant', 'activity'];

	var currentDay = '1';
	var numDays = 1;

	var today = days[currentDay];

	$('.add').on('click',function(){
		var dropdown = $(this).closest('div').find('select');
		var value = dropdown.val();
		var type = dropdown.attr('class');


		if (!(today[type+'Array'].some(function(a) {return a == value}))) {
			if (type == 'hotel' && today.hotelArray.length > 0) return;
			var html = '';
			html += '<li class="'+type+'Array'+'">'+value;
			html += '<button class="btn btn-xs btn-danger remove btn-circle pull-right">x</button></li>';
			$('#my-itinerary').find('.'+type).append(html);
			today[type+'Array'].push(value);
		}
		new google.maps.LatLngBounds.Builder(all)

		console.log(days);
	});

	// remove
	$('#my-itinerary').on('click', 'button', function(event) {
		var item = $(this).closest('li');
		var value = item.text();
		var type = item.attr('class');
		var typeArray = today[type];
		typeArray.splice(typeArray.indexOf(value), 1);
		item.remove();
	});

	$('#add-day').on('click', function() {
		numDays++;
		$(this).before('<button class="btn btn-circle day-btn">'+numDays+'</button>');
		if (!days[String(numDays)]) {
			days[String(numDays)] = {
				hotelArray: [],
				restaurantArray: [],
				activityArray: []
			};
		}
	})

	$('.day-buttons').on('click', 'button', function() {
		if ($(this).text() == '+') return;
		currentDay = $(this).text();
		$('.current-day').removeClass('current-day');
		$(this).addClass('current-day');

		today = days[currentDay];

		console.log(currentDay, today);
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



	})










})