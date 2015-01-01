# Source code of my blog
> <a href="http://edwardchu.org" target="_blank">edwardchu.org</a>


## What's used

- harp
- bower
- uglify
- watchify
- browsersync


## The pros
- Edit files with any syntax you want `(less, ejs, md, coffee, less, sass...)`
- Autoreload and prefix css with file changes
- Fast don't lie, goodbye to gruntfile


## Clone this blog
    git clone -b harp https://github.com/chuyik/chuyik.github.io
    npm install -g browser-sync watchify uglify bower harp
    bower install


## Auto reload when files modified
    npm run watch

## Build static HTML and upload
    npm run publish

## Want to use harp as a lib?
Harp could be used as a node module for enhancements and customization, but you need to install it via `npm install`, and run `npm run serve` instead of `npm run watch`.