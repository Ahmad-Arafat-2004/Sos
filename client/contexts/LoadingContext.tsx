import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  reset: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const counter = useRef(0);
  const location = useLocation();

  const startLoading = () => {
    counter.current += 1;
    setIsLoading(true);
  };

  const stopLoading = () => {
    counter.current = Math.max(0, counter.current - 1);
    if (counter.current === 0) setIsLoading(false);
  };

  const reset = () => {
    counter.current = 0;
    setIsLoading(false);
  };

  // When location changes, stop loading (navigation completed)
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, reset }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
};
