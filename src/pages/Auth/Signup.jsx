import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SPORTS } from '../../data/sports';
import { T, glass, neonBtn } from '../../theme';

export default function Signup() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    sport: 'Cricket',
    skillLevel: 'Beginner',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData);
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
        <p style={styles.subtitle}>JOIN THE NEXT-GEN ARENA</p>

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>FULL NAME</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Your Name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>PASSWORD</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
              required
              minLength={6}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>PRIMARY SPORT</label>
            <select
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              style={styles.input}
            >
              {SPORTS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.emoji} {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>SKILL LEVEL</label>
            <select
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              style={styles.input}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
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
            {loading ? 'CREATING ACCOUNT…' : '⚡ SIGN UP'}
          </button>
        </form>

        <p style={styles.link}>
          Already a member? <Link to="/login" style={styles.linkText}>LOGIN →</Link>
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
