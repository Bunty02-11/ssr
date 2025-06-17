"use client";
import { useEffect } from 'react';
import { useCountry } from '../context/CountryContext';

// Wrapper component to handle SSR data initialization
const SSRWrapper = ({ children, initialData }) => {
  const { updateCountry, setCountryData } = useCountry();

  // Initialize country from SSR data
  useEffect(() => {
    if (initialData?.detectedCountry) {
      // Only update if it's different from current to avoid unnecessary re-renders
      const currentCountry = localStorage.getItem('selectedCountry');
      if (!currentCountry) {
        updateCountry(initialData.detectedCountry);
      }
    }
  }, [initialData?.detectedCountry, updateCountry]);

  // Initialize country-specific data from SSR
  useEffect(() => {
    if (initialData?.countryData) {
      setCountryData(initialData.countryData);
    }
  }, [initialData?.countryData, setCountryData]);

  return children;
};

export default SSRWrapper; 