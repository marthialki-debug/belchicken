import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const AUTH_KEY = "belchiken.auth.v1";
const PIN_KEY = "belchiken.pin.v1";

type AuthMethod = "phone" | "email" | "pin";
type AuthState = { authenticated: boolean; method: AuthMethod | null; identifier: string | null };

function readAuth(): AuthState {
  if (typeof window === "undefined") return { authenticated: false, method: null, identifier: null };
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : { authenticated: false, method: null, identifier: null };
  } catch {
    return { authenticated: false, method: null, identifier: null };
  }
}

type AuthContextValue = {
  authenticated: boolean;
  hydrated: boolean;
  identifier: string | null;
  loginWithPhone: (phone: string) => void;
  loginWithEmail: (email: string) => void;
  hasPinSet: () => boolean;
  createPin: (pin: string) => void;
  loginWithPin: (pin: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ authenticated: false, method: null, identifier: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readAuth());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  function loginWithPhone(phone: string) {
    setState({ authenticated: true, method: "phone", identifier: phone });
  }
  function loginWithEmail(email: string) {
    setState({ authenticated: true, method: "email", identifier: email });
  }
  function hasPinSet() {
    if (typeof window === "undefined") return false;
    return !!window.localStorage.getItem(PIN_KEY);
  }
  function createPin(pin: string) {
    window.localStorage.setItem(PIN_KEY, pin);
    setState({ authenticated: true, method: "pin", identifier: "Code PIN" });
  }
  function loginWithPin(pin: string) {
    const saved = window.localStorage.getItem(PIN_KEY);
    if (saved === pin) {
      setState({ authenticated: true, method: "pin", identifier: "Code PIN" });
      return true;
    }
    return false;
  }
  function logout() {
    setState({ authenticated: false, method: null, identifier: null });
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated: state.authenticated,
        hydrated,
        identifier: state.identifier,
        loginWithPhone,
        loginWithEmail,
        hasPinSet,
        createPin,
        loginWithPin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}