import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Timer, MapPin, MessageCircle } from "lucide-react";
import { Header, Footer } from "@/components/Header";
import { PRODUCTS, ZONES, formatFCFA } from "@/lib/menu";
import heroImg from "@/assets/hero-chicken.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Belchiken — Poulet frit croustillant & livraison à Ouagadougou" },
      {
        name: "description",
        content:
          "Belchiken : buckets de poulet frit, burgers et menus combo préparés minute à Ouagadougou. Commandez en ligne, livraison par zone ou click & collect.",
      },
      { property: "og:title", content: "Belchiken — Poulet frit croustillant à Ouagadougou" },
      {
        property: "og:description",
        content: "Commandez vos buckets et burgers en ligne, livrés partout à Ouaga.",
      },
    ],
  }),
  component: Index,
});

const highlights = PRODUCTS.filter((p) =>
  ["bucket-6", "burger-double", "combo-family"].includes(p.id),
);

function Index() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Bucket de poulet frit croustillant Belchiken"
          width={1600}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 fade-bottom" />
        <div className="relative mx-auto max-w-6xl px-4 py-28 sm:py-36">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-gold">
            Ouagadougou · Burkina Faso
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-6xl leading-[0.9] tracking-wide sm:text-8xl">
            LE POULET FRIT
            <br />
            <span className="flame-text">QUI CRAQUE VRAIMENT.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Panure signature, marinade 12 heures, frit à la commande. Composez votre panier et
            recevez-le chez vous en moins de 40 minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="rounded-sm flame-bg px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground glow"
            >
              Commander maintenant
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Flame, title: "Frit minute", text: "Jamais réchauffé, toujours croustillant." },
            { icon: Timer, title: "40 min chrono", text: "Livraison rapide dans tout Ouaga." },
            { icon: MapPin, title: "10 zones", text: "Tarif de livraison clair et affiché." },
            { icon: MessageCircle, title: "Commande WhatsApp", text: "Un clic, sans compte, sans friction." },
          ].map((f) => (
            <div key={f.title}>
              <f.icon className="h-6 w-6 text-primary" />
              <p className="mt-3 font-display text-xl tracking-wide">{f.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display text-4xl tracking-wide sm:text-5xl">
          LES <span className="flame-text">INCONTOURNABLES</span>
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {highlights.map((p) => (
            <Link
              key={p.id}
              to="/menu"
              className="group overflow-hidden rounded-md border border-border bg-card"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="font-display text-2xl tracking-wide">{p.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-3 font-display text-xl text-gold">{formatFCFA(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-4xl tracking-wide sm:text-5xl">
            ZONES DE <span className="flame-text">LIVRAISON</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tarifs transparents, calculés automatiquement dans votre panier.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ZONES.filter((z) => z.fee > 0).map((z) => (
              <div
                key={z.id}
                className="flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3"
              >
                <span className="text-sm">{z.name}</span>
                <span className="font-display text-lg text-gold">{formatFCFA(z.fee)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Retrait sur place (Click &amp; Collect) : gratuit.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
