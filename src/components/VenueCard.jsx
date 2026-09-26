import React from 'react';
import { T, glass } from '../theme';

export default function VenueCard({ venue }) {
  const stars = '⭐'.repeat(Math.round(venue.rating || 0));

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.iconBox}>🏟️</div>
        <div style={styles.headerInfo}>
          <h3 style={styles.name}>{venue.name}</h3>
          <p style={styles.type}>{venue.type} • {venue.sports.join(', ')}</p>
        </div>
        {venue.distance != null && (
          <span style={styles.distance}>{venue.distance.toFixed(1)} km</span>
        )}
      </div>

      <div style={styles.metaRow}>
        <span style={styles.rating}>
          {stars} {venue.rating?.toFixed(1)} <span style={styles.reviewCount}>({venue.reviews})</span>
        </span>
        <span style={venue.openNow ? styles.openBadge : styles.closedBadge}>
          {venue.openNow ? 'OPEN NOW' : 'CLOSED'}
        </span>
      </div>

      <p style={styles.address}>📍 {venue.address}</p>
      {venue.phone && <p style={styles.phone}>📞 {venue.phone}</p>}

      <div style={styles.priceRow}>
        <span style={styles.price}>{'₹'.repeat(venue.priceLevel || 1)}{'·'.repeat(3 - (venue.priceLevel || 1))}</span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + venue.address)}`}
          target="_blank"
          rel="noreferrer"
          style={styles.mapLink}
        >
          OPEN IN MAPS ↗
        </a>
      </div>
    </div>
  );
}

const styles = {
  card: {
    ...glass,
    padding: '16px 20px',
    marginBottom: '14px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '10px',
  },
  iconBox: {
    fontSize: '26px',
    filter: 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.35))',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    margin: 0,
    fontSize: '15px',
    fontFamily: T.fontDisplay,
    letterSpacing: '0.5px',
    color: T.text,
  },
  type: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    color: T.muted,
  },
  distance: {
    background: 'rgba(0, 245, 255, 0.08)',
    color: T.neon,
    border: `1px solid ${T.border}`,
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '4px 10px',
    borderRadius: '12px',
    whiteSpace: 'nowrap',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  rating: {
    fontSize: '13px',
    color: T.amber,
    fontWeight: 'bold',
  },
  reviewCount: {
    color: T.muted,
    fontWeight: 'normal',
    fontSize: '12px',
  },
  openBadge: {
    fontSize: '10px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
    color: T.green,
    background: 'rgba(57, 255, 136, 0.08)',
    border: '1px solid rgba(57, 255, 136, 0.3)',
    padding: '3px 10px',
    borderRadius: '10px',
  },
  closedBadge: {
    fontSize: '10px',
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '1px',
    color: T.red,
    background: 'rgba(255, 77, 109, 0.08)',
    border: '1px solid rgba(255, 77, 109, 0.3)',
    padding: '3px 10px',
    borderRadius: '10px',
  },
  address: {
    fontSize: '13px',
    color: T.muted,
    margin: '4px 0',
  },
  phone: {
    fontSize: '13px',
    color: T.muted,
    margin: '4px 0',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${T.border}`,
  },
  price: {
    fontSize: '13px',
    color: T.green,
    letterSpacing: '2px',
  },
  mapLink: {
    fontSize: '12px',
    color: T.neon,
    fontWeight: 'bold',
    fontFamily: T.fontDisplay,
    letterSpacing: '0.5px',
    textShadow: T.glow,
  },
};
