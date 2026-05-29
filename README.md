# Stránky pro SNK Moderní Pavlov

## Vývoj

Web je vytvořen pomocí nástroje [Eleventy (11ty)](https://www.11ty.dev/). Obsah
je možné psát ve více formátech, preferovaným je ale Markdown (`.md`), který je
následně zpracován do podoby HTML.

Jednotlivé dokumenty jsou následně dle konfigurací obaleny do layoutu a případně
jsou k nim naimportovány další komponenty. Layouty jsou ve formátu `.html`,
které je ale před exportem zprocesován jako [Liquid
template](https://www.11ty.dev/docs/languages/liquid/), viz
[dokumentaci](https://www.11ty.dev/docs/languages/html/). Díky tomu je možné
templaty mezi sebou importovat a používat další funkce jako if, loop atd.
