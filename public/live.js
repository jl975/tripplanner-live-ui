var days = [null, {
		hotelArray: [],
		restaurantArray: [],
		activityArray: []
	}];

var currentDay = 1;
var numDays = 1;
var types = ['hotel', 'restaurant', 'activity'];
var today = days[currentDay];


$(document).ready(function(){

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
		}
		//new google.maps.LatLngBounds.Builder(all)
	});


	// remove itinerary items
	$('#my-itinerary').on('click', 'button', function(event) {
		var item = $(this).closest('li');
		var value = item.find('span').text();
		var type = item.attr('class');
		var typeArray = today[type];
		typeArray.splice(typeArray.indexOf(value), 1);
		item.remove();
	});


	$('#add-day').on('click', function() {
		numDays++;
		$(this).before('<button class="btn btn-circle day-btn">'+numDays+'</button>');
		if (!days[numDays]) {
			days[numDays] = {
				hotelArray: [],
				restaurantArray: [],
				activityArray: []
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
	});


	$('.day-buttons').on('click', 'button', function() {
		if ($(this).text() == '+') return;
		currentDay = +$(this).text();
		$('.current-day').removeClass('current-day');
		$(this).addClass('current-day');

		repopulate();
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










})