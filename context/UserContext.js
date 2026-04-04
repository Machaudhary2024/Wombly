// context/UserContext.js
// Global user context — set once at login, readable from any component.
// Eliminates the need to pass userEmail/userName through every navigation route.

import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({ email: null, name: null });

  const setUserInfo = (email, name) => {
    setUser({ email: email || null, name: name || null });
  };

  const clearUserInfo = () => {
    setUser({ email: null, name: null });
  };

  return (
    <UserContext.Provider value={{ user, setUserInfo, clearUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
