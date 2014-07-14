---
layout: post
title:  "Rails 常见命令（待补充）"
date:   2014-07-10 15:29:30
tags: rails web development
category: rails
---

由于Rails写的不多，经常忘记其开发时所需的命令。
所以对Rails及其相关的一些常见命令做了整理，算是一份给自己看的cheat sheet吧。
望温故而知新。

<!--more-->

* toc
{:toc}

# Rails
{% highlight console %}
rails new sample_app [--skip-test-unit] [--database=postgresql]
rake db:[create|migrate|rollback] [VERSION=0] [RAILS_ENV=test]
rails generate controller StaticPages home help --no-test-framework
rails destroy  controller FooBars baz quux
rails generate model Foo bar:string baz:integer
rails destroy  model Foo
{% endhighlight %}

# Rspec
{% highlight console %}
  rails generate rspec:install
  rails generate integration_test static_pages
{% endhighlight %}

# Heroku
{% highlight console %}
  heroku login
  heroku create
  gem 'rails_12factor', group: :production
  heroku run rake db:migrate
  heroku logs
{% endhighlight %}