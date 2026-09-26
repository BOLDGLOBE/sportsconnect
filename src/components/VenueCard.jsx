import React from 'react';

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
          {venue.openNow ? 'Open now' : 'Closed'}
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
          Open in Maps ↗
        </a>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '10px',
  },
  iconBox: {
    fontSize: '28px',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    margin: 0,
    fontSize: '16px',
    color: '#333',
  },
  type: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    color: '#888',
  },
  distance: {
    background: '#eef0fb',
    color: '#667eea',
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
    color: '#f39c12',
    fontWeight: 'bold',
  },
  reviewCount: {
    color: '#999',
    fontWeight: 'normal',
    fontSize: '12px',
  },
  openBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#27ae60',
    background: '#e8f8f0',
    padding: '3px 10px',
    borderRadius: '10px',
  },
  closedBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#e74c3c',
    background: '#fdecea',
    padding: '3px 10px',
    borderRadius: '10px',
  },
  address: {
    fontSize: '13px',
    color: '#666',
    margin: '4px 0',
  },
  phone: {
    fontSize: '13px',
    color: '#666',
    margin: '4px 0',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: '1px solid #f0f0f0',
  },
  price: {
    fontSize: '13px',
    color: '#27ae60',
    letterSpacing: '2px',
  },
  mapLink: {
    fontSize: '13px',
    color: '#667eea',
    fontWeight: 'bold',
  },
};
