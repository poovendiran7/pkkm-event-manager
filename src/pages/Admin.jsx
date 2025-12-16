import { useState } from 'react';
import { useEvent } from '../context/EventContext';
import { GAMES } from '../data/gamesData';
import { Settings, Plus, Trash2, Save, Radio, Edit2, X, StopCircle } from 'lucide-react';
import CarromIcon from '../components/CarromIcon';

const Admin = () => {
  const { schedules, results, liveMatches, addSchedule, updateSchedule, deleteSchedule, addResult, updateResult, deleteResult, setLive, clearAllLive } = useEvent();
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);
  const [activeTab, setActiveTab] = useState('schedule');
  const [formData, setFormData] = useState({});
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [selectedScheduleForResult, setSelectedScheduleForResult] = useState(null);

  const selectedGameData = GAMES.find(g => g.id === selectedGame);
  const currentSchedules = schedules[selectedGame] || [];
  const currentResults = results[selectedGame] || [];
  const liveMatchesForGame = liveMatches.filter(m => m.gameId === selectedGame);

  // Get schedules that don't have results yet
  const schedulesWithoutResults = currentSchedules.filter(schedule => {
    return !currentResults.some(result => result.scheduleId === schedule.id);
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (editingSchedule) {
      updateSchedule(selectedGame, editingSchedule.id, formData);
      setEditingSchedule(null);
    } else {
      addSchedule(selectedGame, formData);
    }
    setFormData({});
    e.target.reset();
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setFormData(schedule);
  };

  const handleCancelEdit = () => {
    setEditingSchedule(null);
    setFormData({});
  };

  const handleSelectScheduleForResult = (schedule) => {
    setSelectedScheduleForResult(schedule);
    setFormData({
      scheduleId: schedule.id,
      round: schedule.round,
      ...(selectedGameData.type === 'team' && {
        team1: schedule.team1,
        team2: schedule.team2,
      }),
      ...(selectedGameData.type === 'mixed-doubles' && {
        pair1: schedule.pair1,
        pair2: schedule.pair2,
      }),
      ...(selectedGameData.type === 'individual' && {
        player1: schedule.player1,
        player2: schedule.player2,
      }),
    });
  };

  const handleAddResult = (e) => {
    e.preventDefault();
    const resultData = {
      ...formData,
      scheduleId: selectedScheduleForResult?.id || formData.scheduleId,
      winner: formData.winner === 'draw' ? null : (formData.winner ? parseInt(formData.winner) : null),
      score1: formData.score1 || null,
      score2: formData.score2 || null,
      isDraw: formData.winner === 'draw',
    };

    if (editingResult) {
      updateResult(selectedGame, editingResult.id, resultData);
      setEditingResult(null);
    } else {
      addResult(selectedGame, resultData);
    }

    setFormData({});
    setSelectedScheduleForResult(null);
    e.target.reset();
  };

  const handleEditResult = (result) => {
    setEditingResult(result);
    setSelectedScheduleForResult(null);
    setFormData({
      ...result,
      winner: result.isDraw ? 'draw' : result.winner?.toString() || '',
    });
  };

  const handleCancelResultEdit = () => {
    setEditingResult(null);
    setFormData({});
  };

  const isMatchLive = (matchId) => {
    return liveMatchesForGame.some(m => m.matchId === matchId);
  };

  const handleToggleLive = (matchId) => {
    const isLive = isMatchLive(matchId);
    setLive(selectedGame, matchId, !isLive);
  };

  const renderGameIcon = (game) => {
    if (game.icon === 'carrom-board') {
      return <CarromIcon className="w-10 h-10 mx-auto mb-2" />;
    }
    return <div className="text-4xl mb-2">{game.icon}</div>;
  };

  return (
    <div className="space-y-6 slide-in">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3">
          <Settings size={32} />
          <div>
            <h2 className="text-3xl font-bold">Admin Panel</h2>
            <p className="text-purple-100">Manage schedules, results, and live updates</p>
          </div>
        </div>
      </div>

      {/* Game Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => {
              setSelectedGame(game.id);
              setEditingSchedule(null);
              setSelectedScheduleForResult(null);
              setFormData({});
            }}
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

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manage Schedule
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'results'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Add Results
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'live'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Live Control
          </button>
        </div>

        <div className="p-6">
          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
              </h3>
              <form onSubmit={handleAddSchedule} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="time"
                    placeholder="Time (e.g., 9:00 AM)"
                    value={formData.time || ''}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="venue"
                    placeholder="Venue"
                    value={formData.venue || ''}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Round</label>
                  <select
                    name="round"
                    value={formData.round || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">Select Round</option>
                    <option value="Group A">Group A</option>
                    <option value="Group B">Group B</option>
                    <option value="Group C">Group C</option>
                    <option value="Group D">Group D</option>
                    <option value="Quarter Final 1">Quarter Final 1</option>
                    <option value="Quarter Final 2">Quarter Final 2</option>
                    <option value="Quarter Final 3">Quarter Final 3</option>
                    <option value="Quarter Final 4">Quarter Final 4</option>
                    <option value="Semifinal 1">Semifinal 1</option>
                    <option value="Semifinal 2">Semifinal 2</option>
                    <option value="3rd-4th Placing">3rd-4th Placing</option>
                    <option value="Final">Final</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {selectedGameData.type === 'team' ? (
                    <>
                      <input
                        type="text"
                        name="team1"
                        placeholder="Team 1"
                        value={formData.team1 || ''}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="team2"
                        placeholder="Team 2"
                        value={formData.team2 || ''}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </>
                  ) : selectedGameData.type === 'mixed-doubles' ? (
                    <>
                      <input
                        type="text"
                        name="pair1"
                        placeholder="Pair 1"
                        value={formData.pair1 || ''}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="pair2"
                        placeholder="Pair 2"
                        value={formData.pair2 || ''}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="player1"
                        placeholder="Player 1"
                        value={formData.player1 || ''}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="player2"
                        placeholder="Player 2"
                        value={formData.player2 || ''}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
                  >
                    {editingSchedule ? <Save size={20} /> : <Plus size={20} />}
                    <span>{editingSchedule ? 'Update Schedule' : 'Add Schedule'}</span>
                  </button>
                  {editingSchedule && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
                    >
                      <X size={20} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Current Schedules */}
              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Current Schedules</h4>
                <div className="space-y-3">
                  {currentSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {selectedGameData.type === 'team'
                            ? `${schedule.team1} vs ${schedule.team2}`
                            : selectedGameData.type === 'mixed-doubles'
                            ? `${schedule.pair1} vs ${schedule.pair2}`
                            : `${schedule.player1} vs ${schedule.player2}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {schedule.time} - {schedule.venue} - {schedule.round}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteSchedule(selectedGame, schedule.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingResult ? 'Edit Match Result' : 'Add Match Result'}
              </h3>

              {/* Schedules without results */}
              {schedulesWithoutResults.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Pending Results</h4>
                  <div className="space-y-2">
                    {schedulesWithoutResults.map((schedule) => (
                      <button
                        key={schedule.id}
                        onClick={() => handleSelectScheduleForResult(schedule)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedScheduleForResult?.id === schedule.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {selectedGameData.type === 'team'
                            ? `${schedule.team1} vs ${schedule.team2}`
                            : selectedGameData.type === 'mixed-doubles'
                            ? `${schedule.pair1} vs ${schedule.pair2}`
                            : `${schedule.player1} vs ${schedule.player2}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {schedule.time} - {schedule.round}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleAddResult} className="space-y-4">
                {!selectedScheduleForResult && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Round</label>
                    <select
                      name="round"
                      value={formData.round || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      <option value="">Select Round</option>
                      <option value="Group Stage">Group Stage</option>
                      <option value="Quarter Final 1">Quarter Final 1</option>
                      <option value="Quarter Final 2">Quarter Final 2</option>
                      <option value="Quarter Final 3">Quarter Final 3</option>
                      <option value="Quarter Final 4">Quarter Final 4</option>
                      <option value="Semifinal 1">Semifinal 1</option>
                      <option value="Semifinal 2">Semifinal 2</option>
                      <option value="3rd-4th Placing">3rd-4th Placing</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {selectedGameData.type === 'team' ? (
                    <>
                      <div>
                        <input
                          type="text"
                          name="team1"
                          placeholder="Team 1"
                          value={formData.team1 || ''}
                          onChange={handleInputChange}
                          required
                          disabled={!!selectedScheduleForResult}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100"
                        />
                        <input
                          type="text"
                          name="score1"
                          placeholder="Score (optional)"
                          value={formData.score1 || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-2"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="team2"
                          placeholder="Team 2"
                          value={formData.team2 || ''}
                          onChange={handleInputChange}
                          required
                          disabled={!!selectedScheduleForResult}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100"
                        />
                        <input
                          type="text"
                          name="score2"
                          placeholder="Score (optional)"
                          value={formData.score2 || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-2"
                        />
                      </div>
                    </>
                  ) : selectedGameData.type === 'mixed-doubles' ? (
                    <>
                      <div>
                        <input
                          type="text"
                          name="pair1"
                          placeholder="Pair 1"
                          value={formData.pair1 || ''}
                          onChange={handleInputChange}
                          required
                          disabled={!!selectedScheduleForResult}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100"
                        />
                        <input
                          type="text"
                          name="score1"
                          placeholder="Score (optional)"
                          value={formData.score1 || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-2"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="pair2"
                          placeholder="Pair 2"
                          value={formData.pair2 || ''}
                          onChange={handleInputChange}
                          required
                          disabled={!!selectedScheduleForResult}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100"
                        />
                        <input
                          type="text"
                          name="score2"
                          placeholder="Score (optional)"
                          value={formData.score2 || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-2"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <input
                          type="text"
                          name="player1"
                          placeholder="Player 1"
                          value={formData.player1 || ''}
                          onChange={handleInputChange}
                          required
                          disabled={!!selectedScheduleForResult}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100"
                        />
                        <input
                          type="text"
                          name="score1"
                          placeholder="Score (optional)"
                          value={formData.score1 || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-2"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="player2"
                          placeholder="Player 2"
                          value={formData.player2 || ''}
                          onChange={handleInputChange}
                          required
                          disabled={!!selectedScheduleForResult}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100"
                        />
                        <input
                          type="text"
                          name="score2"
                          placeholder="Score (optional)"
                          value={formData.score2 || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-2"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Winner</label>
                  <select
                    name="winner"
                    value={formData.winner || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">Select Winner</option>
                    <option value="1">
                      {selectedGameData.type === 'team' ? formData.team1 || 'Team 1' : selectedGameData.type === 'mixed-doubles' ? formData.pair1 || 'Pair 1' : formData.player1 || 'Player 1'}
                    </option>
                    <option value="2">
                      {selectedGameData.type === 'team' ? formData.team2 || 'Team 2' : selectedGameData.type === 'mixed-doubles' ? formData.pair2 || 'Pair 2' : formData.player2 || 'Player 2'}
                    </option>
                    <option value="draw">Draw</option>
                  </select>
                </div>

                <textarea
                  name="notes"
                  placeholder="Notes (optional)"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Save size={20} />
                    <span>{editingResult ? 'Update Result' : 'Save Result'}</span>
                  </button>
                  {(selectedScheduleForResult || editingResult) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (editingResult) {
                          handleCancelResultEdit();
                        } else {
                          setSelectedScheduleForResult(null);
                          setFormData({});
                        }
                      }}
                      className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
                    >
                      <X size={20} />
                      <span>{editingResult ? 'Cancel' : 'Clear'}</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Existing Results */}
              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Existing Results</h4>
                <div className="space-y-3">
                  {currentResults.length > 0 ? (
                    currentResults.map((result) => {
                      const participant1 = selectedGameData.type === 'team'
                        ? result.team1
                        : selectedGameData.type === 'mixed-doubles'
                        ? result.pair1
                        : result.player1;
                      const participant2 = selectedGameData.type === 'team'
                        ? result.team2
                        : selectedGameData.type === 'mixed-doubles'
                        ? result.pair2
                        : result.player2;
                      const winnerName = result.isDraw
                        ? 'Draw'
                        : result.winner === 1
                        ? participant1
                        : participant2;

                      return (
                        <div
                          key={result.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">
                              {participant1} vs {participant2}
                            </div>
                            <div className="text-sm text-gray-600">
                              Winner: {winnerName} • Round: {result.round}
                              {result.score1 && result.score2 && (
                                <span> • Score: {result.score1} - {result.score2}</span>
                              )}
                            </div>
                            {result.notes && (
                              <div className="text-xs text-gray-500 mt-1">
                                Notes: {result.notes}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditResult(result)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button
                              onClick={() => deleteResult(selectedGame, result.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No results added yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Live Control Tab */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Live Match Control</h3>
                  <p className="text-gray-600">Toggle matches as live to display them with real-time indicators</p>
                </div>
                {liveMatches.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all live matches across all games?')) {
                        clearAllLive();
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold"
                  >
                    <StopCircle size={20} />
                    <span>Clear All Live</span>
                  </button>
                )}
              </div>

              {liveMatchesForGame.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-800 mb-2">Currently Live for {selectedGameData.name}</h4>
                  <div className="text-sm text-red-600">
                    {liveMatchesForGame.length} match(es) are currently live
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {currentSchedules.map((schedule) => {
                  const isLive = isMatchLive(schedule.id);
                  return (
                    <div
                      key={schedule.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        isLive ? 'bg-red-50 border-2 border-red-500' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {selectedGameData.type === 'team'
                            ? `${schedule.team1} vs ${schedule.team2}`
                            : selectedGameData.type === 'mixed-doubles'
                            ? `${schedule.pair1} vs ${schedule.pair2}`
                            : `${schedule.player1} vs ${schedule.player2}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {schedule.time} - {schedule.venue}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleLive(schedule.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-semibold ${
                          isLive
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {isLive ? (
                          <>
                            <StopCircle size={20} />
                            <span>End Live</span>
                          </>
                        ) : (
                          <>
                            <Radio size={20} />
                            <span>Set Live</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
                {currentSchedules.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No schedules available. Add schedules first.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
