import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Card from "../card";
import SkeletonLoader from "../SkeletonLoader";
import PropTypes from "prop-types";
import ShopFilter from "../../app/shop/ShopFilter";
import { createPortal } from "react-dom";

const Main = ({
  className = "",
  products,
  loading,
  error,
  page,
  onPageChange,
  totalPages,
  hasMore,
  loadingMore,
  onLoadMore,
  selectedCountry
}) => {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState(""); // Default sort option
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const getCurrencySymbol = (selectedCountry) => {
    if (!selectedCountry) return '$';
    const countryUpper = selectedCountry.toUpperCase();
    switch (countryUpper) {
      case 'INDIA': return '₹';
      case 'UAE': return 'AED';
      case 'KSA': return 'SR';
      case 'KUWAIT': return 'KD';
      case 'QATAR': return 'QAR';
      default: return '$';
    }
  };

  const getCountryPrice = (priceObj) => {
    if (!priceObj || typeof priceObj !== 'object') return '';
    if (!selectedCountry) return Object.values(priceObj)[0] || '';

    const countryKey = selectedCountry.toLowerCase();
    return priceObj[countryKey] || Object.values(priceObj)[0] || '';
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getFilteredProducts = () => {
    if (!products || !Array.isArray(products)) return [];

    if (!Object.values(filters).some(value => value !== "")) {
      return products;
    }

    return products.filter(product => {
      if (!product?.watchDetails) return false;

      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return product.watchDetails[key] === value;
      });
    });
  };

  const filteredProducts = getFilteredProducts();

  // Apply sorting to the filtered products
  const sortedProducts = useMemo(() => {
    if (!filteredProducts) return [];

    let sorted = [...filteredProducts];

    // Helper to get price for sorting
    const getSortPrice = (product) => {
      if (!product.price || typeof product.price !== 'object') return 0;
      if (!selectedCountry) return Number(Object.values(product.price)[0]) || 0;
      const countryKey = selectedCountry.toLowerCase();
      return Number(product.price[countryKey]) || Number(Object.values(product.price)[0]) || 0;
    };

    switch (sortBy) {
      case 'bestSeller':
        sorted.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'newArrival':
        sorted.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'nameAsc':
        sorted.sort((a, b) => (a.name?.en || '').localeCompare(b.name?.en || ''));
        break;
      case 'nameDesc':
        sorted.sort((a, b) => (b.name?.en || '').localeCompare(a.name?.en || ''));
        break;
      case 'priceLowToHigh':
      case 'price':
      case 'priceAsc':
      case 'priceLow':
        sorted.sort((a, b) => getSortPrice(a) - getSortPrice(b));
        break;
      case 'priceHighToLow':
        sorted.sort((a, b) => getSortPrice(b) - getSortPrice(a));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'reviews':
        sorted.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy, selectedCountry]);

  const toggleFilterDrawer = () => {
    setShowFilterDrawer(!showFilterDrawer);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = !showFilterDrawer ? 'hidden' : 'unset';
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== "" && value !== false).length;
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-white">Loading products...</div>
      </div>
    );
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
  };

  const getSortDisplayText = () => {
    switch (sortBy) {
      case 'bestSeller': return 'Sort by Bestseller';
      case 'newArrival': return 'Sort by New Arrival';
      case 'nameAsc': return 'Sort A-Z';
      case 'nameDesc': return 'Sort Z-A';
      case 'priceLowToHigh': return 'Price: Low to High';
      case 'priceHighToLow': return 'Price: High to Low';
      case 'newest': return 'Sort by Newest';
      case 'rating': return 'Sort by Rating';
      case 'reviews': return 'Sort by Reviews';
      case 'price': return 'Sort by Price';
      default: return 'Sort By';
    }
  };

  const handleReset = () => {
    setFilters({});
    setSortBy("");
    setShowSortDropdown(false);
  };

  return (
    <div className={`flex flex-col items-center justify-start gap-10 text-center text-base text-black font-h5-24 mq450:gap-5 ${className}`}>
      <div className="w-full max-w-[1360px] flex flex-row items-start justify-between relative mq750:px-4 mq450:w-full">
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFilterDrawer}
                className="flex items-center gap-2 text-black px-4 py-2 bg-[#fff] border border-solid-[1px] border-black rounded-[50px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
                </svg>
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-white text-black w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-[50px] flex flex-row items-center justify-center py-2 px-6">
                <div className="relative leading-[150%] font-medium mq450:hidden">
                  {sortedProducts.length} Items
                  {Object.values(filters).some(value => value !== "" && value !== false) &&
                    ` (Filtered)`
                  }
                </div>
              </div>

              <div className="relative sort-dropdown">
                <div
                  className="rounded-[50px] border-[#000] border-solid border-[1px] flex items-center py-1.5 px-[15px] gap-2 cursor-pointer"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <div className="relative leading-[150%] font-medium text-sm">{getSortDisplayText()}</div>
                  <Image
                    width={20}
                    height={20}
                    alt=""
                    src="/iconamoonarrowup2-2.svg"
                    className={`transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`}
                  />
                </div>

                {showSortDropdown && (
                  <>
                    <div
                      className="sort-dropdown-overlay"
                      onClick={() => setShowSortDropdown(false)}
                    ></div>
                    <div className="sort-dropdown-menu">
                      <button
                        className={`sort-dropdown-item ${sortBy === '' ? 'active' : ''}`}
                        onClick={() => handleSortChange('')}
                      >
                        Default Sorting
                      </button>
                      <button
                        className={`sort-dropdown-item ${sortBy === 'bestSeller' ? 'active' : ''}`}
                        onClick={() => handleSortChange('bestSeller')}
                      >
                        Sort by Bestseller
                      </button>
                      <button
                        className={`sort-dropdown-item ${sortBy === 'newArrival' ? 'active' : ''}`}
                        onClick={() => handleSortChange('newArrival')}
                      >
                        Sort by New Arrival
                      </button>
                      <button
                        className={`sort-dropdown-item ${sortBy === 'nameAsc' ? 'active' : ''}`}
                        onClick={() => handleSortChange('nameAsc')}
                      >
                        Sort A-Z
                      </button>
                      <button
                        className={`sort-dropdown-item ${sortBy === 'nameDesc' ? 'active' : ''}`}
                        onClick={() => handleSortChange('nameDesc')}
                      >
                        Sort Z-A
                      </button>
                      <button
                        className={`sort-dropdown-item ${sortBy === 'priceLowToHigh' ? 'active' : ''}`}
                        onClick={() => handleSortChange('priceLowToHigh')}
                      >
                        Price: Low to High
                      </button>
                      <button
                        className={`sort-dropdown-item ${sortBy === 'priceHighToLow' ? 'active' : ''}`}
                        onClick={() => handleSortChange('priceHighToLow')}
                      >
                        Price: High to Low
                      </button>
                      <button
                        className={`sort-dropdown-item ${sortBy === 'newest' ? 'active' : ''}`}
                        onClick={() => handleSortChange('newest')}
                      >
                        Sort by Newest
                      </button>
                      <button
                        className={`sort-dropdown-item ${sortBy === 'rating' ? 'active' : ''}`}
                        onClick={() => handleSortChange('rating')}
                      >
                        Sort by Rating
                      </button>
                      <button
                        className={`sort-dropdown-item ${sortBy === 'reviews' ? 'active' : ''}`}
                        onClick={() => handleSortChange('reviews')}
                      >
                        Sort by Reviews
                      </button>
                      <button
                        className="sort-dropdown-item text-red-400"
                        onClick={handleReset}
                      >
                        Reset All
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid - Fixed the missing return statement here */}
          <div className="skeleton-grid flex flex-row items-start justify-start flex-wrap gap-8 mq750:gap-4 mq450:gap-2 mq450:justify-between w-full mq1050:justify-center">
            {loading ? (
              // Show skeleton loaders during loading
              Array.from({ length: 8 }, (_, index) => (
                <div key={`skeleton-${index}`} className="w-[calc(25%-24px)] min-w-[260px] max-w-[320px] mq750:w-[48%] mq450:w-[48%] mq450:min-w-0 min-h-[480px]">
                  <SkeletonLoader />
                </div>
              ))
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((product, index) => {
                const currencySymbol = getCurrencySymbol(selectedCountry);
                const productPrice = getCountryPrice(product.price);
                const displayPrice = productPrice ? `${currencySymbol} ${productPrice}` : '';

                const productDiscountPrice = getCountryPrice(product.discountPrice);
                const displayDiscountPrice = productDiscountPrice ? `${currencySymbol} ${productDiscountPrice}` : '';

                const productRating = getCountryPrice(product.ratings);
                const displayProductRatings = productRating ? `${productRating}` : '';

                return (
                  <div key={product._id || index} className="w-[calc(25%-24px)] min-w-[260px] max-w-[320px] mq750:w-[48%] mq450:w-[48%] mq450:min-w-0">
                    <Card
                      stock={product.stock}
                      productId={product._id}
                      images={product.imageLinks?.image1}
                      hoverImage={product.imageLinks?.image3}
                      classic={product.collection?.name}
                      name={product?.name?.en}
                      icroundStar="/icroundstar-1.svg"
                      dialColor={product?.watchDetails?.dialColor?.en}
                      price={displayPrice}
                      discountPrice={displayDiscountPrice}
                      country={country}
                      rating={displayProductRatings}
                    />
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-10">No products available</div>
            )}
          </div>

          {/* Pagination - Added the pagination component */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-12 mb-8">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-black text-white rounded-full font-medium border border-solid-1px border-black hover:border-black hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                {loadingMore ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-black rounded-full"></div>
                    Loading...
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      {isBrowser && showFilterDrawer && createPortal(
        <div className="fixed inset-0 bg-white bg-opacity-70 z-[9999]" onClick={toggleFilterDrawer}>
          <div
            className="fixed top-0 left-0 h-full w-[320px] bg-white border-r border-gray-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="p-4 h-[calc(100%-72px)]">
              <ShopFilter onFilterChange={handleFilterChange} initialFilters={filters} onReset={handleReset} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// Define the Pagination component outside the Main component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage > 2) {
        pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-l-md border border-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
        >
          Previous
        </button>

        {getPageNumbers().map((number, index) => (
          <button
            key={index}
            onClick={() => typeof number === 'number' ? onPageChange(number) : null}
            className={`px-3 py-2 border-t border-b border-gray-700 ${number === '...'
              ? 'pointer-events-none'
              : currentPage === number
                ? 'bg-white text-black'
                : 'hover:bg-gray-800'
              }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-r-md border border-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

Main.propTypes = {
  className: PropTypes.string,
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  selectedCountry: PropTypes.string
};

export default Main;