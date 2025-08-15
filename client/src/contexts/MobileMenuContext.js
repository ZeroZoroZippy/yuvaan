import React, { createContext, useContext, useState } from 'react';

const MobileMenuContext = createContext();

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
};

export const MobileMenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <MobileMenuContext.Provider value={{
      isOpen,
      openMenu,
      closeMenu,
      toggleMenu
    }}>
      {children}
    </MobileMenuContext.Provider>
  );
};