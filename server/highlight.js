var marked = require('../node_modules/harp/node_modules/terraform/node_modules/marked');
var highlight = require('highlight.js');

marked.setOptions({
  langPrefix: '',
  breaks: true,
  highlight: function (code, language) {
    if (language) {
      return highlight.highlight(language, code).value;
    }

    return code;
  }
});