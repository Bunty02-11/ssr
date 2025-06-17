"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const userData = await getUserProfile();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch user profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const clearUser = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        updateUser,
        clearUser,
        refreshUserProfile: fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
