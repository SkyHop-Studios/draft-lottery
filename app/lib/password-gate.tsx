// components/PasswordGate.tsx
import React, { useState, useEffect } from "react";

const PasswordGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("authenticated");
    if (stored === "true") {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (passwordInput === import.meta.env.VITE_APP_PROTECTED_PASSWORD) {
      localStorage.setItem("authenticated", "true");
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Enter Password</h2>
      <input
        type="password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin} style={{ marginLeft: "0.5rem" }}>
        Enter
      </button>
    </div>
  );
};

export default PasswordGate;
