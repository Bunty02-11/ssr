"use client";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// CSS for thin scrollbars
const scrollbarStyles = `
  .thin-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .thin-scrollbar::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  .thin-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 10px;
  }
  .thin-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
  
  /* For Firefox */
  .thin-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #4b5563 #1a1a1a;
  }
`;

const ShopFilter = ({ onFilterChange, initialFilters, onReset, country = "india" }) => {
  const [expandedSections, setExpandedSections] = useState({
    collection: true,
    movement: false,
    displayType: false,
    caseColor: false,
    caseMaterial: false,
    dialColor: false,
    dialShape: false,
    bandColor: false,
    bandMaterial: false,
    bandClosure: false,
    price: true
  });

  const [filters, setFilters] = useState(() => ({
    priceMin: initialFilters?.priceMin || "",
    priceMax: initialFilters?.priceMax || "",
    collection: initialFilters?.collection || "",
    movement: initialFilters?.movement || "",
    displayType: initialFilters?.displayType || "",
    caseColor: initialFilters?.caseColor || "",
    caseMaterial: initialFilters?.caseMaterial || "",
    dialColor: initialFilters?.dialColor || "",
    dialShape: initialFilters?.dialShape || "",
    bandColor: initialFilters?.bandColor || "",
    bandMaterial: initialFilters?.bandMaterial || "",
    bandClosure: initialFilters?.bandClosure || "",
    featured: initialFilters?.featured || false,
    isBestSeller: initialFilters?.isBestSeller || false,
    isNewArrival: initialFilters?.isNewArrival || false,
  }));

  const [filterOptions, setFilterOptions] = useState({
    collections: [],
    movements: [],
    displayTypes: [],
    caseColors: [],
    caseMaterials: [],
    dialColors: [],
    dialShapes: [],
    bandColors: [],
    bandMaterials: [],
    bandClosures: [],
  });
  const [priceRange, setPriceRange] = useState({ min: 1, max: 990 });
  const [currencySymbol, setCurrencySymbol] = useState('₹'); // Default to INR

  // Helper function to get currency symbol based on country
  const getCurrencySymbol = (country) => {
    if (!country) return '₹'; // Default to INR
    
    const countryLower = country.toLowerCase();
    switch (countryLower) {
      case 'india': return '₹';
      case 'uae': return 'AED';
      case 'ksa': return 'SR';
      case 'kuwait': return 'KD';
      case 'qatar': return 'QAR';
      default: return '₹';
    }
  };

  // Set currency symbol when country changes
  useEffect(() => {
    setCurrencySymbol(getCurrencySymbol(country));
  }, [country]);

  // Fetch filter options on mount
  React.useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/products/filters/options');
        const data = await response.json();
        
        // Set price range from API
        if (data.priceRange) {
          const countryKey = country?.toLowerCase() || 'india';
          const countrySpecificRange = 
            data.priceRange.countries?.[countryKey] || 
            data.priceRange.global;
          
          if (countrySpecificRange) {
            setPriceRange(countrySpecificRange);

            // Only set local state for priceMin/priceMax if not already set by user/initialFilters
            setFilters(prev => {
              const updated = { ...prev };
              if (!prev.priceMin) updated.priceMin = countrySpecificRange.min;
              if (!prev.priceMax) updated.priceMax = countrySpecificRange.max;
              return updated;
            });
            // Do NOT call onFilterChange here, let user interaction trigger it
          }
        }
        
        setFilterOptions({
          collections: data.collections || [],
          movements: data.movements || [],
          displayTypes: data.displayTypes || [],
          caseColors: data.caseColors || [],
          caseMaterials: data.caseMaterials || [],
          dialColors: data.dialColors || [],
          dialShapes: data.dialShapes || [],
          bandColors: data.bandColors || [],
          bandMaterials: data.bandMaterials || [],
          bandClosures: data.bandClosures || [],
        });
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    
    fetchFilterOptions();
  }, [country]); // Add country to dependencies to refetch when country changes

  const handleFilterChange = (category, value) => {
    const newFilters = {
      ...filters,
      [category]: value === filters[category] ? "" : value
    };
    setFilters(newFilters);
    onFilterChange(newFilters); // Pass the updated filters to parent
  };

  const handlePriceChange = (value) => {
    // value is an array [min, max] from the slider
    const newFilters = {
      ...filters,
      priceMin: value[0],
      priceMax: value[1]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleResetAll = () => {
    // Reset local filter state
    setFilters({
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      collection: "",
      movement: "",
      displayType: "",
      caseColor: "",
      caseMaterial: "",
      dialColor: "",
      dialShape: "",
      bandColor: "",
      bandMaterial: "",
      bandClosure: "",
      featured: false,
      isBestSeller: false,
      isNewArrival: false,
    });
    
    // Call parent reset function to reset both filters and sorting
    if (onReset) {
      onReset();
    } else {
      // Fallback if onReset not provided
      onFilterChange({
        priceMin: priceRange.min,
        priceMax: priceRange.max
      });
    }
    
    // Don't automatically close the filter drawer after reset
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper function to render options for different types of filter data
  const renderOptions = (category, options) => {
    if (!options || options.length === 0) return null;
    
    if (category === 'collection') {
      return options.map((collection) => (
        <label key={collection._id} className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={filters.collection === collection._id}
            onChange={() => handleFilterChange('collection', collection._id)}
            className="form-checkbox h-4 w-4 text-blue-600 mt-1"
          />
          <span 
            className="text-black text-sm break-words max-w-[200px]" 
            style={{ lineHeight: "1.4" }}
          >
            {collection.name}
          </span>
        </label>
      ));
    }
    
    // For movements, displayTypes, etc. with 'en' property
    if (options[0] && options[0].en !== undefined) {
      return options.map((option, index) => (
        <label key={index} className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={filters[category] === option.en}
            onChange={() => handleFilterChange(category, option.en)}
            className="form-checkbox h-4 w-4 text-blue-600 mt-1"
          />
          <span 
            className="text-black text-sm break-words max-w-[200px]" 
            style={{ lineHeight: "1.4" }}
          >
            {option.en}
          </span>
        </label>
      ));
    }
    
    // For simple string arrays (like genders)
    return options.map((option, index) => (
      <label key={index} className="flex items-start space-x-2">
        <input
          type="checkbox"
          checked={filters[category] === option}
          onChange={() => handleFilterChange(category, option)}
          className="form-checkbox h-4 w-4 text-blue-600 mt-1"
        />
        <span 
          className="text-gray-300 text-sm break-words max-w-[200px]" 
          style={{ lineHeight: "1.4" }}
        >
          {option}
        </span>
      </label>
    ));
  };

  const renderFilterSection = (title, category, options) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => toggleSection(category)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-lg font-medium">{title}</span>
        {expandedSections[category] ? (
          <FiChevronUp className="w-5 h-5" />
        ) : (
          <FiChevronDown className="w-5 h-5" />
        )}
      </button>
      
      {expandedSections[category] && (
        <div className="mt-4 space-y-4">
          {category === 'price' ? (
            <div className="px-2">
              <div className="mb-4">
                <Slider
                  range
                  min={priceRange.min}
                  max={priceRange.max}
                  value={[filters.priceMin || priceRange.min, filters.priceMax || priceRange.max]}
                  onChange={handlePriceChange}
                  allowCross={false}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm">
                  <span>{currencySymbol}{filters.priceMin || priceRange.min}</span>
                  <span>{currencySymbol}{filters.priceMax || priceRange.max}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {renderOptions(category, options)}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg h-full flex flex-col">
      <style>{scrollbarStyles}</style>
      <div className="flex justify-between items-center mb-4 px-3 pt-3 flex-shrink-0">
        <h2 className="text-black text-lg font-semibold">Filters</h2>
        <button
          onClick={handleResetAll}
          className="flex items-center gap-1 text-xs text-white bg-black hover:bg-white hover:text-black hover:border-black focus:outline-none border border-white px-3 py-1 rounded-full shadow-sm transition-all duration-200 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h2.586a1 1 0 01.707.293l1.414 1.414A1 1 0 009.414 5H21a1 1 0 011 1v13a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
          </svg>
          Reset
        </button>
      </div>

      {/* Price Filter - Fixed position */}
      <div className="mb-3 px-3 flex-shrink-0">
        {renderFilterSection("Price", "price", [])}
      </div>

      {/* Scrollable Filter Sections */}
      <div className="px-3 text-black space-y-2 overflow-y-auto thin-scrollbar pb-3 flex-grow">
        {renderFilterSection("Collection", "collection", filterOptions.collections)}
        {/* {renderFilterSection("Movement", "movement", filterOptions.movements)} */}
        {/* {renderFilterSection("Movement", "displayType", filterOptions.displayTypes)} */}
        {renderFilterSection("Case Color", "caseColor", filterOptions.caseColors)}
        {/* {renderFilterSection("Case Material", "caseMaterial", filterOptions.caseMaterials)} */}
        {/* {renderFilterSection("Dial Color", "dialColor", filterOptions.dialColors)} */}
        {/* {renderFilterSection("Dial Shape", "dialShape", filterOptions.dialShapes)} */}
        {renderFilterSection("Band Color", "bandColor", filterOptions.bandColors)}
        {renderFilterSection("Band", "bandMaterial", filterOptions.bandMaterials)}
        {/* {renderFilterSection("Band Closure", "bandClosure", filterOptions.bandClosures)} */}
        
        {/* Special Filters */}
        <div className="mb-3">
          <h3 className="text-black text-sm font-semibold mb-2">Special</h3>
          <div className="space-y-1">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={() => {
                  const newFilters = {...filters, featured: !filters.featured};
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="form-checkbox h-4 w-4 text-black"
              />
              <span className="text-black text-sm">Featured</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.isBestSeller}
                onChange={() => {
                  const newFilters = {...filters, isBestSeller: !filters.isBestSeller};
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="form-checkbox h-4 w-4 text-black"
              />
              <span className="text-black text-sm">Best Seller</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.isNewArrival}
                onChange={() => {
                  const newFilters = {...filters, isNewArrival: !filters.isNewArrival};
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="form-checkbox h-4 w-4 text-black"
              />
              <span className="text-black text-sm">New Arrival</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

ShopFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  initialFilters: PropTypes.object,
  onReset: PropTypes.func,
  country: PropTypes.string,
};

export default ShopFilter;