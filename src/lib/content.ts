/**
 * Every word and number on the site lives here.
 *
 * Source of truth is the original ubytovanivazka.cz. Where the old site
 * contradicted itself, the Ceník page wins — see `rooms` below.
 */

export const site = {
  name: "Ubytování Vážka",
  place: "Mohelnice",
  tagline: "Penzion v Mohelnici",
  url: "https://www.ubytovanivazka.cz",
} as const;

export const contact = {
  street: "Olomoucká 1364/75",
  city: "Mohelnice",
  zip: "789 85",
  phone: "775 578 103",
  phoneHref: "+420775578103",
  email: "ubytovanivazka@seznam.cz",
  gps: "N 49°45.97917', E 16°55.22442'",
  /** decimal form, for the map link */
  lat: 49.766319,
  lon: 16.920407,
} as const;

export const operator = {
  name: "T.O.T. - ONE, s.r.o.",
  ico: "04703898",
  dic: "CZ04703898",
  vat: "Plátce DPH",
  cp: "1011297213",
  registration: "Zapsán na MÚ Mohelnice, obecní živnostenský úřad.",
} as const;

export type Room = {
  id: string;
  name: string;
  price: number;
  /** shown under the price, e.g. "za osobu a noc" */
  priceUnit: string;
  lede: string;
  features: string[];
  /** photo slugs from /public/photos, first one leads */
  photos: string[];
  accent: "ruzovy" | "zeleny" | "cerveny" | "pokoj";
};

/**
 * Note on pricing: the old site's Ubytování page listed the twin rooms at a
 * flat 450 Kč, while its Ceník split them into 350 Kč (bathroom private to the
 * room but off the corridor) and 450 Kč (bathroom inside the room). The Ceník
 * is the more specific of the two, so it is what we publish.
 */
export const rooms: Room[] = [
  {
    id: "dvoupokojovy-apartman",
    name: "Dvoupokojový apartmán",
    price: 750,
    priceUnit: "za osobu a noc",
    lede: "Dva stylové apartmány v moderním designu. Obývací pokoj s kuchyní a oddělená ložnice — prostor, ve kterém se dá i pracovat a vařit, ne jenom přespat.",
    features: [
      "Obývací pokoj s kuchyní",
      "Oddělená ložnice",
      "Kuchyňská linka se spotřebiči",
      "Pracovní i jídelní stůl",
      "Vlastní koupelna",
      "TV a Wi-Fi",
    ],
    // Ordered by native resolution: the sharpest frame leads, and
    // apartman-ruzovy-sezeni (244px wide) is left to the gallery, where the
    // tiles are small enough for it to hold up.
    photos: [
      "apartman-cerveny-loznice",
      "apartman-ruzovy-obyvaci",
      "apartman-ruzovy-loznice",
      "apartman-ruzovy-detail",
      "apartman-cerveny-kuchyn",
      "apartman-ruzovy-jidelni",
    ],
    accent: "ruzovy",
  },
  {
    id: "dvouluzkovy-apartman",
    name: "Dvoulůžkový apartmán",
    price: 550,
    priceUnit: "za osobu a noc",
    lede: "Jeden prostor, ve kterém nic nechybí. Manželská postel, kuchyňská linka a jídelní stůl — útulné a praktické zároveň.",
    features: [
      "Manželská postel",
      "Kuchyňská linka",
      "Jídelní stůl",
      "Vlastní koupelna",
      "TV a Wi-Fi",
    ],
    photos: [
      "apartman-zeleny-jidelni",
      "apartman-zeleny-kuchyn",
      "apartman-zeleny-loznice",
      "apartman-zeleny-vstup",
    ],
    accent: "zeleny",
  },
  {
    id: "pokoj-s-koupelnou",
    name: "Dvoulůžkový a třílůžkový pokoj",
    price: 450,
    priceUnit: "za osobu a noc",
    lede: "Oddělená lůžka a koupelna přímo na pokoji. K dispozici je společná, plně vybavená kuchyň a pračka.",
    features: [
      "Oddělená lůžka",
      "Koupelna na pokoji",
      "Společná vybavená kuchyň",
      "Pračka k dispozici",
      "TV a Wi-Fi",
    ],
    photos: [
      "pokoj-trojluzkovy",
      "pokoj-fialovy",
      "kuchyn-spolecna",
      "koupelna-sklo",
    ],
    accent: "pokoj",
  },
  {
    id: "pokoj-dvouluzkovy",
    name: "Dvoulůžkový pokoj",
    price: 350,
    priceUnit: "za osobu a noc",
    lede: "Nejúspornější volba. Oddělená lůžka a vlastní koupelna, kterou nesdílíte s nikým dalším — jen je na chodbě, ne na pokoji.",
    features: [
      "Oddělená lůžka",
      "Vlastní koupelna mimo pokoj",
      "Společná vybavená kuchyň",
      "Pračka k dispozici",
      "TV a Wi-Fi",
    ],
    photos: [
      "pokoj-dvouluzkovy",
      "pokoj-dvouluzkovy-okno",
      "pokoj-sezeni",
      "kuchyn-linka",
    ],
    accent: "pokoj",
  },
];

/** Shown next to the price table so nobody is surprised on arrival. */
export const priceNotes = [
  "Ceny jsou uvedeny za osobu a noc, bez stravy.",
  "Ubytování se psy neposkytujeme.",
];

export type Trip = {
  name: string;
  /** approximate road distance from Mohelnice, in km */
  km: number;
  kind: "hrad" | "příroda" | "město" | "koupání";
};

/**
 * Distances are approximate road distances and are meant for orientation only.
 */
