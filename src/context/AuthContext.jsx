import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check user role in database
  const checkUserRole = async (uid) => {
    try {
      const userRef = ref(database, `users/${uid}`);

      return new Promise((resolve) => {
        const unsubscribe = onValue(userRef, (snapshot) => {
          const userData = snapshot.val();

          if (userData && userData.role === 'admin') {
            setIsAdmin(true);
            resolve(true);
          } else {
            setIsAdmin(false);
            setError('Access denied. Admin privileges required.');
            resolve(false);
          }

          unsubscribe();
        }, (error) => {
          console.error('Error fetching user role:', error);
          setIsAdmin(false);
          setError('Failed to verify admin status.');
          resolve(false);
          unsubscribe();
        });
      });
    } catch (err) {
      console.error('Error checking user role:', err);
      setIsAdmin(false);
      setError('Failed to verify admin status.');
      return false;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // User is signed in, check their role
        await checkUserRole(user.uid);
      } else {
        // User is signed out
        setIsAdmin(false);
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is admin
      const isUserAdmin = await checkUserRole(user.uid);

      if (!isUserAdmin) {
        // Not an admin, sign them out
        await signOut(auth);
        throw new Error('Access denied. Admin privileges required.');
      }

      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);

      // Handle specific Firebase auth errors
      let errorMessage = 'Failed to login';

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
      return { success: false, error: 'Failed to logout' };
    }
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    error,
    login,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
