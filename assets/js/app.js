/**
 * App.js
 */
define(['jquery', 'foundation'], function($){
	var init = function(){
		$(document).foundation();
		$('.alert-box').show().css({'position': 'absolute', 'margin': '20% 35%', 'padding': '1% 10%', 'top': '60px'}).animate({'top':'20px'});
		// alert('init success!');
	};
	return {
		init : init
	};

});