export const trips: Trip[] = [
  { name: "Zámek Úsov", km: 12, kind: "hrad" },
  { name: "Arboretum Bílá Lhota", km: 17, kind: "příroda" },
  { name: "Mladečské jeskyně", km: 18, kind: "příroda" },
  { name: "Hrad Bouzov", km: 20, kind: "hrad" },
  { name: "Javoříčské jeskyně", km: 20, kind: "příroda" },
  { name: "Aquapark Moravská Třebová", km: 30, kind: "koupání" },
  { name: "Olomouc", km: 35, kind: "město" },
  { name: "Aquapark Olomouc", km: 35, kind: "koupání" },
  { name: "ZOO Svatý Kopeček", km: 40, kind: "město" },
  { name: "Velké Losiny — zámek a papírna", km: 40, kind: "hrad" },
  { name: "Dlouhé Stráně", km: 55, kind: "příroda" },
  { name: "Praděd", km: 60, kind: "příroda" },
  { name: "Lyžařské areály Jeseníky", km: 70, kind: "příroda" },
];

export const nav = [
  { href: "#ubytovani", label: "Ubytování" },
  { href: "#cenik", label: "Ceník" },
  { href: "#galerie", label: "Fotogalerie" },
  { href: "#okoli", label: "Kam na výlet" },
  { href: "#kontakt", label: "Kontakt" },
] as const;

/** Every graded photo, for the gallery. */
export const galleryPhotos: { slug: string; alt: string; group: string }[] = [
  { slug: "apartman-ruzovy-loznice", alt: "Ložnice dvoupokojového apartmánu s manželskou postelí", group: "Apartmány" },
  { slug: "apartman-ruzovy-obyvaci", alt: "Obývací pokoj apartmánu s pohovkou a jídelním koutem", group: "Apartmány" },
  { slug: "apartman-ruzovy-jidelni", alt: "Jídelní stůl pro čtyři osoby v apartmánu", group: "Apartmány" },
  { slug: "apartman-ruzovy-sezeni", alt: "Sedací souprava s konferenčním stolkem", group: "Apartmány" },
  { slug: "apartman-ruzovy-tv", alt: "Televize a pracovní kout v apartmánu", group: "Apartmány" },
  { slug: "apartman-ruzovy-detail", alt: "Ustlaná postel s připravenými ručníky", group: "Apartmány" },
  { slug: "apartman-cerveny-loznice", alt: "Ložnice apartmánu s oddělenými lůžky", group: "Apartmány" },
  { slug: "apartman-cerveny-kuchyn", alt: "Kuchyňský a jídelní kout apartmánu", group: "Apartmány" },
  { slug: "apartman-cerveny-tv", alt: "Apartmán s televizí a úložným prostorem", group: "Apartmány" },
  { slug: "apartman-zeleny-loznice", alt: "Dvoulůžkový apartmán s manželskou postelí", group: "Apartmány" },
  { slug: "apartman-zeleny-kuchyn", alt: "Kuchyňská linka v dvoulůžkovém apartmánu", group: "Apartmány" },
  { slug: "apartman-zeleny-jidelni", alt: "Jídelní stůl a komoda v apartmánu", group: "Apartmány" },
  { slug: "apartman-zeleny-vstup", alt: "Pohled do apartmánu od vstupních dveří", group: "Apartmány" },
  { slug: "pokoj-trojluzkovy", alt: "Prostorný třílůžkový pokoj s jídelním stolem", group: "Pokoje" },
  { slug: "pokoj-dvouluzkovy", alt: "Dvoulůžkový pokoj s oddělenými lůžky a televizí", group: "Pokoje" },
  { slug: "pokoj-dvouluzkovy-okno", alt: "Dvoulůžkový pokoj s výhledem do ulice", group: "Pokoje" },
  { slug: "pokoj-tv-jidelni", alt: "Pokoj s televizí a jídelním stolem", group: "Pokoje" },
  { slug: "pokoj-fialovy", alt: "Dvoulůžkový pokoj s manželskou postelí", group: "Pokoje" },
  { slug: "pokoj-sezeni", alt: "Sedací kout v pokoji", group: "Pokoje" },
  { slug: "kuchyn-spolecna", alt: "Společná plně vybavená kuchyň", group: "Kuchyně" },
  { slug: "kuchyn-linka", alt: "Kuchyňská linka se spotřebiči", group: "Kuchyně" },
  { slug: "kuchyn-deska", alt: "Varná deska a dřez ve společné kuchyni", group: "Kuchyně" },
  { slug: "koupelna-sprcha", alt: "Koupelna se sprchovým koutem", group: "Koupelny" },
  { slug: "koupelna-bezova", alt: "Koupelna se sprchovým koutem a toaletou", group: "Koupelny" },
  { slug: "koupelna-cervena", alt: "Koupelna s umyvadlem a zrcadlem", group: "Koupelny" },
  { slug: "koupelna-sklo", alt: "Prosklený sprchový kout", group: "Koupelny" },
  { slug: "koupelna-cernobila", alt: "Koupelna v černobílém obkladu", group: "Koupelny" },
  { slug: "koupelna-radiator", alt: "Koupelna s žebříkovým radiátorem", group: "Koupelny" },
  { slug: "detail-schodiste", alt: "Schodiště s kovaným zábradlím", group: "Dům" },
  { slug: "detail-kvetina", alt: "Květinová dekorace v pokoji", group: "Dům" },
  { slug: "detail-bylinky", alt: "Bylinky v okně", group: "Dům" },
  { slug: "detail-lampa", alt: "Detail stolní lampy", group: "Dům" },
];

/** Photos that exist only in a 480px-wide variant are excluded here. */
export const heroPhotos = [
  "apartman-zeleny-loznice",
  "apartman-ruzovy-loznice",
  "pokoj-trojluzkovy",
] as const;
