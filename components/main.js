"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import axios from "../services/axios";
import Card from "./card";
import SkeletonLoader from "./SkeletonLoader";
import ShopFilter from "../app/shop/ShopFilter";
import { createPortal } from "react-dom";

const Main = ({ className = "", country }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const getCurrencySymbol = (country) => {
    if (!country) return '$';
    const countryUpper = country.toUpperCase();
    switch (countryUpper) {
      case 'INDIA': return '₹';
      case 'UAE': return 'AED';
      case 'KSA': return 'SR';
      case 'KUWAIT': return 'KD';
      case 'QATAR': return 'QAR';
      default: return '$';
    }
  };

  const fetchProducts = async (pageNum = 1, currentFilters = {}, currentSortBy = "", isLoadMore = false) => {
    try {
      isLoadMore ? setLoadingMore(true) : setLoading(true);
      const params = new URLSearchParams();

      // Add currency parameter based on country
      params.append('currency', country?.toLowerCase() || 'uae');

      // Add price filters if they exist
      console.log("Price filters before applying:", {
        priceMin: currentFilters.priceMin,
        priceMax: currentFilters.priceMax,
        type: typeof currentFilters.priceMin,
        isNumber: !isNaN(currentFilters.priceMin)
      });

      if (currentFilters.priceMin !== undefined && currentFilters.priceMin !== null && currentFilters.priceMin !== "") {
        params.append('priceMin', currentFilters.priceMin);
      }
      if (currentFilters.priceMax !== undefined && currentFilters.priceMax !== null && currentFilters.priceMax !== "") {
        params.append('priceMax', currentFilters.priceMax);
      }

      // Add other filters
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== "" && value !== false && key !== 'priceMin' && key !== 'priceMax') {
          params.append(key, value);
        }
      });

      if (currentSortBy) {
        params.append('sortBy', currentSortBy);
      }

      params.append('page', pageNum);
      params.append('limit', 12);

      const url = `https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/products/filters/search?${params.toString()}`;
      console.log("API URL with params:", url);

      const response = await axios.get(url);

      const data = response.data;
      console.log("API Response:", data);

      if (data && data.products) {
        if (isLoadMore) {
          setProducts(prevProducts => [...prevProducts, ...data.products]);
        } else {
          setProducts(data.products);
        }
        setTotalProducts(data.totalProducts || 0);
        const totalPagesCount = Math.ceil((data.totalProducts || 0) / 12);
        setTotalPages(totalPagesCount);
        setHasMore(pageNum < totalPagesCount);
      } else {
        console.error("API response missing products array:", data);
        setProducts(isLoadMore ? prevProducts => prevProducts : []);
        setTotalProducts(0);
        setTotalPages(0);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(isLoadMore ? prevProducts => prevProducts : []);
      setTotalProducts(0);
      setTotalPages(0);
      setHasMore(false);
    } finally {
      isLoadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1, filters, sortBy);
  }, [filters, sortBy]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, filters, sortBy, true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
  };

  const toggleFilterDrawer = () => {
    setShowFilterDrawer(!showFilterDrawer);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = !showFilterDrawer ? 'hidden' : 'unset';
    }
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
      default: return 'Sort-By';
    }
  };

  const handleReset = () => {
    setFilters({});
    setSortBy("");
    setShowSortDropdown(false);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== "" && value !== false).length;
  };

  return (
    <div className={`flex flex-col items-center justify-start gap-10 text-center text-base text-black font-h5-24 mq450:gap-5 ${className}`}>
      <div className="w-full max-w-[1360px] flex flex-row items-start justify-between relative mq750:px-4 mq450:w-full">
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFilterDrawer}
                className="flex items-center gap-2 text-black px-4 py-2 bg-white border border-solid-1px border-black/15 rounded-[50px]"
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
                  {totalProducts} Items
                  {Object.values(filters).some(value => value !== "" && value !== false) &&
                    ` (Filtered)`
                  }
                </div>
              </div>

              <div className="relative sort-dropdown">
                <div
                  className="rounded-[50px] border-black/15 border-solid border-[1px] flex items-center py-1.5 px-[15px] gap-2 cursor-pointer"
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

          <div className="skeleton-grid flex flex-row items-start justify-start flex-wrap gap-8 mq750:gap-4 mq450:gap-2 mq450:justify-between w-full mq1050:justify-center">
            {loading ? (
              // Show skeleton loaders during loading
              Array.from({ length: 8 }, (_, index) => (
                <div key={`skeleton-${index}`} className="w-[calc(25%-24px)] min-w-[260px] max-w-[320px] mq750:w-[46%] mq450:w-[48%] mq450:min-w-0 min-h-[480px]">
                  <SkeletonLoader />
                </div>
              ))
            ) : products && products.length > 0 ? (
              products.map((product, index) => {
                const currencySymbol = getCurrencySymbol(country);
                const countryKey = country ? country.toLowerCase() : '';
                const productPrice = product.price && countryKey
                  ? product.price[countryKey] || Object.values(product.price)[0]
                  : '';
                const displayPrice = productPrice ? `${currencySymbol} ${productPrice}` : '';

                const productDiscountPrice = product.discountPrice && countryKey
                  ? product.discountPrice[countryKey] || Object.values(product.discountPrice)[0]
                  : '';
                const displayDiscountPrice = productDiscountPrice ? `${currencySymbol} ${productDiscountPrice}` : '';


                const productRating = product.ratings && countryKey
                  ? product.ratings[countryKey] || Object.values(product.ratings)[0]
                  : '';
                const displayProductRating = productRating ? ` ${productRating}` : '';

                return (
                  <div key={product._id || index} className="w-[calc(25%-24px)] min-w-[260px] max-w-[320px] mq750:w-[46%] mq450:w-[48%] mq450:min-w-0">
                    {/* {console.log("Rendering product:", product)} */}
                    <Card
                      stock={product.stock}
                      productId={product._id}
                      images={product.imageLinks?.image1}
                      hoverImage={product.imageLinks?.image3}
                      classic={product.collection?.name || "Classic"}
                      name={product?.name?.en}
                      icroundStar="/icroundstar-1.svg"
                      dialColor={product?.watchDetails?.dialColor?.en}
                      price={displayPrice}
                      discountPrice={displayDiscountPrice}
                      country={country}
                      rating={displayProductRating}
                    />
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-10">No products available</div>
            )}
          </div>

          {hasMore && !loading && (
            <div className="flex justify-center mt-12 mb-8">
              <button
                onClick={loadMore}
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

      {isBrowser && showFilterDrawer && createPortal(
        <div className="fixed inset-0 bg-white bg-opacity-70 z-[9999]" onClick={toggleFilterDrawer}>
          <div
            className="fixed top-0 left-0 h-full w-[320px] bg-white border-r border-gray-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="p-4 h-[calc(100%-72px)]">
              <ShopFilter
                onFilterChange={handleFilterChange}
                initialFilters={filters}
                onReset={handleReset}
                country={country}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

Main.propTypes = {
  className: PropTypes.string,
  country: PropTypes.string,
};

export default Main;