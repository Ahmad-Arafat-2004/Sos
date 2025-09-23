import React, { createContext, useContext, useState, useEffect } from 'react';

export type StoreType = 'irth-biladi' | 'cilka' | null;

interface StoreContextType {
  selectedStore: StoreType;
  setSelectedStore: (store: StoreType) => void;
  clearStoreSelection: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedStore, setSelectedStore] = useState<StoreType>(null);

  // تحميل اختيار المتجر من localStorage عند بداية التطبيق
  useEffect(() => {
    const savedStore = localStorage.getItem('selectedStore');
    if (savedStore && (savedStore === 'irth-biladi' || savedStore === 'cilka')) {
      setSelectedStore(savedStore as StoreType);
    }
  }, []);

  // حفظ اختيار المتجر في localStorage عند التغيير
  useEffect(() => {
    if (selectedStore) {
      localStorage.setItem('selectedStore', selectedStore);
    } else {
      localStorage.removeItem('selectedStore');
    }
  }, [selectedStore]);

  const clearStoreSelection = () => {
    setSelectedStore(null);
  };

  return (
    <StoreContext.Provider value={{
      selectedStore,
      setSelectedStore,
      clearStoreSelection
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
