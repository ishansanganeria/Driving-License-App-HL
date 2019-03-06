
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	next_fs = $(this).parent().next();

	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

	//show the next fieldset
	next_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
        'transform': 'scale('+scale+')',
        'position': 'absolute'
      });
			next_fs.css({'left': left, 'opacity': opacity});
		},
		duration: 800,
		complete: function(){
			current_fs.hide();
			animating = false;
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();

	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

	//show the previous fieldset
	previous_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		},
		duration: 800,
		complete: function(){
			current_fs.hide();
			animating = false;
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".submit").click(function(){
	return false;
})




.div {
padding: 5px 10px;
}


webshim.setOptions('forms-ext', {
		replaceUI: 'auto',
		types: 'date',
		date: {
				startView: 2,
				inlinePicker: true,
				classes: 'hide-inputbtns'
		}
});
webshim.setOptions('forms', {
		lazyCustomMessages: true
});
//start polyfilling
webshim.polyfill('forms forms-ext');

//only last example using format display
$(function () {
		$('.format-date').each(function () {
				var $display = $('.date-display', this);
				$(this).on('change', function (e) {
						//webshim.format will automatically format date to according to webshim.activeLang or the browsers locale
						var localizedDate = webshim.format.date($.prop(e.target, 'value'));
						$display.html(localizedDate);
				});
		});
});
function agefinding()
		{
				var birthDay = document.getElementById("dob").value;
				var DOB = new Date(birthDay);
				var today = new Date();
				var age = today.getTime() - DOB.getTime();
				age = Math.floor(age / (1000 * 60 * 60 * 24 * 365.25));
				if(age<18)
				{
					document.getElementById("next").disabled = true;
				}
				document.getElementById("agecalculation").value=age;

				// alert(age);
				return age;
		}
