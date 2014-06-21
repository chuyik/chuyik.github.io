source 'http://rubygems.org'

gem 'jekyll'
gem 'sass'
gem 'compass'
gem 'kramdown'
gem 'guard', '>= 1.8.0'

group :development  do
  gem 'guard-jekyll-plus', git: 'https://github.com/imathis/guard-jekyll-plus', branch: 'master'
  gem 'rb-fsevent'
end

require 'rbconfig'
if RbConfig::CONFIG['target_os'] =~ /mswin|mingw|cygwin/i
  gem 'wdm', '>= 0.1.0'
end