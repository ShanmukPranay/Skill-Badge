import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      // Register the user
      await api.register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      
      // After successful registration, redirect to login
      nav("/login?registered=true");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">Skill<span>Bridge</span></div>
        <h1>Create account</h1>
        <p>Start with a diagnostic-driven learning path.</p>
        
        {error && <div className="error-banner">{error}</div>}
        
        <form onSubmit={submit} className="auth-form">
          <label>
            Full name
            <input 
              required 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
            />
          </label>
          
          <label>
            Email
            <input 
              type="email" 
              required 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          
          <label>
            Password
            <input 
              type="password" 
              required 
              minLength="6" 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
            />
          </label>
          
          <label>
            Confirm password
            <input 
              type="password" 
              required 
              value={form.confirm} 
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="Confirm your password"
            />
          </label>
          
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        
        <p className="auth-switch">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
