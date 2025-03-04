---
layout: home
title: Home
id: home
permalink: /
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<header style="border-bottom: 1px solid #eee; padding-bottom: 1em; margin-bottom: 2em;">
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 1em;">
    <h1 style="margin: 0; flex-grow: 1; min-width: 0; font-size: clamp(1rem, 5vw, 2rem); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
      {{ site.title }}
    </h1>
    <div style="display: flex; gap: 1em; flex-shrink: 0;">
      <a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
        <i class="fab fa-github fa-lg"></i>
      </a>
      <a href="https://x.com/{{ site.x_username }}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
        <i class="fab fa-x-twitter fa-lg"></i>
      </a>
    </div>
  </div>
</header>

{% assign latest_note = site.notes | sort: "created_at" | reverse | first %}
<div class="latest-update">
  <h2 style="margin-top: 0;">Latest Update</h2>
  <p style="color: #666;">Added: {{ latest_note.created_at | date: "%B %-d, %Y" }}</p>
  <h3><a class="internal-link" href="{{ site.baseurl }}{{ latest_note.url }}">{{ latest_note.title }}</a></h3>

  {% if latest_note.content contains '<img' %}
    {% assign images = latest_note.content | split: '<img ' %}
    {% assign first_image = images[1] | split: '>' | first %}
    {% if first_image contains 'src="' %}
      {% assign image_src = first_image | split: 'src="' | last | split: '"' | first %}
      <img src="{{ image_src }}" alt="Image from {{ latest_note.title }}" style="max-width: 100%; height: auto; border-radius: 4px; margin: 1em 0;">
    {% endif %}
  {% endif %}
  
  {% if latest_note.excerpt %}
    <p>{{ latest_note.excerpt | strip_html | truncate: 200 }}</p>
  {% endif %}
</div>

<strong>Recently updated pages</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "created_at" | reverse %}
  {% for note in recent_notes limit: 5 %}
    <li class="recent-pages">
      {{ note.last_modified_at | date: "%b %-d, %Y" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
      {% if note.content contains '<img' %}
        {% assign images = note.content | split: '<img ' %}
        {% assign first_image = images[1] | split: '>' | first %}
        {% if first_image contains 'src="' %}
          {% assign image_src = first_image | split: 'src="' | last | split: '"' | first %}
          <img src="{{ image_src }}" alt="Image from {{ note.title }}" style="max-width: 30%; height: auto; border-radius: 4px; margin: 1em 0;">
        {% endif %}
      {% endif %}
      <p>{{ note.excerpt | strip_html | truncate: 200 }}</p>
    </li>
  {% endfor %}
</ul>

<strong>All pages</strong>

<ul>
  {% assign notes_by_creation = site.notes | sort: "created_at" | reverse %}
  {% for note in notes_by_creation %}
    <li>
      {{ note.created_at | date: "%b %-d, %Y" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>

<style>
  .wrapper {
    max-width: 46em;
  }
</style>
