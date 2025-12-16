export const GAMES = [
  {
    id: 'futsal',
    name: 'Futsal',
    icon: '⚽',
    color: 'from-green-400 to-emerald-600',
    type: 'team',
    maxTeams: 8,
    hasGroupStage: true,
  },
  {
    id: 'netball',
    name: 'Netball',
    icon: '🏀',
    color: 'from-orange-400 to-red-600',
    type: 'team',
    maxTeams: 8,
    hasGroupStage: true,
  },
  {
    id: 'carrom',
    name: 'Carrom',
    icon: 'carrom-board',
    color: 'from-yellow-400 to-orange-600',
    type: 'individual',
    maxPlayers: 16,
    hasGroupStage: false,
  },
  {
    id: 'chess',
    name: 'Chess',
    icon: '♟️',
    color: 'from-gray-600 to-gray-900',
    type: 'individual',
    maxPlayers: 16,
    hasGroupStage: false,
  },
  {
    id: 'badminton',
    name: 'Badminton',
    icon: '🏸',
    color: 'from-blue-400 to-indigo-600',
    type: 'mixed-doubles',
    maxPairs: 8,
    hasGroupStage: false,
  },
  {
    id: 'esports',
    name: 'E-sports (FC26)',
    icon: '🎮',
    color: 'from-purple-400 to-pink-600',
    type: 'team',
    maxTeams: 8,
    hasGroupStage: true,
  },
  {
    id: 'darts',
    name: 'Darts',
    icon: '🎯',
    color: 'from-red-400 to-rose-600',
    type: 'individual',
    maxPlayers: 16,
    hasGroupStage: false,
  },
];

export const initialScheduleData = {
  futsal: [
    { id: 1, time: '9:00 AM', team1: 'Team A', team2: 'Team B', venue: 'Court 1', round: 'Quarter Final 1' },
    { id: 2, time: '10:30 AM', team1: 'Team C', team2: 'Team D', venue: 'Court 1', round: 'Quarter Final 2' },
    { id: 3, time: '12:00 PM', team1: 'Team E', team2: 'Team F', venue: 'Court 1', round: 'Quarter Final 3' },
    { id: 4, time: '1:30 PM', team1: 'Team G', team2: 'Team H', venue: 'Court 1', round: 'Quarter Final 4' },
  ],
  netball: [
    { id: 1, time: '9:00 AM', team1: 'Team A', team2: 'Team B', venue: 'Court 2', round: 'Quarter Final 1' },
    { id: 2, time: '10:30 AM', team1: 'Team C', team2: 'Team D', venue: 'Court 2', round: 'Quarter Final 2' },
  ],
  carrom: [
    { id: 1, time: '9:00 AM', player1: 'Player 1', player2: 'Player 2', venue: 'Hall A', round: 'Round of 16' },
    { id: 2, time: '9:30 AM', player1: 'Player 3', player2: 'Player 4', venue: 'Hall A', round: 'Round of 16' },
  ],
  chess: [
    { id: 1, time: '9:00 AM', player1: 'Player 1', player2: 'Player 2', venue: 'Hall B', round: 'Round of 16' },
    { id: 2, time: '10:00 AM', player1: 'Player 3', player2: 'Player 4', venue: 'Hall B', round: 'Round of 16' },
  ],
  badminton: [
    { id: 1, time: '9:00 AM', pair1: 'Pair A', pair2: 'Pair B', venue: 'Court 3', round: 'Quarter Final 1' },
    { id: 2, time: '10:00 AM', pair1: 'Pair C', pair2: 'Pair D', venue: 'Court 3', round: 'Quarter Final 2' },
  ],
  esports: [
    { id: 1, time: '9:00 AM', team1: 'Team A', team2: 'Team B', venue: 'Gaming Zone', round: 'Group Stage' },
    { id: 2, time: '9:30 AM', team1: 'Team C', team2: 'Team D', venue: 'Gaming Zone', round: 'Group Stage' },
  ],
  darts: [
    { id: 1, time: '9:00 AM', player1: 'Player 1', player2: 'Player 2', venue: 'Hall C', round: 'Round of 16' },
    { id: 2, time: '9:30 AM', player1: 'Player 3', player2: 'Player 4', venue: 'Hall C', round: 'Round of 16' },
  ],
};

export const initialResultsData = {
  futsal: [],
  netball: [],
  carrom: [],
  chess: [],
  badminton: [],
  esports: [],
  darts: [],
};
