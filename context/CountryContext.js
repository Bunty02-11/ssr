'use client'
import { createContext, useContext, useState, useEffect } from 'react';

const CountryContext = createContext();

export function CountryProvider({ children, initialCountry = 'uae' }) {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedCountry') || initialCountry;
    }
    return initialCountry;
  });
  
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔄 Country updated in context to:', selectedCountry);
      localStorage.setItem('selectedCountry', selectedCountry);
      
      // Force a custom event to ensure all components know about the change
      const event = new Event('countryChange');
      window.dispatchEvent(event);
    }
  }, [selectedCountry]);

  // Listen for the custom event
  useEffect(() => {
    const handleCountryChange = () => {
      console.log('📢 countryChange event detected');
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('countryChange', handleCountryChange);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('countryChange', handleCountryChange);
      }
    };
  }, []);

  const updateCountry = (country) => {
    console.log('🔄 updateCountry called with:', country);
    setSelectedCountry(country);
  };

  return (
    <CountryContext.Provider value={{ 
      selectedCountry, 
      updateCountry, 
      countryData, 
      setCountryData 
    }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}