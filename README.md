# Ubytování Vážka

Redesign webu penzionu Vážka v Mohelnici ([ubytovanivazka.cz](https://www.ubytovanivazka.cz)).
Jedna stránka, kotvená navigace, nezávazná poptávka termínu.

## Spuštění

```bash
npm install
npm run dev
```

Otevřete http://localhost:3000.

> **Pozor na iCloud.** Projekt nedržte ve složce synchronizované iCloudem
> (Plocha, Dokumenty). macOS odsouvá soubory z `node_modules` do cloudu a build
> se pak zasekne na čtení, které nikdy neskončí. Proto projekt žije v `~/dev`.

## Rezervační formulář

Formulář má dva režimy a přepíná se sám podle toho, jestli je nastavený
`RESEND_API_KEY`:

| Klíč | Chování |
| --- | --- |
| nenastavený | Server složí zprávu a vrátí ji zpět. Prohlížeč otevře hostovi jeho poštovního klienta s předvyplněnou poptávkou. Web funguje hned po nasazení. |
| nastavený | Poptávka se odešle přes [Resend](https://resend.com) na `BOOKING_TO`, `Reply-To` je e-mail hosta. Host jen odešle formulář. |

Proměnné jsou v `.env.example`. Zkopírujte do `.env.local` a doplňte.

Pro ostré odesílání je potřeba v Resendu ověřit doménu; dokud není ověřená, jde
dočasně použít `onboarding@resend.dev` jako odesílatele.

## Struktura

```
src/
  app/
    actions.ts      server action pro poptávku (Resend + fallback)
    layout.tsx      fonty, metadata, JSON-LD
    page.tsx        složení sekcí
  components/
    wing.tsx        křídlo vážky — generovaná žilnatina, signature prvek
    hero.tsx        úvod
    ubytovani.tsx   přepínač pokojů s prohlížečem fotek
    cenik.tsx       ceník
    galerie.tsx     mřížka + lightbox
    okoli.tsx       výlety řazené podle vzdálenosti
    rezervace.tsx   formulář
    kontakt.tsx     kontakt a patička
  lib/
    content.ts      veškerý text a čísla na jednom místě
```

Změna ceny, popisu pokoje nebo přidání výletu = úprava jediného souboru,
`src/lib/content.ts`.

## Design

Paleta vychází z hmyzu, po kterém se penzion jmenuje. Křídlo vážky mění barvu
podle úhlu dopadu světla — z tyrkysové přes fialovou do bronzové. Tenhle přechod
je jediný akcent na webu a nikde není použitý jako plná výplň, jen jako gradient
v lince nebo tahu.

Podklad je tmavý odstín stojaté vody, ne černá. Pokoje mají výrazné barvy
(růžová, zelená, červená) a na tomhle podkladu působí jako barevné vsazení,
místo aby se s ním praly.

Signature prvek je křídlo v úvodu: žilnatina se dopočítává z geometrie křídla
(podélné žilky vějířem od kořene, příčky mezi nimi), ne z pevné cesty, a při
načtení se vykresluje. V malém měřítku se opakuje jako značka u každé sekce.

Písma: **Bodoni Moda** na nadpisy, **Archivo** na text. Obě se sadou
`latin-ext` — bez ní se česká diakritika láme na systémový fallback.

## Fotografie

Původní web měl 16 obrázků, z toho 11 byly slepené koláže po pěti fotkách.
Skript je rozřezal na jednotlivé snímky (rekurzivně, podle bílých mezer),
sjednotil barevně — mírné odsycení, S-křivka, split-tone do palety webu — a
vyexportoval do WebP. Výsledek je 32 fotek v `public/photos`.

Fotky nejsou retušované ani nahrazené. Pokoje vypadají tak, jak vypadají.

## Nasazení

Běží na Vercelu bez další konfigurace. Do proměnných prostředí doplňte
`RESEND_API_KEY`, `BOOKING_FROM` a `BOOKING_TO`.
