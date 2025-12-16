import { useState, useMemo } from 'react';
import { useEvent } from '../context/EventContext';
import { GAMES } from '../data/gamesData';
import { Trophy, TrendingUp } from 'lucide-react';
import CarromIcon from '../components/CarromIcon';

const Standings = () => {
  const { schedules, results } = useEvent();
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);

  const selectedGameData = GAMES.find(g => g.id === selectedGame);
  const currentResults = results[selectedGame] || [];
  const currentSchedules = schedules[selectedGame] || [];

  // Get all groups that have schedules
  const getAvailableGroups = () => {
    const groups = new Set();
    currentSchedules.forEach(schedule => {
      if (schedule.round && schedule.round.startsWith('Group ')) {
        groups.add(schedule.round);
      }
    });
    return Array.from(groups).sort();
  };

  const availableGroups = useMemo(() => getAvailableGroups(), [currentSchedules]);

  // Calculate standings for a specific group
  const calculateGroupStandings = (groupName) => {
    const teamStats = {};

    // Only process results for this specific group
    const groupResults = currentResults.filter(result => result.round === groupName);

    groupResults.forEach(result => {
      const { team1, team2, score1, score2, winner, isDraw } = result;

      // Initialize teams if not exists
      if (!teamStats[team1]) {
        teamStats[team1] = {
          name: team1,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      }
      if (!teamStats[team2]) {
        teamStats[team2] = {
          name: team2,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      }

      // Update played matches
      teamStats[team1].played++;
      teamStats[team2].played++;

      // Parse scores
      const goals1 = score1 ? parseInt(score1) : 0;
      const goals2 = score2 ? parseInt(score2) : 0;

      // Update goals
      teamStats[team1].goalsFor += goals1;
      teamStats[team1].goalsAgainst += goals2;
      teamStats[team2].goalsFor += goals2;
      teamStats[team2].goalsAgainst += goals1;

      // Determine winner and update stats
      if (isDraw || winner === 'draw') {
        // Draw
        teamStats[team1].drawn++;
        teamStats[team2].drawn++;
        teamStats[team1].points += 1;
        teamStats[team2].points += 1;
      } else if (winner === 1) {
        // Team 1 wins
        teamStats[team1].won++;
        teamStats[team2].lost++;
        teamStats[team1].points += 3;
      } else if (winner === 2) {
        // Team 2 wins
        teamStats[team2].won++;
        teamStats[team1].lost++;
        teamStats[team2].points += 3;
      }

      // Update goal difference
      teamStats[team1].goalDifference = teamStats[team1].goalsFor - teamStats[team1].goalsAgainst;
      teamStats[team2].goalDifference = teamStats[team2].goalsFor - teamStats[team2].goalsAgainst;
    });

    // Convert to array and sort by points, then goal difference, then goals for
    return Object.values(teamStats).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  };

  // Render a standings table for a specific group
  const renderGroupTable = (groupName) => {
    const standings = calculateGroupStandings(groupName);

    if (!standings || standings.length === 0) return null;

    return (
      <div key={groupName} className="mb-8 last:mb-0">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Trophy className="text-purple-600 mr-2" size={24} />
          {groupName}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <th className="px-4 py-3 text-left font-semibold">Pos</th>
                <th className="px-4 py-3 text-left font-semibold">Team</th>
                <th className="px-4 py-3 text-center font-semibold">P</th>
                <th className="px-4 py-3 text-center font-semibold">W</th>
                <th className="px-4 py-3 text-center font-semibold">D</th>
                <th className="px-4 py-3 text-center font-semibold">L</th>
                <th className="px-4 py-3 text-center font-semibold">GF</th>
                <th className="px-4 py-3 text-center font-semibold">GA</th>
                <th className="px-4 py-3 text-center font-semibold">GD</th>
                <th className="px-4 py-3 text-center font-semibold bg-yellow-500">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr
                  key={team.name}
                  className={`border-b transition-all hover:bg-purple-50 ${
                    index === 0 ? 'bg-yellow-50 font-semibold' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    <div
                      className={`flex items-center justify-center ${
                        index === 0 ? 'text-yellow-600' : 'text-gray-700'
                      }`}
                    >
                      {index + 1}
                      {index === 0 && <Trophy size={16} className="ml-1" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{team.name}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{team.played}</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">{team.won}</td>
                  <td className="px-4 py-3 text-center text-yellow-600">{team.drawn}</td>
                  <td className="px-4 py-3 text-center text-red-600">{team.lost}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{team.goalsFor}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{team.goalsAgainst}</td>
                  <td className={`px-4 py-3 text-center font-semibold ${
                    team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-lg bg-yellow-100">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGameIcon = (game) => {
    if (game.icon === 'carrom-board') {
      return <CarromIcon className="w-10 h-10 mx-auto mb-2" />;
    }
    return <div className="text-4xl mb-2">{game.icon}</div>;
  };

  return (
    <div className="space-y-6 slide-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Standings</h2>
        <p className="text-gray-600">Group stage tables and knockout brackets</p>
      </div>

      {/* Game Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            className={`game-card p-6 rounded-xl shadow-md transition-all ${
              selectedGame === game.id
                ? `bg-gradient-to-br ${game.color} text-white scale-105`
                : 'bg-white text-gray-700 hover:shadow-lg'
            }`}
          >
            {renderGameIcon(game)}
            <div className="font-semibold text-sm text-center">{game.name}</div>
          </button>
        ))}
      </div>

      {/* Standings Display */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="text-yellow-500" size={32} />
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{selectedGameData.name} Standings</h3>
            <p className="text-gray-600">
              {selectedGameData.hasGroupStage ? 'Group Stage Tables' : 'Knockout Stage'}
            </p>
          </div>
        </div>

        {selectedGameData.hasGroupStage && availableGroups.length > 0 ? (
          /* Group Stage Tables */
          <div>
            {availableGroups.map(groupName => renderGroupTable(groupName))}

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Table Legend:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div><strong>P:</strong> Played</div>
                <div><strong>W:</strong> Won</div>
                <div><strong>D:</strong> Drawn</div>
                <div><strong>L:</strong> Lost</div>
                <div><strong>GF:</strong> Goals For</div>
                <div><strong>GA:</strong> Goals Against</div>
                <div><strong>GD:</strong> Goal Difference</div>
                <div><strong>Pts:</strong> Points (Win: 3, Draw: 1, Loss: 0)</div>
              </div>
            </div>
          </div>
        ) : selectedGameData.hasGroupStage && availableGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-xl">No group stage matches scheduled yet</p>
            <p className="text-sm mt-2">Schedule group matches to see standings tables</p>
          </div>
        ) : (
          /* Knockout Bracket View */
          <div className="text-center py-12 text-gray-500">
            <Trophy className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-xl">Knockout Stage</p>
            <p className="text-sm mt-2">This game uses a knockout format. Check the Results page for match outcomes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Standings;
