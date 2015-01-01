var harp = require('harp'),
    path = require('path'),
    highlight = require('./highlight');

var projectPath = path.join(__dirname, '..');

harp.server(projectPath, { port: process.env.PORT || 9000 });