import { useState, type ReactNode } from "react";
import { useAuth } from "../lib/auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const {
    authenticated,
    hydrated,
    loginWithPhone,
    loginWithEmail,
    hasPinSet,
    createPin,
    loginWithPin,
  } = useAuth();

  const [method, setMethod] = useState<"phone" | "email" | "pin">("phone");
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  function handlePhoneEmail() {
    const value = identifier.trim();

    if (!value) {
      setError(
        method === "phone"
          ? "Entre ton numéro de téléphone."
          : "Entre ton adresse email.",
      );
      return;
    }

    setError("");

    if (method === "phone") {
      loginWithPhone(value);
    } else {
      loginWithEmail(value);
    }
  }

  function handlePin() {
    if (pin.length < 4) {
      setError("Le code PIN doit contenir au moins 4 chiffres.");
      return;
    }

    setError("");

    if (hasPinSet()) {
      const success = loginWithPin(pin);

      if (!success) {
        setError("Code PIN incorrect.");
      }
    } else {
      createPin(pin);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full flame-bg text-3xl">
            🍗
          </div>

          <h1 className="font-display text-4xl tracking-wide">
            BIENVENUE CHEZ <span className="flame-text">BELCHIKEN</span>
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Connecte-toi pour accéder à ton espace et passer ta commande.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
          <div className="mb-6 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setMethod("phone");
                setError("");
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                method === "phone"
                  ? "flame-bg text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Téléphone
            </button>

            <button
              type="button"
              onClick={() => {
                setMethod("email");
                setError("");
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                method === "email"
                  ? "flame-bg text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Email
            </button>

            <button
              type="button"
              onClick={() => {
                setMethod("pin");
                setError("");
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                method === "pin"
                  ? "flame-bg text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              PIN
            </button>
          </div>

          {method !== "pin" ? (
            <>
              <label className="mb-2 block text-sm font-medium">
                {method === "phone"
                  ? "Numéro de téléphone"
                  : "Adresse email"}
              </label>

              <input
                type={method === "phone" ? "tel" : "email"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  method === "phone"
                    ? "+226 XX XX XX XX"
                    : "ton@email.com"
                }
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePhoneEmail();
                  }
                }}
              />

              <button
                type="button"
                onClick={handlePhoneEmail}
                className="mt-4 w-full rounded-md flame-bg px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                Continuer
              </button>
            </>
          ) : (
            <>
              <label className="mb-2 block text-sm font-medium">
                {hasPinSet() ? "Ton code PIN" : "Créer un code PIN"}
              </label>

              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, ""))
                }
                placeholder="••••"
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePin();
                  }
                }}
              />

              <button
                type="button"
                onClick={handlePin}
                className="mt-4 w-full rounded-md flame-bg px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                {hasPinSet() ? "Se connecter" : "Créer mon PIN"}
              </button>
            </>
          )}

          {error && (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Belchiken · Poulet frit croustillant à Ouagadougou
        </p>
      </div>
    </div>
  );
}