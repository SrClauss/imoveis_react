import React, { createContext, useState } from 'react';

const NavigationContext = createContext();

const NavigationProvider = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState('MainScreen'); // Define a tela inicial
  const [sharedState, setSharedState] = useState({});

  return (
    <NavigationContext.Provider value={{ activeScreen, setActiveScreen, sharedState, setSharedState }}>
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationContext, NavigationProvider };



