export type PaymentMethod = "orange_money" | "wave";

export type PaymentReceipt = {
  transactionId: string;
  method: PaymentMethod;
  phone: string;
  amount: number;
  date: string;
  status: "success";
};

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; color: string }[] = [
  { id: "orange_money", label: "Orange Money", color: "#F97316" },
  { id: "wave", label: "Wave", color: "#00A3E0" },
];

function randomDigits(n: number) {
  let out = "";
  for (let i = 0; i < n; i++) out += Math.floor(Math.random() * 10);
  return out;
}

// --- SIMULATION ONLY : aucune vraie transaction n'est effectuée tant que ---
// --- les identifiants API Orange Money / Wave ne sont pas branchés ici.  ---

export function simulateSendOtp(_phone: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1100));
}

export function simulateVerifyOtp(code: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(code.length === 4), 1400);
  });
}

export function buildReceipt(
  method: PaymentMethod,
  phone: string,
  amount: number,
): PaymentReceipt {
  const prefix = method === "orange_money" ? "OM" : "WV";
  return {
    transactionId: `${prefix}-${randomDigits(8)}`,
    method,
    phone,
    amount,
    date: new Date().toISOString(),
    status: "success",
  };
}