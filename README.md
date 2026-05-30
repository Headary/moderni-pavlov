# Stránky pro SNK Moderní Pavlov

## Vývoj

Web je vytvořen pomocí nástroje [Eleventy (11ty)](https://www.11ty.dev/). Obsah
je možné psát ve více formátech, preferovaným je ale Markdown (`.md`), který je
následně zpracován do podoby HTML.

Jednotlivé dokumenty jsou následně dle konfigurací obaleny do layoutu a případně
jsou k nim naimportovány další komponenty. Layouty jsou ve formátu `.njk`,
([Nunjucks](https://mozilla.github.io/nunjucks/)), který umožňuje templaty mezi
sebou importovat, definovat a redefinovat bloky a používat další funkce jako if,
loop atd.
