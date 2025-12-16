import { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, set, push, update, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { initialScheduleData, initialResultsData } from '../data/gamesData';

const EventContext = createContext();

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [schedules, setSchedules] = useState(initialScheduleData);
  const [results, setResults] = useState(initialResultsData);
  const [liveMatches, setLiveMatches] = useState([]);
  const [brackets, setBrackets] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from Firebase and set up real-time listeners
  useEffect(() => {
    // Reference to the event data in Firebase
    const schedulesRef = ref(database, 'schedules');
    const resultsRef = ref(database, 'results');
    const liveMatchesRef = ref(database, 'liveMatches');
    const bracketsRef = ref(database, 'brackets');

    // Listen for changes to schedules
    const unsubscribeSchedules = onValue(schedulesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSchedules(data);
      } else {
        // Initialize with default data if Firebase is empty
        set(schedulesRef, initialScheduleData);
      }
    });

    // Listen for changes to results
    const unsubscribeResults = onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setResults(data);
      } else {
        set(resultsRef, initialResultsData);
      }
    });

    // Listen for changes to live matches
    const unsubscribeLiveMatches = onValue(liveMatchesRef, (snapshot) => {
      const data = snapshot.val();
      setLiveMatches(data || []);
    });

    // Listen for changes to brackets
    const unsubscribeBrackets = onValue(bracketsRef, (snapshot) => {
      const data = snapshot.val();
      setBrackets(data || {});
    });

    // Set loading to false after initial data load
    setIsLoading(false);

    // Cleanup listeners on unmount
    return () => {
      unsubscribeSchedules();
      unsubscribeResults();
      unsubscribeLiveMatches();
      unsubscribeBrackets();
    };
  }, []);

  const addSchedule = async (gameId, schedule) => {
    const schedulesRef = ref(database, `schedules/${gameId}`);
    const currentSchedules = schedules[gameId] || [];
    const newSchedule = { ...schedule, id: Date.now() };
    const updatedSchedules = [...currentSchedules, newSchedule];
    await set(schedulesRef, updatedSchedules);
  };

  const updateSchedule = async (gameId, scheduleId, updates) => {
    const schedulesRef = ref(database, `schedules/${gameId}`);
    const currentSchedules = schedules[gameId] || [];
    const updatedSchedules = currentSchedules.map(s =>
      s.id === scheduleId ? { ...s, ...updates } : s
    );
    await set(schedulesRef, updatedSchedules);
  };

  const deleteSchedule = async (gameId, scheduleId) => {
    const schedulesRef = ref(database, `schedules/${gameId}`);
    const currentSchedules = schedules[gameId] || [];
    const updatedSchedules = currentSchedules.filter(s => s.id !== scheduleId);
    await set(schedulesRef, updatedSchedules);
  };

  const addResult = async (gameId, result) => {
    const resultsRef = ref(database, `results/${gameId}`);
    const currentResults = results[gameId] || [];
    const newResult = {
      ...result,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    const updatedResults = [...currentResults, newResult];
    await set(resultsRef, updatedResults);

    // Remove the schedule if scheduleId is provided
    if (result.scheduleId) {
      const schedulesRef = ref(database, `schedules/${gameId}`);
      const currentSchedules = schedules[gameId] || [];
      const updatedSchedules = currentSchedules.filter(s => s.id !== result.scheduleId);
      await set(schedulesRef, updatedSchedules);

      // Clear Live state if the match was live
      const liveMatchesRef = ref(database, 'liveMatches');
      const updatedLiveMatches = liveMatches.filter(m => m.matchId !== result.scheduleId);
      await set(liveMatchesRef, updatedLiveMatches);
    }
  };

  const updateResult = async (gameId, resultId, updates) => {
    const resultsRef = ref(database, `results/${gameId}`);
    const currentResults = results[gameId] || [];
    const updatedResults = currentResults.map(r =>
      r.id === resultId ? { ...r, ...updates } : r
    );
    await set(resultsRef, updatedResults);
  };

  const deleteResult = async (gameId, resultId) => {
    const resultsRef = ref(database, `results/${gameId}`);
    const currentResults = results[gameId] || [];
    const updatedResults = currentResults.filter(r => r.id !== resultId);
    await set(resultsRef, updatedResults);
  };

  const setLive = async (gameId, matchId, isLive) => {
    const liveMatchesRef = ref(database, 'liveMatches');
    let updatedLiveMatches;

    if (isLive) {
      updatedLiveMatches = [
        ...liveMatches.filter(m => m.matchId !== matchId),
        { gameId, matchId }
      ];
    } else {
      updatedLiveMatches = liveMatches.filter(m => m.matchId !== matchId);
    }

    await set(liveMatchesRef, updatedLiveMatches);
  };

  const updateBracket = async (gameId, bracketData) => {
    const bracketRef = ref(database, `brackets/${gameId}`);
    await set(bracketRef, bracketData);
  };

  const clearAllLive = async () => {
    const liveMatchesRef = ref(database, 'liveMatches');
    await set(liveMatchesRef, []);
  };

  const value = {
    schedules,
    results,
    liveMatches,
    brackets,
    isLoading,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addResult,
    updateResult,
    deleteResult,
    setLive,
    clearAllLive,
    updateBracket,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
