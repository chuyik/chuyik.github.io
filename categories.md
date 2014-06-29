---
layout: page
title: Categories
permalink: /categories/
---

<div class="categories">
	{% for category in site.categories %}
	    <li>
	    	<a href="/categories/{{ category | first }}/" title="view all posts of {{ category | first }}">
		    	{{ category | first }}
		    	<span class="radius secondary label">{{ category | last | size }}</span>
	    	</a>
	    </li>
	    <ul class="arc-list">
	    {% for post in category.last %}
		        <li>
		        	<a href="{{ post.url }}">{{ post.title }}</a>
		        	<span class="arc-date">{{ post.date | date:"%b %-d, %Y"}}</span>
		        </li>
		    {% endfor %}
		</ul>
	{% endfor %}
</div>