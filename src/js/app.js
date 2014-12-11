window.$ = window.$ || require('../../bower_components/jquery/dist/jquery.js');
window.jQuery = window.$;
require('../../bower_components/static-pjax/jquery.pjax.js');
window.progressJs = window.progressJs || require('../../bower_components/progress.js/src/progress.js').progressJs;

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

function transitAnimate(data, callback, isCached, url) {
  var $this = this;
  if (isCached) {
    $this.html(data);
    callback && callback.call($this, data, isCached);
  } else {
    // start animation
    $this.addClass('fade-up-out').removeClass('easing-upward');

    handleNavArrow(url);

    // ending animation
    setTimeout(function() {
      $this.html(data);
      $this.removeClass('fade-up-out').addClass('easing-upward');
      callback && callback.call($this, data, isCached);
    }, 450);
  }
}

$(function() {
  var containerSel = '.main-content';
  $.pjax({
    selector: '[pjax]',
    container: containerSel,
    show: transitAnimate,
    cache: false,
    storage: true,
    allowFullHtml: true,
    modifyData: function(data) {
      return $(data).find(containerSel).html();
    },
    callback: function() {}
  });

  $(containerSel).on('pjax.start', function(ev, xhr, pjax) {
    progressJs().start().autoIncrease(4, 300);
  });

  $(containerSel).on('pjax.end', function(ev, xhr, pjax) {
    progressJs().end();
  });
});
