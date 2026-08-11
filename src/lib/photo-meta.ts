/**
 * Native pixel size of every graded photo.
 *
 * Generated from public/photos. Components use this to avoid painting a
 * photo larger than it actually is — upscaling these sources is exactly what
 * made the room viewer look soft.
 */

export type PhotoMeta = { w: number; h: number };

export const photoMeta: Record<string, PhotoMeta> = {
  "apartman-cerveny-kuchyn": { w: 520, h: 355 },
  "apartman-cerveny-loznice": { w: 864, h: 578 },
  "apartman-cerveny-tv": { w: 494, h: 253 },
  "apartman-ruzovy-detail": { w: 548, h: 366 },
  "apartman-ruzovy-jidelni": { w: 484, h: 334 },
  "apartman-ruzovy-loznice": { w: 802, h: 535 },
  "apartman-ruzovy-obyvaci": { w: 850, h: 567 },
  "apartman-ruzovy-sezeni": { w: 244, h: 366 },
  "apartman-ruzovy-tv": { w: 428, h: 287 },
  "apartman-zeleny-jidelni": { w: 862, h: 464 },
  "apartman-zeleny-kuchyn": { w: 556, h: 364 },
  "apartman-zeleny-loznice": { w: 521, h: 377 },
  "apartman-zeleny-vstup": { w: 377, h: 450 },
  "detail-bylinky": { w: 462, h: 586 },
  "detail-kvetina": { w: 286, h: 320 },
  "detail-lampa": { w: 402, h: 387 },
  "detail-schodiste": { w: 814, h: 1235 },
  "koupelna-bezova": { w: 960, h: 1280 },
  "koupelna-cernobila": { w: 863, h: 619 },
  "koupelna-cervena": { w: 557, h: 320 },
  "koupelna-radiator": { w: 436, h: 654 },
  "koupelna-sklo": { w: 857, h: 647 },
  "koupelna-sprcha": { w: 849, h: 550 },
  "kuchyn-deska": { w: 446, h: 680 },
  "kuchyn-linka": { w: 859, h: 539 },
  "kuchyn-spolecna": { w: 960, h: 720 },
  "pokoj-dvouluzkovy": { w: 960, h: 720 },
  "pokoj-dvouluzkovy-okno": { w: 960, h: 1280 },
  "pokoj-fialovy": { w: 856, h: 571 },
  "pokoj-sezeni": { w: 862, h: 576 },
  "pokoj-trojluzkovy": { w: 960, h: 720 },
  "pokoj-tv-jidelni": { w: 428, h: 232 },
};
