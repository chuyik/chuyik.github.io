function isDesktopView () {
  return $('.main').css('position') === 'absolute';
}

$(function() {
  var $scrollEl, $animateEl;
  // var hideEls = $('.leftbar > :not(.nav), .nav > :not(.nav-arrow), .avatar > .sides');

  function setScrollEl () {
    if(isDesktopView()){
      $scrollEl = $animateEl = $('.main');
    }else{
      $scrollEl = $(window);
      $animateEl = $('body');
    }
  }

  function initBackToTop () {
    var $btn = $('.back-to-top');

    $scrollEl.scroll(function(){
      ( $(this).scrollTop() > 300 ) ? $btn.addClass('fadeout') : $btn.removeClass('fadeout');
    });

    $btn.off('click').on('click', function(){
      // change hash without browser jumping
      // var scrollV = $animateEl.scrollTop();
      window.location.hash = '';
      $animateEl.scrollTop(0);

      $('.main').attr('style', '');
      $('.leftbar').off('mouseover mouseout click');

      // $animateEl.animate(
      //   { scrollTop: 0 },
      //   700,
      //   function() {
      //     // fix scroll won't work after scroll animation
      //     $animateEl.scrollTop($animateEl.scrollTop());
      //   }
      // );
    });
  }

  // var hideEls = $('.leftbar');
  var clickV;
  function scrollHide () {
    if(!isDesktopView()){
      $('.back-to-top').attr('style', '');
      return;
    }
    $scrollEl.scroll(function(){
      if(!/articles/.test(location.href)){
        return;
      }
      setTimeout(function() {
        if($scrollEl.scrollTop() > 300){
          if(clickV){
            if(Math.abs(clickV - $scrollEl.scrollTop()) < 100){
              return;
            }else{
              clickV = 0;
            }
          }
          $('.main').css({'width': '99%', 'left': '1%', 'z-index': 1});
          $('.main-content').css({'max-width': '900px', 'margin': '0 auto'});
          $('.back-to-top').css({'left': 0, 'border-radius': '0 10px 10px 0', 'z-index': 2});
          $('.leftbar').off('mouseover').on('mouseover', function() {
            if(!clickV){
              $('.main').css({'width': '95%', 'left': '5%'});
              $(this).css('cursor','pointer');
            }
          }).off('mouseout').on('mouseout', function() {
            if(!clickV){
              $('.main').css({'width': '99%', 'left': '1%'});
            }
          }).off('click').on('click', function() {
            $('.main, .main-content, .back-to-top').attr('style', '');
            $(this).attr('style', '');
            clickV = $scrollEl.scrollTop();
            console.log('clicked');
          });
        }else{
          $('.main, .main-content, .back-to-top').attr('style', '');
          $('.leftbar').off('mouseover mouseout click');
        }
      }, 200);
    });

    // hideEls.on('mouseover', function() {
    //   hideEls.css('opacity', 1);
    // });

    // hideEls.on('mouseout', function() {
    //   hideEls.css('opacity', 0.01);
    // });

    // var oldScrollV = $scrollEl.scrollTop();
    // $scrollEl.scroll(function(){
    //   setTimeout(function() {
    //     var curScrollV = $scrollEl.scrollTop();
    //     if(curScrollV > 300 && curScrollV > oldScrollV){
    //       $('.main').css({width: '100%', 'left': 0, 'z-index': 1});
    //       oldScrollV = curScrollV;
    //     }else{
    //       if((oldScrollV - curScrollV) > 200){
    //         $('.main').attr('style', '');
    //         oldScrollV = curScrollV;
    //       }
    //     }
    //   }, 200);
    // });
  }

  function initAnchorLinks () {
    var $el = $('.main');
    $el.off('click').on('click', 'a[href^="#section"]', function(ev) {
      ev.preventDefault();

      var elmId = $(this).attr('href');

      // change hash without browser jumping
      // var scrollV = $scrollEl.scrollTop();
      window.location.hash = elmId.substr(1);
      // $animateEl.scrollTop(scrollV);

      // $animateEl.animate(
      //   { scrollTop: $(elmId).offset().top },
      //   700,
      //   function() {
      //     $el.animate(
      //       { scrollTop: $el.scrollTop() - 20 }
      //     );
      //   });
    });
  }

  function init() {
    setScrollEl();
    initBackToTop();
    initAnchorLinks();
    scrollHide();
  }

  $(window).resize(function() {
    $scrollEl.unbind('scroll');
    init();
  });

  init();
});