import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { T, glass, neonBtn } from '../../theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/discover');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          ⚡ SPORTS<span style={{ color: T.pink }}>CONNECT</span>
        </h1>
        <p style={styles.subtitle}>ENTER THE ARENA. FIND YOUR SQUAD.</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...neonBtn,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'CONNECTING…' : '⚡ LOGIN'}
          </button>
        </form>

        <p style={styles.link}>
          New to the arena? <Link to="/signup" style={styles.linkText}>CREATE ACCOUNT →</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: T.fontBody,
  },
  card: {
    ...glass,
    padding: '40px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '24px',
    margin: '0 0 8px 0',
    fontFamily: T.fontDisplay,
    letterSpacing: '3px',
    textAlign: 'center',
    color: T.neon,
    textShadow: T.glow,
  },
  subtitle: {
    fontSize: '12px',
    color: T.muted,
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    textAlign: 'center',
    margin: '0 0 30px 0',
  },
  form: {
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '2px',
    marginBottom: '8px',
    color: T.muted,
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    border: `1px solid ${T.border}`,
    borderRadius: '10px',
    boxSizing: 'border-box',
    background: 'rgba(7, 11, 24, 0.85)',
    color: T.text,
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '13px',
    fontSize: '14px',
    letterSpacing: '1px',
  },
  error: {
    color: T.red,
    fontSize: '14px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    fontSize: '13px',
    color: T.muted,
  },
  linkText: {
    color: T.neon,
    fontFamily: T.fontDisplay,
    fontSize: '11px',
    letterSpacing: '1px',
    fontWeight: 'bold',
    textShadow: T.glow,
  },
};
