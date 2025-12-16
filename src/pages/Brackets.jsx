import { useState } from 'react';
import { useEvent } from '../context/EventContext';
import { GAMES } from '../data/gamesData';
import { GitBranch, Trophy } from 'lucide-react';

const BracketMatch = ({ match, position }) => {
  if (!match) return <div className="bracket-match empty h-24"></div>;

  return (
    <div className={`bracket-match bg-white rounded-lg shadow-md p-4 mb-4 border-2 ${
      match.winner ? 'border-green-500' : 'border-gray-300'
    } hover:shadow-lg transition-all`}>
      <div className="space-y-2">
        <div className={`flex items-center justify-between p-2 rounded ${
          match.winner === 1 ? 'bg-yellow-100 font-bold' : 'bg-gray-50'
        }`}>
          <span className="text-sm truncate">{match.participant1}</span>
          <span className="ml-2 font-bold">{match.score1 || '-'}</span>
        </div>
        <div className={`flex items-center justify-between p-2 rounded ${
          match.winner === 2 ? 'bg-yellow-100 font-bold' : 'bg-gray-50'
        }`}>
          <span className="text-sm truncate">{match.participant2}</span>
          <span className="ml-2 font-bold">{match.score2 || '-'}</span>
        </div>
      </div>
      {match.winner && (
        <div className="mt-2 text-center">
          <span className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded-full text-xs">
            <Trophy size={12} className="mr-1" />
            Winner
          </span>
        </div>
      )}
    </div>
  );
};

const Brackets = () => {
  const { brackets } = useEvent();
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);

  const selectedGameData = GAMES.find(g => g.id === selectedGame);
  const currentBracket = brackets[selectedGame];

  // Generate sample bracket structure if not exists
  const getSampleBracket = () => {
    if (currentBracket) return currentBracket;

    // Sample 8-team bracket
    return {
      quarterFinals: [
        { id: 1, participant1: 'Participant 1', participant2: 'Participant 2', score1: null, score2: null, winner: null },
        { id: 2, participant1: 'Participant 3', participant2: 'Participant 4', score1: null, score2: null, winner: null },
        { id: 3, participant1: 'Participant 5', participant2: 'Participant 6', score1: null, score2: null, winner: null },
        { id: 4, participant1: 'Participant 7', participant2: 'Participant 8', score1: null, score2: null, winner: null },
      ],
      semiFinals: [
        { id: 5, participant1: 'TBD', participant2: 'TBD', score1: null, score2: null, winner: null },
        { id: 6, participant1: 'TBD', participant2: 'TBD', score1: null, score2: null, winner: null },
      ],
      finals: [
        { id: 7, participant1: 'TBD', participant2: 'TBD', score1: null, score2: null, winner: null },
      ],
      champion: null,
    };
  };

  const bracket = getSampleBracket();

  return (
    <div className="space-y-6 slide-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Tournament Brackets</h2>
        <p className="text-gray-600">Visual knockout round maps</p>
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
            <div className="text-4xl mb-2">{game.icon}</div>
            <div className="font-semibold text-sm text-center">{game.name}</div>
          </button>
        ))}
      </div>

      {/* Bracket Visualization */}
      <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
        <div className="flex items-center space-x-3 mb-8">
          <GitBranch className="text-purple-600" size={32} />
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{selectedGameData.name} Bracket</h3>
            <p className="text-gray-600">Knockout Tournament Format</p>
          </div>
        </div>

        {/* Bracket Grid */}
        <div className="min-w-[800px]">
          <div className="grid grid-cols-4 gap-8">
            {/* Quarter Finals */}
            <div className="space-y-2">
              <h4 className="text-center font-bold text-purple-600 mb-4">Quarter Finals</h4>
              {bracket.quarterFinals?.map((match, index) => (
                <BracketMatch key={match.id} match={match} position={index} />
              ))}
            </div>

            {/* Semi Finals */}
            <div className="space-y-2 flex flex-col justify-around">
              <div>
                <h4 className="text-center font-bold text-purple-600 mb-4">Semi Finals</h4>
                <div className="space-y-24">
                  {bracket.semiFinals?.map((match, index) => (
                    <BracketMatch key={match.id} match={match} position={index} />
                  ))}
                </div>
              </div>
            </div>

            {/* Finals */}
            <div className="space-y-2 flex flex-col justify-center">
              <div>
                <h4 className="text-center font-bold text-purple-600 mb-4">Finals</h4>
                {bracket.finals?.map((match) => (
                  <BracketMatch key={match.id} match={match} />
                ))}
              </div>
            </div>

            {/* Champion */}
            <div className="flex flex-col justify-center items-center">
              <h4 className="text-center font-bold text-yellow-600 mb-4">Champion</h4>
              {bracket.champion ? (
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-xl shadow-2xl p-8 text-center transform scale-110">
                  <Trophy size={48} className="mx-auto mb-3" />
                  <div className="text-2xl font-bold">{bracket.champion}</div>
                  <div className="text-sm mt-2 opacity-90">Tournament Winner</div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                  <Trophy size={48} className="mx-auto mb-3 text-gray-400" />
                  <div className="text-gray-500">TBD</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
              <span>Winner</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brackets;
