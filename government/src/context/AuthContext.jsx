import { createContext, useContext, useState, useCallback } from "react";

// DEMO AUTH — not production security. Swap sendOtp/verifyOtp for a real SMS
// provider (Firebase Phone Auth, MSG91, Twilio Verify) and officer login for
// a real backend + JWT before going anywhere near production.

const AuthContext = createContext(null);
const AUTH_KEY = "pashurakshak_auth_v1";

export const ROLES = {
  FARMER: "FARMER",
  OFFICER: "OFFICER",
  GOVT: "GOVT",
};

// Hardcoded demo officer/govt accounts — issued by the department in real life.
const STAFF_ACCOUNTS = [
  { id: "VET001", password: "vet123", name: "Dr. Anjali Sharma", role: ROLES.OFFICER },
  { id: "VET002", password: "vet123", name: "Dr. Rakesh Kumar", role: ROLES.OFFICER },
  { id: "GOV001", password: "gov123", name: "Suresh Patil (District Office)", role: ROLES.GOVT },
];

function loadUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [pendingOtp, setPendingOtp] = useState(null); // { phone, otp }

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    else localStorage.removeItem(AUTH_KEY);
  };

  // --- Farmer flow: phone + OTP ---
  const sendOtp = useCallback((phone) => {
    const otp = String(Math.floor(1000 + Math.random() * 9000)); // 4-digit demo OTP
    setPendingOtp({ phone, otp });
    // In production: call SMS provider here. For the demo we just return it
    // so the UI can display it (simulating "received" SMS).
    return otp;
  }, []);

  const verifyOtp = useCallback(
    (phone, code, name) => {
      if (!pendingOtp || pendingOtp.phone !== phone || pendingOtp.otp !== code) {
        return { ok: false, error: "Incorrect OTP" };
      }
      const farmerUser = { id: phone, name: name || "Farmer", role: ROLES.FARMER, phone };
      persist(farmerUser);
      setPendingOtp(null);
      return { ok: true };
    },
    [pendingOtp]
  );

  // --- Officer / Govt flow: ID + password ---
  const staffLogin = useCallback((staffId, password) => {
    const match = STAFF_ACCOUNTS.find(
      (a) => a.id.toLowerCase() === staffId.trim().toLowerCase() && a.password === password
    );
    if (!match) return { ok: false, error: "Invalid ID or password" };
    persist({ id: match.id, name: match.name, role: match.role });
    return { ok: true };
  }, []);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, sendOtp, verifyOtp, staffLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}