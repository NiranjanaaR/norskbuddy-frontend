import React, { useState } from "react";
import { login, signup, resetPassword } from "../firebase/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = async () => {
    try {
      await resetPassword(email);
      console.log("Password reset email requested for:", email);
      setMessage("Reset link sent to email ✅");
    } catch (err) {
      console.error("Reset error:", err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isSignup ? "Ny bruker" : "Logg inn"}</h2>

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        placeholder="Passord"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <div style={{ color: "red" }}>{error}</div>}
      {message && <div style={{ color: "green" }}>{message}</div>}

      <button type="submit">
        {isSignup ? "Opprett konto" : "Logg inn"}
      </button>

      {!isSignup && (
        <button type="button" onClick={handleReset}>
          Glemt passord?
        </button>
      )}

      <div style={{ marginTop: 10 }}>
        <button type="button" onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Har du konto? Logg inn"
            : "Ny bruker? Opprett konto"}
        </button>
      </div>
    </form>
  );
}
