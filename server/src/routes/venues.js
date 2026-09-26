import { Router } from 'express';
import { VENUES } from '../seed.js';
import { haversine } from '../geo.js';

const router = Router();

// GET /api/venues?sport=Football&lat=&lng=&radiusKm=25
router.get('/', (req, res) => {
  const { sport, lat, lng, radiusKm = 25 } = req.query;

  let venues = [...VENUES];
  if (sport && sport !== 'All') {
    venues = venues.filter((v) => v.sports.includes(sport));
  }

  const userLat = lat != null ? Number(lat) : null;
  const userLng = lng != null ? Number(lng) : null;

  if (userLat != null && userLng != null) {
    venues = venues
      .map((v) => ({ ...v, distance: haversine(userLat, userLng, v.latitude, v.longitude) }))
      .filter((v) => v.distance <= Number(radiusKm))
      .sort((a, b) => a.distance - b.distance);
  }

  res.json(venues);
});

export default router;
