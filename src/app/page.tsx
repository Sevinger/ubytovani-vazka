import { Cenik } from "@/components/cenik";
import { Galerie } from "@/components/galerie";
import { Hero } from "@/components/hero";
import { Kontakt, SiteFooter } from "@/components/kontakt";
import { Okoli } from "@/components/okoli";
import { Rezervace } from "@/components/rezervace";
import { SiteHeader } from "@/components/site-header";
import { Ubytovani } from "@/components/ubytovani";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Ubytovani />
        <Cenik />
        <Galerie />
        <Okoli />
        <Rezervace />
        <Kontakt />
      </main>
      <SiteFooter />
    </>
  );
}
