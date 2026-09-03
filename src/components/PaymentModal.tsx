import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import {
  simulateSendOtp,
  simulateVerifyOtp,
  buildReceipt,
  PAYMENT_METHODS,
  type PaymentMethod,
  type PaymentReceipt,
} from "@/lib/payment";
import { formatFCFA } from "@/lib/menu";

type Step = "confirm" | "otp" | "processing" | "done";

export function PaymentModal({
  method,
  amount,
  initialPhone,
  onClose,
  onSuccess,
}: {
  method: PaymentMethod;
  amount: number;
  initialPhone: string;
  onClose: () => void;
  onSuccess: (receipt: PaymentReceipt) => void;
}) {
  const [step, setStep] = useState<Step>("confirm");
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  const meta = PAYMENT_METHODS.find((m) => m.id === method)!;

  async function handleSendOtp() {
    if (phone.trim().length < 8) {
      setError("Numéro de téléphone invalide.");
      return;
    }
    setError("");
    setStep("processing");
    await simulateSendOtp(phone);
    setStep("otp");
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length !== 4) {
      setError("Entrez les 4 chiffres du code.");
      return;
    }
    setError("");
    setStep("processing");
    const ok = await simulateVerifyOtp(code);
    if (!ok) {
      setError("Code incorrect, réessayez.");
      setStep("otp");
      return;
    }
    const r = buildReceipt(method, phone, amount);
    setReceipt(r);
    setStep("done");
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: meta.color }}
            />
            <h2 className="font-display text-xl tracking-wide">{meta.label}</h2>
          </div>
          {step !== "processing" && (
            <button onClick={onClose} aria-label="Fermer" className="text-muted-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          Paiement simulé — démo en attendant l'activation de l'API {meta.label}.
        </p>

        <div className="mt-5 rounded-md bg-background p-4 text-center">
          <p className="text-xs text-muted-foreground">Montant à payer</p>
          <p className="font-display text-2xl text-gold">{formatFCFA(amount)}</p>
        </div>

        {step === "confirm" && (
          <div className="mt-5 space-y-3">
            <label className="text-xs font-medium text-muted-foreground">
              Numéro {meta.label}
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex : 07 00 00 00"
              className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              onClick={handleSendOtp}
              className="w-full rounded-sm py-3 text-sm font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: meta.color }}
            >
              Recevoir le code
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="mt-5 space-y-3">
            <label className="text-xs font-medium text-muted-foreground">
              Code reçu par SMS
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  maxLength={1}
                  inputMode="numeric"
                  className="h-12 w-12 rounded-sm border border-border bg-background text-center text-lg outline-none focus:border-primary"
                />
              ))}
            </div>
            {error && <p className="text-center text-xs text-destructive">{error}</p>}
            <button
              onClick={handleVerify}
              className="w-full rounded-sm py-3 text-sm font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: meta.color }}
            >
              Confirmer le paiement
            </button>
          </div>
        )}

        {step === "processing" && (
          <div className="mt-8 flex flex-col items-center gap-3 pb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Traitement en cours…</p>
          </div>
        )}

        {step === "done" && receipt && (
          <div className="mt-5 space-y-4">
            <div className="flex flex-col items-center gap-2 py-2">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
              <p className="font-display text-lg">Paiement confirmé</p>
            </div>
            <div className="space-y-1 rounded-md bg-background p-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Réf. transaction</span>
                <span className="font-medium text-foreground">{receipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Numéro</span>
                <span className="font-medium text-foreground">{receipt.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant</span>
                <span className="font-medium text-foreground">{formatFCFA(receipt.amount)}</span>
              </div>
            </div>
            <button
              onClick={() => onSuccess(receipt)}
              className="w-full rounded-sm flame-bg py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
            >
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}