import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header, Footer } from "@/components/Header";
import { ProductModal } from "@/components/ProductModal";
import { CATEGORIES, PRODUCTS, formatFCFA, type CategoryId, type Product } from "@/lib/menu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "La Carte Belchiken — Buckets, Burgers & Menus à Ouagadougou" },
      {
        name: "description",
        content:
          "Découvrez la carte Belchiken : buckets de poulet frit, burgers croustillants, accompagnements et boissons. Personnalisez vos sauces et commandez en ligne.",
      },
      { property: "og:title", content: "La Carte Belchiken" },
      {
        property: "og:description",
        content: "Buckets, burgers, menus combo et boissons — personnalisables et livrés à Ouaga.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [active, setActive] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (active === "all" || p.category === active) &&
          p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [active, query],
  );

  return (
    <div className="min-h-screen">
      <Header />

      <section className="border-b border-border/60 bg-surface py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="font-display text-5xl tracking-wide sm:text-6xl">
            LA <span className="flame-text">CARTE</span>
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Tout est frit minute. Choisissez votre niveau de piment et vos sauces.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {[{ id: "all" as const, label: "Tout" }, ...CATEGORIES].map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "rounded-sm border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                  active === c.id
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un plat…"
            className="h-10 w-full rounded-sm border border-border bg-card px-3 text-sm outline-none focus:border-primary md:w-64"
          />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="group overflow-hidden rounded-md border border-border bg-card text-left transition-transform hover:-translate-y-1 hover:border-primary/60"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {p.tag && (
                  <span className="absolute left-3 top-3 rounded-sm flame-bg px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-display text-2xl tracking-wide">{p.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-xl text-gold">{formatFCFA(p.price)}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Personnaliser
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">Aucun plat ne correspond.</p>
        )}
      </section>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      <Footer />
    </div>
  );
}
