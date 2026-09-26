const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('sc_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('sc_token', token);
  else localStorage.removeItem('sc_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

// ---- Auth ----
export async function signup({ email, password, displayName, sport, skillLevel }) {
  const data = await request('/auth/signup', {
    method: 'POST',
    body: { email, password, displayName, sport, skillLevel },
  });
  setToken(data.token);
  return data.user;
}

export async function login({ email, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setToken(data.token);
  return data.user;
}

export async function logout() {
  setToken(null);
}

// ---- Users ----
export async function getMyProfile() {
  return request('/users/me');
}

export async function updateMyProfile(updates) {
  return request('/users/me', { method: 'PUT', body: updates });
}

// ---- Matches ----
export async function getMatches({ sport, lat, lng, radiusKm = 50 } = {}) {
  const params = new URLSearchParams();
  if (sport && sport !== 'All') params.set('sport', sport);
  if (lat != null && lng != null) {
    params.set('lat', lat);
    params.set('lng', lng);
    params.set('radiusKm', radiusKm);
  }
  const qs = params.toString();
  return request(`/matches${qs ? `?${qs}` : ''}`);
}

export async function getMatchDetails(id) {
  return request(`/matches/${id}`);
}

export async function createMatch(matchData) {
  return request('/matches', { method: 'POST', body: matchData });
}

export async function joinMatch(matchId) {
  return request(`/matches/${matchId}/join`, { method: 'POST' });
}

export async function leaveMatch(matchId) {
  return request(`/matches/${matchId}/leave`, { method: 'POST' });
}

export async function deleteMatch(matchId) {
  return request(`/matches/${matchId}`, { method: 'DELETE' });
}

// ---- Venues (sports clubs) & top players ----
export async function getVenues({ sport, lat, lng, radiusKm = 25 } = {}) {
  const params = new URLSearchParams();
  if (sport && sport !== 'All') params.set('sport', sport);
  if (lat != null && lng != null) {
    params.set('lat', lat);
    params.set('lng', lng);
    params.set('radiusKm', radiusKm);
  }
  const qs = params.toString();
  return request(`/venues${qs ? `?${qs}` : ''}`);
}

export async function getTopPlayers(sport) {
  const qs = sport && sport !== 'All' ? `?sport=${encodeURIComponent(sport)}` : '';
  return request(`/users/top${qs}`);
}

export async function getNearbyPlayers({ lat, lng, sport, radiusKm = 50 } = {}) {
  const params = new URLSearchParams();
  params.set('lat', lat);
  params.set('lng', lng);
  if (sport && sport !== 'All') params.set('sport', sport);
  if (radiusKm) params.set('radiusKm', radiusKm);
  return request(`/users/nearby?${params.toString()}`);
}

export async function getSportsStats() {
  return request('/sports/stats');
}
