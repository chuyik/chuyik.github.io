var harp = require('harp'),
    path = require('path'),
    highlight = require('./highlight');

var projectPath = path.join(__dirname, '..'),
    outputPath  = 'www';

harp.compile(projectPath, outputPath, function(errors, output){
  if(errors) {
    console.log(JSON.stringify(errors, null, 2));
    process.exit(1);
  }
});