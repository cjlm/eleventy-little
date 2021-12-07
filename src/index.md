---
layout: base.njk
---

# all eleventy-little presentations

{% for presentation in collections.presentations %}

- [{{ presentation.data.page.fileSlug }}]({{ presentation.url }}) ([print]({{ presentation.url }}print.html))

{% endfor %}
