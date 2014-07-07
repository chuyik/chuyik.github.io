---
layout: post
title:  "Capybara2.4与RSpec-Rails3.0的冲突"
date:   2014-07-06 21:30:50
categories: rails web development
---

今天跟着Rails Tutorial，用最新版的Capybara和RSpec搭建测试框架时，出现了一些问题。

<!--more-->

## 相关版本
* Rails: 4.1.1
* Capybara: 2.4.1
* RSpec-Rails: 3.0.1

## 问题描述

在跟着[Rails Tutorial][1]搭建好框架后，运行后报错：

```
  uninitialized constant Capybara (NameError)
```

然后我就纳闷了，记得之前学的时候，并没出现这问题。 在查了Capybara的[文档][2]之后，才发现还要在`spec_helper.rb`加上`require 'capybara/rspec'`。

好吧，加就加吧，结果依然报错：

```
  warning: loading in progress, circular require considered harmful
```

没办法，只好再请教Google，在StackOverFlow上看到了个[答案][3]，情况恰好和我一样。
因此我尝试修改了下`.rspec`：

```
--warnings
--require spec_helper
--require rails_helper
```

旧的错误没了，又来了个新的：

```
  undefined method `visit' for #<RSpec::ExampleGroups::StaticPages::HomePage:0x5beedd8>
```

我又对Capybara的[文档][2]端详了一番，才知道原来`requests`这个文件夹名不能用了，要换成`features`。
换就换吧，还真没报错了。

## 原因？
在看完一篇题为[<rspec-rails and capybara 2.0: what you need to know>][4]的文章后，才知道究其原因，是因为Capybara 1.x与Rails自身的测试框架的函数名很容易搞晕新手。
比如Capybara中叫`visit`，而Rails的Testcase中叫`get`，新手可能会写测试代码的时候，一不小心写了visit，又再一个不小心写了get，这样就很容易乱了。
所以RSpec和Capybara决定联手另起炉灶，`spec/requests`中的测试代码不再支持Capybara的函数。
想要用visit方法？可以，但请在`spec/features`里写。


[1]: http://railstutorial-china.org/chapter3.html#section-3-2
[2]: http://rubydoc.info/github/jnicklas/capybara#Using_Capybara_with_RSpec
[3]: http://stackoverflow.com/questions/24011737/unable-to-setup-capybara-in-rails
[4]: http://www.andylindeman.com/2012/11/11/rspec-rails-and-capybara-2.0-what-you-need-to-know.html