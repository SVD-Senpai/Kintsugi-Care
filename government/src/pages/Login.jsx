import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";

const TABS = [
  { id: ROLES.FARMER, label: "🐄 Farmer" },
  { id: ROLES.OFFICER, label: "🩺 Vet Officer" },
  { id: ROLES.GOVT, label: "🏛️ Government" },
];

export default function Login() {
  const { sendOtp, verifyOtp, staffLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(ROLES.FARMER);

  // farmer state
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // staff state
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const redirectTo = (role) => {
    const dest = location.state?.from?.pathname || (role === ROLES.FARMER ? "/report" : "/officer");
    navigate(dest, { replace: true });
  };

  const handleSendOtp = () => {
    setError("");
    if (phone.trim().length < 10) return setError("Enter a valid 10-digit phone number");
    const otp = sendOtp(phone.trim());
    setDemoOtp(otp); // demo only — shown on screen instead of actually texted
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    const res = verifyOtp(phone.trim(), otpInput.trim(), name.trim());
    if (!res.ok) return setError(res.error);
    redirectTo(ROLES.FARMER);
  };

  const handleStaffLogin = () => {
    setError("");
    const res = staffLogin(staffId, password);
    if (!res.ok) return setError(res.error);
    redirectTo(tab);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-card__title">Sign in to Kintsugi Care</h1>

        <div className="login-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`login-tab ${tab === t.id ? "login-tab--active" : ""}`}
              onClick={() => {
                setTab(t.id);
                setError("");
                setOtpSent(false);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && <div className="login-error">{error}</div>}

        {tab === ROLES.FARMER ? (
          !otpSent ? (
            <>
              <div className="field-group">
                <label className="field-label">Your name</label>
                <input className="text-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ram Singh" />
              </div>
              <div className="field-group">
                <label className="field-label">Phone number</label>
                <input className="text-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" inputMode="numeric" maxLength={10} />
              </div>
              <button className="btn btn--primary" onClick={handleSendOtp}>Send OTP</button>
            </>
          ) : (
            <>
              <p className="login-otp-demo">📩 Demo mode — your OTP is <strong>{demoOtp}</strong> (a real SMS provider replaces this in production)</p>
              <div className="field-group">
                <label className="field-label">Enter OTP</label>
                <input className="text-input" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={4} inputMode="numeric" />
              </div>
              <button className="btn btn--primary" onClick={handleVerifyOtp}>Verify & Continue</button>
            </>
          )
        ) : (
          <>
            <div className="field-group">
              <label className="field-label">{tab === ROLES.OFFICER ? "Officer ID" : "Government ID"}</label>
              <input className="text-input" value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="e.g. VET001" />
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <input type="password" className="text-input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn--primary" onClick={handleStaffLogin}>Sign in</button>
            <p className="login-hint">Demo accounts: VET001 / vet123, GOV001 / gov123</p>
          </>
        )}
      </div>
    </div>
  );
}