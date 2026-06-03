# Stránky pro SNK Moderní Pavlov

Web je vytvořen pomocí nástroje [Eleventy (11ty)](https://www.11ty.dev/). Obsah
je možné psát ve více formátech, preferovaným je ale Markdown (`.md`), který je
následně zpracován do podoby HTML.

Jednotlivé dokumenty jsou následně dle konfigurací obaleny do layoutu a případně
jsou k nim naimportovány další komponenty. Layouty jsou ve formátu `.njk`,
([Nunjucks](https://mozilla.github.io/nunjucks/)), který umožňuje templaty mezi
sebou importovat, definovat a redefinovat bloky a používat další funkce jako if,
loop atd.

Aby bylo možné stránky hostovat i na doménách se subpaths, tak existuje ENV
proměnná `ELEVENTY_PATH_PREFIX`, která určuje na kterou subpath mají odkazy
směřovat.

## Úprava stránek

Zdrojový kód stránek se nachází ve složce `src`. V ní různé soubory a různé
podsložky mají různé funkce.

Až na výjimky (viz níže) odpovídá každý `.njk` a `.md` soubor jedné výsledné
stránce. Název a cesta souboru odpovídá výsledné URL cestě stránky. Např.
`o-nas.md` se bude nacházet na `/o-nas/`, `novinky/123.md` bude na
`/novinky/123/` atd. Soubory se jménem `index.*` jsou hlavními stránkami dané
složky. Soubory `src/index.md` tedy popisuje hlavní stránku na URL `/` a
`src/program/index.njk` bude na `/program/`.

Každé stránce lze definovat datové atributy v úvodní sekci ohraničené třemi
spojovníky (`---`). Je možné používat hodnoty uvedeny v
[dokumentaci](https://www.11ty.dev/docs/data-configuration/) nebo i vlastní
hodnoty (např. `title`, `description`, `image`), které se pak použijí někde v
šablonách. Důležitými jsou hlavně:

- `title` -- Titulek, který se zobrazí nahoře v prohlížeči v kartě dané stránky.
- `description` -- Popisek stránky, významné pro SEO a vyhledávání.
- `date` -- Datum v ISO formátu (`YYYY-MM-DD` -- rok-měsíc-den), uvádí se u
  novinek, které se podle toho řadí.

Pro vytvoření stránky je tedy potřeba:

- vytvořit soubor na správném místě a se správným pojmenováním (např. pro
  novinku na url `/novinky/novy-volebni-program/` se vytvoří soubor
  `src/novinky/novy-volebni-program.md`),
- přidat sekce s daty (typicky stačí vykopírovat z okolních souborů, obecně
  bude obsahovat pouze `title` a případně `date`),
- vytvořit samotný obsah.

Při upravování stačí soubor znovu otevřít a sepsat změny.

### Speciální složky

- `_data` -- Složka s datovými soubory ve formátu JSON. K datům, které jsou tu
  definové, lze následně přistupovat v šablonách a vykreslovat pomocí nich
  obsah, např. jak `src/_data/candidates.json` jsou vykresleny v
  `src/kandidati.njk`. Z této složky se samotné stránky nevytváří. Viz
  [dokumentaci](https://www.11ty.dev/docs/data-global/).
- `_includes` -- Složka pro šablony a komponenty, které lze do stránek vložit.
  Definuje např. základní šablonu `base.njk`, šablonu pro úvodní stránku
  `home.njk` nebo šablony `page.njk` a `article.njk` pro obyčejnou stránku a
  pro článek/novinku. Z této složky se samotné stránky nevytváří.
- `assets` -- Složka pro soubory a obrázky. Cokoliv, co se do ní vloží, se prostě
  zkopíruje do výsledného webu do cesty `/assets/`.
- `css` -- Složka pro styly. Neměly by se v ní vyskytovat samotné stránky.

### Speciální soubory

- `.json` mimo data -- Tyto soubory definují dodatečná data. Pokud se jmenují
  stejně jako složka, ve které jsou (`src.json`, `novinky.json`), tak
  přidávají výchozí data ke stránkám v dané složce, typicky se jedná o to, s
  jakou šablonou se mají vykreslit.

## Formáty dokumentů

Jsou použity dva typy vstupních souborů: Markdown (`.md`) a Nunjucks
(`.njk`, [dokumentace](https://mozilla.github.io/nunjucks/)).

Markdown je hojně používaným formátem pro dokumenty, které stačí sepsat jako
textové soubory, ale chceme je vykreslit jako formátovaný text. Hlavní věci
formátovaní:

- Odstavce jsou odděleny novým řádkem.
- Nadpis se vytváří pomocí znaku `#`. Úroveň nadpisu je určena počtem `#`, tedy
  `# Nadpis`, `## Podnadpis`, `### Podpodnadpis` atd.
- Odkazy lze uvádět jako do ostrých závorek (`<https://example.com>`), pokud chceme
  zobrazit samotný odkaz nebo do hranatých a kulatých, pokud odkazu chceme dát
  nějaký název (`[Název odkazu](https://example.com)`). Funguje i pro emaily.
- Odrážky (nečíslovaný seznam) se zapisují jako pomlčky:
    ```
        - První odrážka
        - Druhá odrážka
        - Třetí odrážka
    ```
- Číslovaný seznam se píše pomocí čísel:
    ```
        1. První bod
        2. Druhý bod
        3. Třetí bod
    ```
- Obrázky se vkládají pomocí `![Alternativní text](/assets/obrazek.jpg)`

Viz [Markdown návod na syntaxi](https://www.markdownguide.org/basic-syntax/).

Formát Nunjucks je rozšíření HTML, které umožňuje použití speciálních tagů v
závorkách (`{{ }}`, `{% %}`) např. pro vykreslení proměnné, vložení externího
souboru atd. Až na tyto speciální případy je to ale normální HTML.

V obecnosti je ve vstupních souborech možné použít prostě HTML. Např. Markdown
neumí tlačítka, tedy pokud by měl nějaký odkaz vypadat jako tlačítko, je možné
přímo do daného `.md` souboru vložit `<a href="https://example.com" class="btn
btn-primary">Odkaz</a>`, kdy `btn btn-primary` jsou
[Bootstrap](https://getbootstrap.com/docs/) styly pro tlačítka.

## Online editor

Zdrojové soubory je možné editovat přímo v prohlížeči pomocí Github Codespaces.

- Na stránce repozitáře se vpravo nahoře vybere zelené tlačítko `Code` a záložka
  `Codespaces`.
- V sekci `On current branch` se objeví již existující editace. Pokud taková
  existuje, stačí ji vybrat. Pokud neexistuje, klikne se na tlačítko `Create
codespace`.
- Tato akce otevře nové okno a spustí online editor. Chvíli trvá, než se načte,
  je proto potřeba ho nechat, dokud se vše nenastaví. Po tuto dobu se vlevo
  dole zobrazí "Připojování ke vzdálenému prostředí" a po plném spuštění se do
  terminálu vypíše
    ```
    Use Cmd/Ctrl + Shift + P -> View Creation Log to see full logs
    ✔ Finishing up...
    ✔ Running postCreateCommand...
    ⠏ Running postStartCommand...
        › npm run dev
    ```
    Jakmile se toto vypíše, je vše nastaveno.
- Po nastavení editoru je možné upravovat zdrojové soubory. Soubor lze editovat
  prostým vybráním v levém okně a změnou textu.
- Uprostřed dole, vedle záložky `Terminál` se nachází `Porty`. Zde je možné
  najít URL pro live prohlížení stránek.
- Je možné, že se při editaci udělá chyba a live prohlížení nic změnu nezobrazí.
  Pro zobrazení chybových hlášek stačí zmáčknout F1 a vyhledat _View Creation
  Log_. To zobrazí výpis kompilace stránek a případné chyby.
- Jakmile jsou všechny úpravy hotové, je potřeba změny _commitnout_. V levém
  panelu se vybere tlačítko "Správa zdrojového kódu". Pomocí tlačítka `+` se
  vyberou soubory, u který se má propsat změna, nahoře se napíše nějaká zpráva
  (např. "přidání novinky") a potvrdí se změny.
- Změny, které se takto zahrnou, se automaticky do pár sekund propíšou do
  produkční verze.
