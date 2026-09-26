// The SportsConnect sports catalog: about text, legends (popular players),
// and how each sport is highlighted across the app.
// `popularity` drives the "MOST HOSTED" / trending badges and sort order.
export const SPORTS = [
  {
    name: 'Cricket',
    emoji: '🏏',
    popularity: 100,
    tagline: "India's heartbeat game — now with neon",
    accent: '#ffb020',
    about:
      'Cricket is the most followed sport in India, played everywhere from Marina Beach to rooftop turfs. Two teams of eleven face off with bat and ball across formats that last from 3 hours (T20) to 5 days (Tests). In street and beach cricket the rules bend, but the passion never does.',
    rules: [
      'Batting side scores runs; bowling side takes 10 wickets',
      'T20 = 20 overs each side, the fastest craze',
      'Six over the rope = 6 runs, the crowd-roarer',
    ],
    legends: [
      { name: 'Virat Kohli', note: 'Modern batting machine · 50+ ODI centuries' },
      { name: 'MS Dhoni', note: 'Captain Cool · finisher of a generation' },
      { name: 'Sachin Tendulkar', note: 'The Little Master · 100 international tons' },
    ],
  },
  {
    name: 'Football',
    emoji: '⚽',
    popularity: 96,
    tagline: 'The world game — 90 minutes, infinite drama',
    accent: '#39ff88',
    about:
      "Football (soccer) is the planet's most played sport: 11-a-side, 90 minutes, one ball. In India the 7-a-side turf version explodes every evening — quick, scrappy, and social. All you need is a ball and two goalposts.",
    rules: [
      'Two teams of 11; most goals in 90 minutes wins',
      'No hands unless you are the goalkeeper',
      'Offside keeps attackers honest behind the last defender',
    ],
    legends: [
      { name: 'Lionel Messi', note: '8× Ballon d\u2019Or · World Cup 2022 winner' },
      { name: 'Cristiano Ronaldo', note: 'All-time top international scorer' },
      { name: 'Sunil Chhetri', note: 'Indian captain · all-time national top scorer' },
    ],
  },
  {
    name: 'Badminton',
    emoji: '🏸',
    popularity: 84,
    tagline: 'Fastest racket sport on Earth',
    accent: '#00f5ff',
    about:
      'Badminton shuttles can leave the racket at over 400 km/h, making this the fastest racket sport in the world. India has become a powerhouse thanks to academy culture — and every apartment gym has two courts waiting for a rally.',
    rules: [
      'Rally scoring to 21; win 2 of 3 games',
      'Serve underhand, diagonally across the court',
      'Singles, doubles, or mixed doubles formats',
    ],
    legends: [
      { name: 'PV Sindhu', note: 'Olympic silver + bronze · world champion' },
      { name: 'Saina Nehwal', note: 'First Indian to reach world No. 1' },
      { name: 'Lin Dan', note: 'Two-time Olympic champion · Super Dan' },
    ],
  },
  {
    name: 'Basketball',
    emoji: '🏀',
    popularity: 72,
    tagline: 'Vertical poetry — 5 on 5 in the paint',
    accent: '#ff2d95',
    about:
      'Invented in 1891 with peach baskets, basketball is now a global dance of speed, height, and handles. Street courts across Indian cities host 3×3 half-court games that need just one hoop and endless energy.',
    rules: [
      'Score by shooting the ball through the hoop',
      'Dribble while moving; no travelling',
      '24 seconds to attempt a shot in the NBA/FIBA',
    ],
    legends: [
      { name: 'Michael Jordan', note: '6× NBA champion · the GOAT debate starter' },
      { name: 'LeBron James', note: 'All-time NBA scoring leader' },
      { name: 'Satnam Singh', note: 'First Indian drafted into the NBA' },
    ],
  },
  {
    name: 'Tennis',
    emoji: '🎾',
    popularity: 65,
    tagline: 'One-on-one gladiator chess',
    accent: '#b026ff',
    about:
      'Tennis is a duel of geometry and nerve — serve, rally, and break your opponent\u2019s rhythm. India\u2019s Davis Cup story runs deep, and club academies in every metro keep the sport thriving from age 5 to 75.',
    rules: [
      'Points go 15 → 30 → 40 → game; win 6 games for a set',
      'Serve alternates between deuce and ad courts',
      'Best of 3 sets for most pro matches',
    ],
    legends: [
      { name: 'Roger Federer', note: '20 Grand Slams · pure artistry' },
      { name: 'Serena Williams', note: '23 Grand Slams · the most dominant ever' },
      { name: 'Leander Paes', note: '18 Grand Slam doubles titles for India' },
    ],
  },
  {
    name: 'Volleyball',
    emoji: '🏐',
    popularity: 48,
    tagline: 'Keep it off the sand, over the net',
    accent: '#7b2ff7',
    about:
      'Beach volleyball over Marina sands and proper 6-a-side indoor leagues both live here. Low cost, high rallies — the spike-and-block duel makes it one of the most social sports ever played.',
    rules: [
      'Six players per side, three touches max before the ball crosses',
      'Rally scoring to 25, best of 5 sets',
      'Rotate positions clockwise after winning a serve',
    ],
    legends: [
      { name: 'Karch Kiraly', note: 'Only player with Olympic gold indoor + beach' },
      { name: 'Jimmy George', note: 'India\u2019s greatest volleyball son' },
      { name: 'Kerri Walsh Jennings', note: '3× Olympic beach champion' },
    ],
  },
  {
    name: 'Kabaddi',
    emoji: '🤼',
    popularity: 41,
    tagline: 'Ancient Indian raid, prime-time spotlight',
    accent: '#ff4d6d',
    about:
      'One raider, seven defenders, a chant of "kabaddi, kabaddi" — a 4,000-year-old Indian sport now packed into the Pro Kabaddi League\u2019s neon arenas. Pure strength, breath control, and strategy.',
    rules: [
      'Raider crosses the line, tags defenders, and returns alive',
      'Defenders tackle to stop the raider before home',
      'Teams of 7 on court; 40-minute halves',
    ],
    legends: [
      { name: 'Pardeep Narwal', note: 'Dubki King · most raid points in PKL' },
      { name: 'Anup Kumar', note: 'Captain of the golden Indian era' },
      { name: 'Ajay Thakur', note: '2016 World Cup final hero' },
    ],
  },
  {
    name: 'Hockey',
    emoji: '🏑',
    popularity: 36,
    tagline: "India's original Olympic obsession",
    accent: '#00d97e',
    about:
      "India's 8 Olympic gold medals make hockey its most decorated sport. Astro-turf hockey is lightning fast — 11 players, curved sticks, and passing chains that move faster than the eye.",
    rules: [
      '11-a-side, 4 quarters of 15 minutes',
      'Goals only from inside the shooting circle',
      'Penalty corners are set-piece rockets',
    ],
    legends: [
      { name: 'Dhyan Chand', note: 'The Wizard · 3 Olympic golds' },
      { name: 'Major Singh', note: 'Drag-flick era icon' },
      { name: 'Balbir Singh Sr.', note: 'Olympic champion across 3 Games' },
    ],
  },
];

// Quick lookup helper
export const sportByName = (name) => SPORTS.find((s) => s.name === name) || null;

// Sports ranked by popularity (used for hero strip + filter pills)
export const popularSports = [...SPORTS].sort((a, b) => b.popularity - a.popularity);

// Sports considered "most hosted" — top 3 get a highlighted badge
export const HOT_SPORTS = popularSports.slice(0, 3).map((s) => s.name);
