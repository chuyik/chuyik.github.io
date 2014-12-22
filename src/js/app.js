window.jQuery = window.$ = require('../../bower_components/jquery/dist/jquery.js');
window.nprogress = require('../../bower_components/nprogress/nprogress.js');
require('../../bower_components/static-pjax/jquery.pjax.js');

function handleNavArrow(url) {
  if ($(window).width() < 767) {
    return;
  }
  var li = $('.nav').find('[href="' + url + '"]').parent();
  if (!li.length) {
    return;
  }

  var $arrow = $('div.nav-arrow');
  var oriHeight, destHeight;
  var init = !$arrow.length;
  if (init) {
    $arrow = $('li.nav-arrow');
    if (!$arrow.length) {
      $arrow = $('li:eq(0)');
    }
    oriHeight = $arrow.height() / 2 + $arrow.position().top;
    $arrow.removeClass('nav-arrow');

    // add div.nav-arrow after .nav
    $arrow = $('<div class="nav-arrow" style="position: absolute;right: 0;">');
    $('.nav').after($arrow);
  } else {
    oriHeight = $arrow.position();
  }

  $arrow.css('top', oriHeight);
  setTimeout(function() {
    if (li.length) {
      destHeight = li.height() / 2 + li.position().top;
      $arrow.css('top', destHeight);
    }
  }, init ? 300 : 0);
}

function transitAnimate(data, callback, isCached, pjax) {
  var $this = this;
  if (isCached) {
    $this.html(data);
    callback && callback.call($this, data, isCached);
  } else {
    // start animation
    $this.addClass('fade-up-out');
    handleNavArrow(pjax.options.url);

    // ending animation
    setTimeout(function() {
      $this.html(data);
      $this.removeClass('fade-up-out');
      callback && callback.call($this, data, isCached);
    }, 450);
  }
}

function handleAnalytics() {
  var href = window.location.href;
  // disable local
  if(/\/\/localhost/.test(window.location.href)){
    return;
  }
  // prevent duplication
  if(href !== window.oldHref){
    window.oldHref = href;
    // google analytics
    if(ga){
      ga('set', 'location', window.location.href);
      ga('send', 'pageview');
    }
    // baidu
    var bdhm = $('#bdhm').text();
    if(bdhm){
      $('#bdhm, #bdhm_js').remove();
      $('head').append($('<script id="bdhm"/>').text(bdhm));
    }
  }
}

$(function() {
  // init pjax link
  function initPjax(selector, container){
    $.pjax({
      selector: selector,
      container: container,
      show: transitAnimate,
      cache: false,
      storage: true,
      html: true,
      modifyData: function(data) {
        return $(data).find(this.container).html();
      }
    });

    $(container).on('pjax.start', function(ev, xhr, pjax) {
      window.nprogress.start();
    });

    $(container).on('pjax.end', function(ev, xhr, pjax) {
      window.jsbinified= undefined;
      handleAnalytics();
      window.nprogress.done();
    });
  }

  initPjax('[pjax]', '.main-content');
  initPjax('[pjax-page]', '.article-content');

  // init go back button
  $(document).on('click', '[goback]', function() {
    window.history.back();
    return false;
  });
});
