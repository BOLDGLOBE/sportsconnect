// SportsConnect futuristic theme — dark space + neon accents.
// Every page/component imports these so the whole app stays consistent.
export const T = {
  // Base surfaces
  bg: '#05060f',
  panel: 'rgba(13, 18, 38, 0.72)',
  panelSolid: '#0b1020',
  panelDeep: '#070b18',

  // Lines
  border: 'rgba(0, 245, 255, 0.14)',
  borderBright: 'rgba(0, 245, 255, 0.45)',
  borderPink: 'rgba(255, 45, 149, 0.35)',

  // Neon accents
  neon: '#00f5ff',
  neon2: '#b026ff',
  pink: '#ff2d95',
  green: '#39ff88',
  amber: '#ffb020',
  red: '#ff4d6d',

  // Text
  text: '#e6edf7',
  muted: '#8ea0c0',

  // Effects
  grad: 'linear-gradient(135deg, #00f5ff 0%, #7b2ff7 55%, #b026ff 100%)',
  gradSoft: 'linear-gradient(135deg, rgba(0,245,255,0.16) 0%, rgba(176,38,255,0.16) 100%)',
  glow: '0 0 18px rgba(0, 245, 255, 0.22)',
  glowPink: '0 0 18px rgba(255, 45, 149, 0.3)',
  cardGlow: '0 10px 34px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(0, 245, 255, 0.08)',
  fontDisplay: "'Orbitron', 'Segoe UI', sans-serif",
  fontBody: "'Rajdhani', 'Segoe UI', sans-serif",
};

// Reusable composite styles
export const glass = {
  background: T.panel,
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: `1px solid ${T.border}`,
  borderRadius: '16px',
  boxShadow: T.cardGlow,
};

export const neonBtn = {
  background: T.grad,
  color: '#04101c',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: T.glow,
  fontFamily: T.fontDisplay,
  letterSpacing: '0.5px',
};

export const ghostBtn = {
  background: 'rgba(0, 245, 255, 0.06)',
  color: T.neon,
  border: `1px solid ${T.border}`,
  borderRadius: '10px',
  fontWeight: 'bold',
  cursor: 'pointer',
};
