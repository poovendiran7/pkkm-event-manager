import { useState } from 'react';
import { useEvent } from '../context/EventContext';
import { GAMES } from '../data/gamesData';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import CarromIcon from '../components/CarromIcon';

const Results = () => {
  const { results, liveMatches } = useEvent();
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);

  const currentResults = results[selectedGame] || [];
  const selectedGameData = GAMES.find(g => g.id === selectedGame);

  const sortedResults = [...currentResults].sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const liveMatchesForGame = liveMatches.filter(m => m.gameId === selectedGame);

  const renderGameIcon = (game) => {
    if (game.icon === 'carrom-board') {
      return <CarromIcon className="w-10 h-10 mx-auto mb-2" />;
    }
    return <div className="text-4xl mb-2">{game.icon}</div>;
  };

  return (
    <div className="space-y-6 slide-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Live Results</h2>
        <p className="text-gray-600">Latest scores and match results</p>
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
            {liveMatches.some(m => m.gameId === game.id) && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-500 text-white animate-pulse">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1"></span>
                  LIVE
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Live Matches Banner */}
      {liveMatchesForGame.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl shadow-xl p-6 animate-pulse">
          <div className="flex items-center space-x-3">
            <TrendingUp size={32} />
            <div>
              <h3 className="text-2xl font-bold">Live Now!</h3>
              <p className="text-red-100">{liveMatchesForGame.length} match(es) in progress</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="text-yellow-500" size={32} />
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{selectedGameData.name} Results</h3>
            <p className="text-gray-600">{sortedResults.length} match(es) completed</p>
          </div>
        </div>

        {sortedResults.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Award className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-xl">No results yet</p>
            <p className="text-sm mt-2">Results will appear here as matches are completed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedResults.map((result, index) => (
              <div
                key={result.id}
                className="border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                      {result.round || 'Match'}
                    </span>
                    {index === 0 && (
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                        Latest
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 items-center">
                  {/* Participant 1 */}
                  <div className={`text-center p-4 rounded-lg ${
                    result.winner === 1 ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-100'
                  }`}>
                    <div className="font-bold text-lg text-gray-800 mb-2">
                      {selectedGameData.type === 'team' ? result.team1 :
                       selectedGameData.type === 'mixed-doubles' ? result.pair1 :
                       result.player1}
                    </div>
                    {result.winner === 1 && (
                      <Medal className="inline-block text-yellow-500 mb-2" size={24} />
                    )}
                    <div className="text-3xl font-bold text-gray-700">{result.score1}</div>
                  </div>

                  {/* VS */}
                  <div className="text-center text-gray-400 font-bold text-xl">VS</div>

                  {/* Participant 2 */}
                  <div className={`text-center p-4 rounded-lg ${
                    result.winner === 2 ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-100'
                  }`}>
                    <div className="font-bold text-lg text-gray-800 mb-2">
                      {selectedGameData.type === 'team' ? result.team2 :
                       selectedGameData.type === 'mixed-doubles' ? result.pair2 :
                       result.player2}
                    </div>
                    {result.winner === 2 && (
                      <Medal className="inline-block text-yellow-500 mb-2" size={24} />
                    )}
                    <div className="text-3xl font-bold text-gray-700">{result.score2}</div>
                  </div>
                </div>

                {result.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                    <strong>Notes:</strong> {result.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
