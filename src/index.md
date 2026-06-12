---
title: Moderní Pavlov
description: Jsme sdružení nezávislých kandidátů pro obecní volby v roce 2026 v
    obci Pavlov na jižní Moravě.
---

# Sdružení nezávislých kandidátů Moderní Pavlov

Jsme sdružení nezávislých kandidátů pro obecní volby v roce 2026 v obci Pavlov
na jižní Moravě. Mezi naše priority patří zejména upravenost obce, bezpečnost
chodců a rodičů s kočárky, otevřenost a informovanost občanů o dění v obci a
hospodaření obecního úřadu, dobrá vyváženost naplňování potřeb místních občanů s
turistikou atd. Chceme, aby náš Pavlov byl mezi nejprogresivnějšími obcemi na
Mikulovsku.

Jsme otevřeni Vašim připomínkám a námětům. Pokud máte jakékoliv náměty a
připomínky, kontaktujte nás osobně, na e-mailu [pavel@krska.com](mailto:pavel@krska.com) nebo přes naši
[facebookovou stránku](https://www.facebook.com/modernipavlov).

## Novinky

{% from "newsItem.njk" import newsItem %}

<div class="news-list">
  {% for item in collections.news | slice(0, 2)  %}
    {{ newsItem(item) }}
  {% endfor %}
</div>

<a class="btn btn-outline-primary" href="/novinky/">Archiv novinek</a>
