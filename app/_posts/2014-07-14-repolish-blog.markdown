---
layout: post
title:  "重新装修博客"
date:   2014-07-14 23:58:30
tags: web
category: blog
---

经过近两三天的努力，终于把我的这个半个月前才建的博客重新装修了一遍。   
还加上了多标签，emoji和评论功能。   
博客使用Jekyll插件和纯CSS来展示页面，整体很满意。

<!--more-->

* toc
{:toc}

# 目的
半个月前，我建了这个博客。半个月后，我开始不满意了：

1. 博客塞满了JS，有jQuery、Foundation、Modernizr、RequireJS。。。感觉很重
2. 颜色风格不够统一，看上去虽然酷，但暗色调看久了会觉得累
3. 文件存放的结构不好

# 过程总结
对于以上种种，我决定重新装修这个博客。   
这次Google到了一个叫[generator-jekyllrb](https://github.com/robwierzbowski/generator-jekyllrb)的Jekyll结构生成器。   
换结构后，我再一次深深地感觉到，还是别人写的东西好使。

博客换成了纯CSS，没有JS（当然Disqus和Google Analysis除外啦）。   
色调满意，特效够用，页面切换顺畅。   
兼容性良好（前端你懂的:smirk:）。   
重要的是，收获了更多的CSS技巧。

由于想突出纯CSS，并没有集成全文搜索。或者可以考虑Google自定义搜索？   
