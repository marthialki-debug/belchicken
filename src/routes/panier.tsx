import { PaymentModal } from "@/components/PaymentModal";
import { PAYMENT_METHODS, type PaymentMethod, type PaymentReceipt } from "@/lib/payment";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer } from "@/components/Header";
import { useCart } from "@/lib/cart";
import { ZONES, WHATSAPP_NUMBER, formatFCFA } from "@/lib/menu";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Mon panier — Commander chez Belchiken à Ouagadougou" },
      {
        name: "description",
        content:
          "Finalisez votre commande Belchiken : choisissez votre zone de livraison à Ouagadougou et envoyez votre bon de commande par WhatsApp en un clic.",
      },
      { property: "og:title", content: "Commander chez Belchiken" },
      {
        property: "og:description",
        content: "Panier, frais de livraison par zone et checkout WhatsApp instantané.",
      },
    ],
  }),
  component: PanierPage,
});

function PanierPage() {
  const { items, subtotal, setQuantity, removeItem, clear, saveOrder, hydrated } = useCart();
  const [zoneId, setZoneId] = useState(ZONES[0]!.id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payMethod, setPayMethod] = useState<"whatsapp" | PaymentMethod>("whatsapp");
  const [showPayment, setShowPayment] = useState(false);
  const zone = useMemo(() => ZONES.find((z) => z.id === zoneId) ?? ZONES[0]!, [zoneId]);
  const total = subtotal + (items.length ? zone.fee : 0);

  function buildMessage(orderId: string, payment?: PaymentReceipt) {
    const lines = [
      "*NOUVELLE COMMANDE BELCHIKEN*",
      `Réf : ${orderId}`,
      "",
      "*Client*",
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      zone.fee === 0 ? "Mode : Retrait sur place" : `Zone : ${zone.name}`,
      address ? `Adresse / repère : ${address}` : "",
      "",
      "*Commande*",
      ...items.map(
        (i) =>
          `• ${i.quantity} × ${i.name}${
            i.optionLabels.length ? ` (${i.optionLabels.join(", ")})` : ""
          } — ${formatFCFA(i.unitPrice * i.quantity)}`,
      ),
      "",
      `Sous-total : ${formatFCFA(subtotal)}`,
      `Livraison : ${formatFCFA(zone.fee)}`,
      `*TOTAL : ${formatFCFA(total)}*`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!items.length) return;
  if (!name.trim() || !phone.trim()) {
    toast.error("Merci d'indiquer votre nom et votre téléphone.");
    return;
  }
  if (zone.fee > 0 && !address.trim()) {
    toast.error("Indiquez une adresse ou un repère pour la livraison.");
    return;
  }
  if (payMethod === "whatsapp") {
    sendOrder();
  } else {
    setShowPayment(true);
  }
}

function sendOrder(payment?: PaymentReceipt) {
  const order = saveOrder({
    customer: { name, phone, address },
    zone: { id: zone.id, name: zone.name, fee: zone.fee },
    items,
    subtotal,
    total,
    ...(payment && {
      payment: {
        method: payment.method,
        transactionId: payment.transactionId,
        phone: payment.phone,
        status: payment.status,
      },
    }),
  });
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(order.id, payment))}`;
  window.open(url, "_blank", "noopener");
  clear();
  toast.success(
    payment
      ? `Paiement confirmé, commande ${order.id} envoyée sur WhatsApp !`
      : `Commande ${order.id} envoyée sur WhatsApp !`,
  );
}

  return (
    <div className="min-h-screen">
      <Header />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-5xl tracking-wide">
          MON <span className="flame-text">PANIER</span>
        </h1>

        {hydrated && items.length === 0 ? (
          <div className="mt-10 rounded-md border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">Votre panier est vide.</p>
            <Link
              to="/menu"
              className="mt-6 inline-block rounded-sm flame-bg px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
            >
              Voir la carte
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              {items.map((i) => (
                <div
                  key={i.lineId}
                  className="flex gap-4 rounded-md border border-border bg-card p-3"
                >
                  <img
                    src={i.image}
                    alt={i.name}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-sm object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-xl tracking-wide">{i.name}</p>
                        {i.optionLabels.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {i.optionLabels.join(" · ")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(i.lineId)}
                        aria-label="Retirer"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-sm border border-border px-2 py-1">
                        <button
                          onClick={() => setQuantity(i.lineId, i.quantity - 1)}
                          aria-label="Diminuer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold">{i.quantity}</span>
                        <button
                          onClick={() => setQuantity(i.lineId, i.quantity + 1)}
                          aria-label="Augmenter"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-display text-lg text-gold">
                        {formatFCFA(i.unitPrice * i.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="h-fit space-y-4 rounded-md border border-border bg-card p-5"
            >
              <h2 className="font-display text-2xl tracking-wide">Vos informations</h2>

              <div className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom complet"
                  className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Téléphone (ex : 06 69 88 57)"
                  className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  {ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — {z.fee === 0 ? "gratuit" : formatFCFA(z.fee)}
                    </option>
                  ))}
                </select>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Adresse exacte / repère local"
                  rows={3}
                  className="w-full rounded-sm border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison — {zone.name}</span>
                  <span>{formatFCFA(zone.fee)}</span>
                </div>
                <div className="flex justify-between pt-2 font-display text-2xl tracking-wide">
                  <span>Total</span>
                  <span className="text-gold">{formatFCFA(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-sm flame-bg py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground glow"
              >
                Commander sur WhatsApp
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Aucun paiement en ligne : votre bon de commande pré-rempli part directement au
                restaurant.
              </p>
            </form>
          </div>
        )}
      </section>
{showPayment && payMethod !== "whatsapp" && (
  <PaymentModal
    method={payMethod}
    amount={total}
    initialPhone={phone}
    onClose={() => setShowPayment(false)}
    onSuccess={(receipt) => {
      setShowPayment(false);
      sendOrder(receipt);
    }}
  />
)}
      <Footer />
    </div>
  );
}
