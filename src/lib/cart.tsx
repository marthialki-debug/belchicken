import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./menu";

export type CartItem = {
  lineId: string;
  productId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  optionLabels: string[];
  image: string;
};

export type Order = {
  id: string;
  date: string;
  customer: { name: string; phone: string; address: string };
  zone: { id: string; name: string; fee: number };
  items: CartItem[];
  subtotal: number;
  total: number;
  payment?: {
    method: "orange_money" | "wave";
    transactionId: string;
    phone: string;
    status: "success";
  };
};

const CART_KEY = "belchiken.cart.v1";
const ORDERS_KEY = "belchiken.orders.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  addItem: (
    product: Product,
    selection: { optionLabels: string[]; extra: number },
    quantity: number,
  ) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  orders: Order[];
  saveOrder: (order: Omit<Order, "id" | "date">) => Order;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read<CartItem[]>(CART_KEY, []));
    setOrders(read<Order[]>(ORDERS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  const addItem = useCallback<CartContextValue["addItem"]>(
    (product, selection, quantity) => {
      const signature = `${product.id}|${selection.optionLabels.join(",")}`;
      setItems((prev) => {
        const existing = prev.find((i) => i.lineId === signature);
        if (existing) {
          return prev.map((i) =>
            i.lineId === signature ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [
          ...prev,
          {
            lineId: signature,
            productId: product.id,
            name: product.name,
            basePrice: product.price,
            unitPrice: product.price + selection.extra,
            quantity,
            optionLabels: selection.optionLabels,
            image: product.image,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.lineId !== lineId)
        : prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const saveOrder = useCallback<CartContextValue["saveOrder"]>((order) => {
    const full: Order = {
      ...order,
      id: `BC-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
    };
    setOrders((prev) => [full, ...prev]);
    return full;
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      hydrated,
      addItem,
      removeItem,
      setQuantity,
      clear,
      subtotal,
      count,
      orders,
      saveOrder,
    }),
    [items, hydrated, addItem, removeItem, setQuantity, clear, subtotal, count, orders, saveOrder],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
