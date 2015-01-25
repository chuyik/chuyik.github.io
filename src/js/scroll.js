function isDesktopView () {
  return $('.main').css('position') === 'absolute';
}

$(function() {
  var $scrollEl, $animateEl;

  function setScrollEl () {
    if(isDesktopView()){
      $scrollEl = $animateEl = $('.main');
    }else{
      $scrollEl = $(window);
      $animateEl = $('body');
    }
  }

  function scrollUnhide () {
    $('.main, .main-content, .footer-float-btn').attr('style', '');
    $('.leftbar').off('mouseover mouseout click');
  }

  var clickV;
  function scrollHide () {
    if(!isDesktopView()){
      $('.footer-float-btn').attr('style', '');
      return;
    }
    $scrollEl.scroll(function(){
      if(!/articles/.test(location.href)){
        return;
      }
      setTimeout(function() {
        if($scrollEl.scrollTop() > 300){
          if(clickV){
            if(Math.abs(clickV - $scrollEl.scrollTop()) < 200){
              return;
            }else{
              clickV = 0;
            }
          }
          $('.main').css({'width': '99%', 'left': '1%', 'z-index': 1});
          $('.main-content').css({'max-width': '900px', 'margin': '0 auto'});
          $('.footer-float-btn').css({'left': 0, 'border-radius': '0 10px 10px 0', 'z-index': 2});
          $('.leftbar').off('mouseover').on('mouseover', function() {
            if(!clickV){
              $('.main').css({'width': '92%', 'left': '8%'});
              $(this).css('cursor','pointer');
            }
          }).off('mouseout').on('mouseout', function() {
            if(!clickV){
              $('.main').css({'width': '99%', 'left': '1%'});
            }
          }).off('click').on('click', function() {
            $('.main, .main-content, .footer-float-btn').attr('style', '');
            $(this).attr('style', '');
            clickV = $scrollEl.scrollTop();
          });
        }else{
          scrollUnhide();
        }
      }, 200);
    });
  }

  function initBackToTop () {
    var $btn = $('.back-to-top');

    $scrollEl.scroll(function(){
      if ( $(this).scrollTop() > 300 ) {
        $btn.addClass('fadeout');
      } else {
        $btn.removeClass('fadeout');
      }
    });

    $btn.off('click').on('click', function(){
      // change hash without browser jumping
      window.location.hash = '';
      $animateEl.scrollTop(0);

      scrollUnhide();
    });
  }

  function initNavToggle () {
    var $btn = $('.navbar-toggle');

    $scrollEl.scroll(function(){
      if ( $(this).scrollTop() > 300 ) {
        $btn.addClass('fadeout');
      } else {
        $btn.removeClass('fadeout');
      }
    });

    var $menu = $('.toc').clone().attr('id', 'nav-menu').appendTo(".main-content").addClass('fixed').addClass('hideout');

    var isOn = false;
    // show menu
    $btn.add($menu).off('mouseover click').on('mouseover click', function(ev){
      if(ev.delegateTarget === $btn[0]){
        isOn = true;
      }
      $menu.removeClass('hideout');
    });
    // hide menu
    $btn.add($menu).off('mouseout').on('mouseout', function(){
      $menu.addClass('hideout');
    });
  }

  function initAnchorLinks () {
    var $el = $('.main');
    $el.off('click').on('click', 'a[href^="#section"]', function(ev) {
      ev.preventDefault();

      var elmId = $(this).attr('href');

      window.location.hash = elmId.substr(1);
    });
  }

  function init() {
    setScrollEl();
    initBackToTop();
    // initNavToggle();
    initAnchorLinks();
    scrollHide();
  }

  $(window).resize(function() {
    $scrollEl.unbind('scroll');
    init();
  });

  // $(window).
  $( window ).on('popstate', function() {
    scrollUnhide();
  });

  init();
});