import { useState } from 'react';
import { useEvent } from '../context/EventContext';
import { GAMES } from '../data/gamesData';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';
import CarromIcon from '../components/CarromIcon';

const Schedule = () => {
  const { schedules, liveMatches } = useEvent();
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);

  const currentSchedules = schedules[selectedGame] || [];
  const selectedGameData = GAMES.find(g => g.id === selectedGame);

  const isLive = (matchId) => {
    return liveMatches.some(m => m.gameId === selectedGame && m.matchId === matchId);
  };

  const renderGameIcon = (game, size = 'normal') => {
    if (game.icon === 'carrom-board') {
      return <CarromIcon className={size === 'large' ? 'w-12 h-12' : 'w-10 h-10 mx-auto mb-2'} />;
    }
    return <div className={size === 'large' ? 'text-5xl' : 'text-4xl mb-2'}>{game.icon}</div>;
  };

  return (
    <div className="space-y-6 slide-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Event Schedule</h2>
        <p className="text-gray-600">Select a game to view the schedule</p>
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

      {/* Schedule Display */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          {renderGameIcon(selectedGameData, 'large')}
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{selectedGameData.name}</h3>
            <p className="text-gray-600 capitalize">{selectedGameData.type} Event</p>
          </div>
        </div>

        {currentSchedules.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-xl">No matches scheduled yet</p>
            <p className="text-sm mt-2">Check back later or contact the organizers</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentSchedules.map((match) => (
              <div
                key={match.id}
                className={`border-l-4 ${
                  isLive(match.id) ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                } rounded-lg p-6 transition-all hover:shadow-md`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                        {match.round}
                      </span>
                      {isLive(match.id) && (
                        <span className="live-badge">
                          <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                          LIVE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mb-2">
                      <Users size={20} className="text-gray-600" />
                      <div className="flex-1">
                        {selectedGameData.type === 'team' ? (
                          <div className="text-lg font-bold text-gray-800">
                            {match.team1} <span className="text-purple-600 mx-2">VS</span> {match.team2}
                          </div>
                        ) : selectedGameData.type === 'mixed-doubles' ? (
                          <div className="text-lg font-bold text-gray-800">
                            {match.pair1} <span className="text-purple-600 mx-2">VS</span> {match.pair2}
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-gray-800">
                            {match.player1} <span className="text-purple-600 mx-2">VS</span> {match.player2}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{match.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} />
                        <span>{match.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
