import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Header, Footer } from "@/components/Header";
import { useCart } from "@/lib/cart";
import { formatFCFA } from "@/lib/menu";

const PIN = "2024";

export const Route = createFileRoute("/caisse")({
  head: () => ({
    meta: [
      { title: "Caisse & statistiques — Espace interne Belchiken" },
      {
        name: "description",
        content:
          "Mode démo : historique des commandes Belchiken enregistrées sur cet appareil, chiffre d'affaires du jour et plats les plus vendus.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Caisse Belchiken" },
      { property: "og:description", content: "Historique des commandes et statistiques de vente." },
    ],
  }),
  component: CaissePage,
});

function CaissePage() {
  const { orders, hydrated } = useCart();
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const today = new Date().toDateString();
  const todayOrders = useMemo(
    () => orders.filter((o) => new Date(o.date).toDateString() === today),
    [orders, today],
  );

  const revenue = todayOrders.reduce((s, o) => s + o.total, 0);

  const topItems = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of todayOrders) {
      for (const i of o.items) map.set(i.name, (map.get(i.name) ?? 0) + i.quantity);
    }
    return [...map.entries()]
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 6);
  }, [todayOrders]);

  if (!unlocked) {
    return (
      <div className="min-h-screen">
        <Header />
        <section className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-24">
          <h1 className="font-display text-4xl tracking-wide">
            ESPACE <span className="flame-text">CAISSE</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Mode démo protégé par code. Code de démonstration : 2024
          </p>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            type="password"
            placeholder="Code d'accès"
            className="h-11 rounded-sm border border-border bg-card px-3 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={() => setUnlocked(pin === PIN)}
            className="rounded-sm flame-bg py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
          >
            Entrer
          </button>
          {pin && pin !== PIN && <p className="text-sm text-destructive">Code incorrect.</p>}
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-5xl tracking-wide">
          CAISSE <span className="flame-text">DU JOUR</span>
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Chiffre d'affaires", value: formatFCFA(revenue) },
            { label: "Commandes du jour", value: String(todayOrders.length) },
            {
              label: "Panier moyen",
              value: formatFCFA(todayOrders.length ? Math.round(revenue / todayOrders.length) : 0),
            },
          ].map((s) => (
            <div key={s.label} className="rounded-md border border-border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-2 font-display text-3xl tracking-wide text-gold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-md border border-border bg-card p-5">
          <h2 className="font-display text-2xl tracking-wide">Plats les plus vendus</h2>
          {topItems.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucune vente enregistrée aujourd'hui.
            </p>
          ) : (
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItems}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" allowDecimals={false} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Bar dataKey="qty" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-md border border-border bg-card p-5">
          <h2 className="font-display text-2xl tracking-wide">Historique des commandes</h2>
          {hydrated && orders.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucune commande enregistrée sur cet appareil.
            </p>
          )}
          <div className="mt-4 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-sm border border-border p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-lg tracking-wide">{o.id}</span>
                  <span className="text-muted-foreground">
                    {new Date(o.date).toLocaleString("fr-FR")}
                  </span>
                  <span className="font-bold text-gold">{formatFCFA(o.total)}</span>
                </div>
                <p className="mt-1 text-muted-foreground">
                  {o.customer.name} · {o.customer.phone} · {o.zone.name}
                </p>
                <ul className="mt-2 text-muted-foreground">
                  {o.items.map((i) => (
                    <li key={i.lineId}>
                      {i.quantity} × {i.name}
                      {i.optionLabels.length ? ` (${i.optionLabels.join(", ")})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
