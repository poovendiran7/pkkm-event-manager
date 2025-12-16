import { useState } from 'react';
import { useEvent } from '../context/EventContext';
import { GAMES } from '../data/gamesData';
import { Trophy, Award, Medal } from 'lucide-react';
import CarromIcon from '../components/CarromIcon';

const Knockout = () => {
  const { schedules, results } = useEvent();
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);

  const selectedGameData = GAMES.find(g => g.id === selectedGame);
  const currentSchedules = schedules[selectedGame] || [];
  const currentResults = results[selectedGame] || [];

  const renderGameIcon = (game) => {
    if (game.icon === 'carrom-board') {
      return <CarromIcon className="w-10 h-10 mx-auto mb-2" />;
    }
    return <div className="text-4xl mb-2">{game.icon}</div>;
  };

  // Get knockout matches
  const knockoutRounds = {
    'Quarter Final 1': [],
    'Quarter Final 2': [],
    'Quarter Final 3': [],
    'Quarter Final 4': [],
    'Semifinal 1': [],
    'Semifinal 2': [],
    '3rd-4th Placing': [],
    'Final': []
  };

  currentSchedules.forEach(schedule => {
    if (schedule.round && knockoutRounds.hasOwnProperty(schedule.round)) {
      const result = currentResults.find(r => r.scheduleId === schedule.id);
      knockoutRounds[schedule.round].push({
        ...schedule,
        result: result || null
      });
    }
  });

  // Also include results that might not have schedules
  currentResults.forEach(result => {
    if (result.round && knockoutRounds.hasOwnProperty(result.round)) {
      const existsInSchedule = knockoutRounds[result.round].some(
        match => match.result && match.result.id === result.id
      );
      if (!existsInSchedule) {
        knockoutRounds[result.round].push({
          round: result.round,
          result: result,
          team1: result.team1,
          team2: result.team2,
          player1: result.player1,
          player2: result.player2,
          pair1: result.pair1,
          pair2: result.pair2,
        });
      }
    }
  });

  const getWinner = (match) => {
    if (!match || !match.result) return null;
    const { winner, isDraw, team1, team2, player1, player2, pair1, pair2 } = match.result;

    if (isDraw || winner === 'draw') return null;

    if (winner === 1) {
      return team1 || player1 || pair1;
    } else if (winner === 2) {
      return team2 || player2 || pair2;
    }
    return null;
  };

  const renderMatchCard = (match, index, isFinal = false, isThirdPlace = false) => {
    if (!match) {
      return (
        <div className="bg-gray-100 rounded-lg p-3 md:p-4 border-2 border-dashed border-gray-300 min-h-[90px] md:min-h-[100px] flex items-center justify-center">
          <span className="text-gray-400 text-xs md:text-sm">TBD</span>
        </div>
      );
    }

    const participant1 = match.team1 || match.player1 || match.pair1 || 'TBD';
    const participant2 = match.team2 || match.player2 || match.pair2 || 'TBD';
    const winner = getWinner(match);
    const score1 = match.result?.score1;
    const score2 = match.result?.score2;

    return (
      <div
        className={`rounded-lg p-2 md:p-3 border-2 transition-all ${
          isFinal
            ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-500 shadow-lg'
            : isThirdPlace
            ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400 shadow-md'
            : match.result
            ? 'bg-white border-purple-300 shadow-sm'
            : 'bg-gray-50 border-gray-300'
        }`}
      >
        <div className="space-y-1">
          <div className={`flex items-center justify-between px-2 md:px-3 py-2 md:py-2.5 rounded text-xs md:text-sm transition-all ${
            winner === participant1
              ? 'bg-green-500 text-white font-bold'
              : match.result
              ? 'bg-gray-100'
              : 'bg-white'
          }`}>
            <span className="truncate flex-1">{participant1}</span>
            {score1 !== null && score1 !== undefined && (
              <span className="ml-2 font-bold">{score1}</span>
            )}
          </div>
          <div className={`flex items-center justify-between px-2 md:px-3 py-2 md:py-2.5 rounded text-xs md:text-sm transition-all ${
            winner === participant2
              ? 'bg-green-500 text-white font-bold'
              : match.result
              ? 'bg-gray-100'
              : 'bg-white'
          }`}>
            <span className="truncate flex-1">{participant2}</span>
            {score2 !== null && score2 !== undefined && (
              <span className="ml-2 font-bold">{score2}</span>
            )}
          </div>
        </div>
        {match.time && (
          <div className="text-[10px] md:text-xs text-gray-500 mt-1 text-center">
            {match.time}
          </div>
        )}
      </div>
    );
  };

  const hasKnockoutData = Object.values(knockoutRounds).some(round => round.length > 0);
  const finalMatch = knockoutRounds['Final'][0];
  const thirdPlaceMatch = knockoutRounds['3rd-4th Placing'][0];
  const champion = finalMatch ? getWinner(finalMatch) : null;

  return (
    <div className="space-y-6 slide-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Knockout Stage</h2>
        <p className="text-gray-600">Tournament bracket visualization</p>
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

      {hasKnockoutData ? (
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 overflow-x-auto">
          <div className="flex items-center space-x-3 mb-6">
            <Trophy className="text-yellow-500" size={32} />
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">{selectedGameData.name} Tournament Bracket</h3>
              {champion && (
                <p className="text-green-600 font-semibold flex items-center gap-2 mt-1 text-sm md:text-base">
                  <Award size={20} />
                  Champion: {champion}
                </p>
              )}
            </div>
          </div>

          {/* Tournament Bracket - Simplified Vertical Layout */}
          <div className="space-y-8">
            {/* Quarter Finals */}
            <div>
              <h4 className="text-center font-bold text-purple-700 mb-4 text-lg uppercase">Quarter Finals</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderMatchCard(knockoutRounds['Quarter Final 1'][0], 0)}
                {renderMatchCard(knockoutRounds['Quarter Final 2'][0], 1)}
                {renderMatchCard(knockoutRounds['Quarter Final 3'][0], 2)}
                {renderMatchCard(knockoutRounds['Quarter Final 4'][0], 3)}
              </div>
            </div>

            {/* Semi Finals */}
            <div>
              <h4 className="text-center font-bold text-purple-700 mb-4 text-lg uppercase">Semi Finals</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {renderMatchCard(knockoutRounds['Semifinal 1'][0], 0)}
                {renderMatchCard(knockoutRounds['Semifinal 2'][0], 1)}
              </div>
            </div>

            {/* Final */}
            <div>
              <h4 className="text-center font-bold text-yellow-600 mb-4 text-lg uppercase flex items-center justify-center gap-2">
                <Trophy size={24} />
                Final
              </h4>
              <div className="max-w-md mx-auto">
                {renderMatchCard(finalMatch, 0, true)}

                {/* Champion Display */}
                {champion && (
                  <div className="mt-6 text-center">
                    <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-3" />
                    <div className="text-xl md:text-2xl font-bold text-gray-800">{champion}</div>
                    <div className="text-sm text-gray-500 mt-1">Champion</div>
                  </div>
                )}
              </div>
            </div>

            {/* 3rd Place Match */}
            {thirdPlaceMatch && (
              <div>
                <h4 className="text-center font-bold text-orange-600 mb-4 text-lg uppercase flex items-center justify-center gap-2">
                  <Medal size={22} />
                  3rd Place Match
                </h4>
                <div className="max-w-md mx-auto">
                  {renderMatchCard(thirdPlaceMatch, 0, false, true)}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600">Winner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-purple-300 rounded"></div>
                <span className="text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 border-2 border-gray-300 rounded"></div>
                <span className="text-gray-600">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-center text-gray-500">
            <Trophy className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-xl font-semibold">No knockout matches scheduled yet</p>
            <p className="text-sm mt-2">Knockout matches will appear here once scheduled in the Admin panel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Knockout;
