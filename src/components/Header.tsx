import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/menu", label: "La Carte" },
  { to: "/panier", label: "Commander" },
  { to: "/caisse", label: "Caisse" },
] as const;

export function Header() {
  const { count, hydrated } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-display text-2xl tracking-widest">
          BEL<span className="flame-text">CHIKEN</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground",
                pathname === l.to && "text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/panier"
            className="relative inline-flex h-10 items-center gap-2 rounded-sm flame-bg px-4 text-sm font-bold uppercase tracking-wider text-primary-foreground"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Panier</span>
            {hydrated && count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-xs font-bold text-background">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-widest">
            BEL<span className="flame-text">CHIKEN</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Poulet frit croustillant, préparé minute à Ouagadougou.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 font-display text-lg tracking-wider text-foreground">Horaires</p>
          <p>Lundi – Jeudi : 11h – 22h</p>
          <p>Vendredi – Dimanche : 11h – 00h</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 font-display text-lg tracking-wider text-foreground">Contact</p>
          <p>Ouagadougou, Burkina Faso</p>
          <p>WhatsApp : +226 70 00 00 00</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Belchiken — Projet ASI
      </div>
    </footer>
  );
}
