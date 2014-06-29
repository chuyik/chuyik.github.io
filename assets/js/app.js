/**
 * App.js
 */
define(['jquery', 'foundation', 'foundation-plugin/foundation.magellan'], function($){
	var initIndex = function(){
		// $(document).foundation();
		// $('.alert-box').show().css({'position': 'absolute', 'margin': '20% 35%', 'padding': '1% 10%', 'top': '60px'}).animate({'top':'20px'});
		// $('.posts>li').click(function(){
		// 	window.location.href = $(this).find('.post-link').attr('href');
		// });

	};

	var initPost = function(){
	    // 创建导航
	    var sections = $('h1[id^="section"]');
	    if(sections.length > 0){
		    // <dd data-magellan-arrival="arrival"><a href="#arrival">前端学习</a></dd>
		    var navi = $('<div> <div class="magellan-container" data-magellan-expedition="fixed"> <dl class="sub-nav"> <dd data-magellan-arrival="nav" class="nav-label"><a href="#nav">NAVI</a></dd> </dl> </div></div>');
	    	$.each(sections, function(){
	    		navi.find('dl').append($('<dd data-magellan-arrival="'+$(this).attr('id')+'"><a href="#'+$(this).attr('id')+'">'+$(this).text()+'</a></dd>'));
	    	});
	    	$('.post-content').prepend(navi); 
			$(document).foundation().foundation('joyride', 'start');
	    }
	    $('.site-title').hover(function(){
	    	$('.back-label').css('display', 'inline');
	    }, function(){
	    	$('.back-label').css('display', 'none');
	    });
	}
	return {
		initIndex : initIndex,
		initPost : initPost
	};

});