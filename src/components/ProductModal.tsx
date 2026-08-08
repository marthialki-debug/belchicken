import { useMemo, useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatFCFA, type Product } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [singles, setSingles] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const g of product.options) {
      const first = g.choices[0];
      if (g.type === "single" && first) init[g.id] = first.id;
    }
    return init;
  });
  const [multis, setMultis] = useState<Record<string, string[]>>({});

  const { extra, labels } = useMemo(() => {
    let extraSum = 0;
    const labelList: string[] = [];
    for (const g of product.options) {
      if (g.type === "single") {
        const choice = g.choices.find((c) => c.id === singles[g.id]);
        if (choice) {
          extraSum += choice.price;
          labelList.push(choice.label);
        }
      } else {
        for (const id of multis[g.id] ?? []) {
          const choice = g.choices.find((c) => c.id === id);
          if (choice) {
            extraSum += choice.price;
            labelList.push(choice.label);
          }
        }
      }
    }
    return { extra: extraSum, labels: labelList };
  }, [product.options, singles, multis]);

  const unitPrice = product.price + extra;

  function toggleMulti(groupId: string, choiceId: string) {
    setMultis((prev) => {
      const current = prev[groupId] ?? [];
      return {
        ...prev,
        [groupId]: current.includes(choiceId)
          ? current.filter((c) => c !== choiceId)
          : [...current, choiceId],
      };
    });
  }

  function handleAdd() {
    addItem(product, { optionLabels: labels, extra }, quantity);
    toast.success(`${quantity} × ${product.name} ajouté au panier`);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-lg border border-border bg-card sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-44 w-full object-cover"
          />
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div>
            <h3 className="font-display text-3xl tracking-wide">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
          </div>

          {product.options.map((group) => (
            <div key={group.id}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.choices.map((choice) => {
                  const active =
                    group.type === "single"
                      ? singles[group.id] === choice.id
                      : (multis[group.id] ?? []).includes(choice.id);
                  return (
                    <button
                      key={choice.id}
                      onClick={() =>
                        group.type === "single"
                          ? setSingles((p) => ({ ...p, [group.id]: choice.id }))
                          : toggleMulti(group.id, choice.id)
                      }
                      className={cn(
                        "rounded-sm border px-3 py-2 text-sm transition-colors",
                        active
                          ? "border-primary bg-primary/15 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50",
                      )}
                    >
                      {choice.label}
                      {choice.price > 0 && (
                        <span className="ml-1 text-xs text-gold">+{choice.price}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <div className="flex items-center gap-3 rounded-sm border border-border px-2 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuer"
                className="p-1"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} aria-label="Augmenter" className="p-1">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 rounded-sm flame-bg px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
            >
              Ajouter — {formatFCFA(unitPrice * quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
