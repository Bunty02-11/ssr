"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import AnimateOnScroll from "../../../components/AnimateOnScroll";
import PageBanner from "../../../components/page-banner";
import { toast } from "react-hot-toast";
import { useCountry } from "../../../context/CountryContext";

const WishlistPageComponent = ({ initialData }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { wishlist, loading, removeFromWishlist, clearWishlist, isInWishlist } = useWishlist();
  const { selectedCountry, updateCountry } = useCountry();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);

  const handleCountrySelect = (country) => {
    updateCountry(country);
  };

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
    if (!priceObj) return '';
    if (typeof priceObj === 'object') {
      if (!selectedCountry) return Object.values(priceObj)[0] || '';
      const countryKey = selectedCountry.toLowerCase();
      return priceObj[countryKey] || Object.values(priceObj)[0] || '';
    }
    // If price is a string or number, just return it
    return priceObj;
  };

  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      await addToCart({
        productId: product._id,
        name: product.name?.en || product.name,
        price: product.price,
        images: product.imageLinks ? Object.values(product.imageLinks) : [product.imageLinks?.image1],
        image: product.imageLinks?.image1 ? product.imageLinks.image1.trim().replace(/`/g, '') : "/default-watch.jpg",
        quantity: 1
      });

      // Remove from wishlist after adding to cart
      removeFromWishlist(product._id);

      toast.success(`${product.name?.en || product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  // Continue shopping
  const handleContinueShopping = () => {
    router.push("/shop");
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar
        logoSrc="/logo.webp"
        search="/search.svg"
        account="/account.svg"
        sVG="/svg2.svg"
        onCountrySelect={handleCountrySelect}
        navbarBackgroundColor={"transparent"}
      />
      <PageBanner title="My Wishlist" breadcrumb="Home > Wishlist" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimateOnScroll animation="fadeIn" className="self-stretch">
          <div className="w-full max-w-[1360px] mx-auto">
            {wishlist.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-medium">Wishlist Items</h2>
                    <button
                      onClick={clearWishlist}
                      className="px-4 py-2 bg-black rounded-[100px] border border-white text-white border border-solid-1px border-white hover:border-black hover:bg-white hover:text-black transition-colors"
                      disabled={loading}
                    >
                      Clear Wishlist
                    </button>
                  </div>

                  <div className="bg-white rounded-lg overflow-hidden">
                    {/* Desktop Header */}
                    <div className="hidden md:grid grid-cols-12 p-4 bg-gray-200 text-black font-medium">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-3 text-center">Price</div>
                      <div className="col-span-3 text-center">Actions</div>
                    </div>

                    {currentItems.map((product, index) => {
                      const productPrice = getCountryPrice(product?.price);
                      const currencySymbol = getCurrencySymbol(selectedCountry);

                      // Only prepend the currency symbol if productPrice does not already start with it
                      let displayPrice = '';
                      if (typeof productPrice === 'string' && productPrice.trim().toUpperCase().startsWith(currencySymbol.toUpperCase())) {
                        displayPrice = productPrice;
                      } else if (productPrice) {
                        displayPrice = `${currencySymbol} ${productPrice}`;
                      } else if (product?.price) {
                        displayPrice = `${currencySymbol} ${product.price}`;
                      }

                      return (
                        <div
                          key={product._id}
                          className={`relative grid grid-cols-1 md:grid-cols-12 p-4 border border-solid-1px border-black items-center text-black gap-4 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                            } transition-colors`}
                        >
                          {/* Mobile Remove button */}
                          <div className="absolute top-2 right-2 md:hidden">
                            <button
                              onClick={() => removeFromWishlist(product._id)}
                              className="px-3 py-1 bg-transparent border border-red-600 text-red-600 rounded-[100px] hover:bg-red-600 hover:text-black transition-colors"
                              disabled={loading}
                            >
                              Remove
                            </button>
                          </div>

                          {/* Product */}
                          <div className="md:col-span-6 flex items-center gap-4">
                            <div className="relative h-[188px] w-[188px] mq450:h-[120px] mq450:w-[120px] bg-transparent rounded-md overflow-hidden">
                              <img
                                src={
                                  product.imageLinks?.image1
                                    ? product.imageLinks.image1.trim().replace(/`/g, "")
                                    : "/default-watch.jpg"
                                }
                                alt={product.name?.en || product.name || "Watch"}
                                className="h-full w-full object-contain"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src = "/default-watch.jpg";
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium mq450:text-sm mq450:py-2">{product.name?.en || product.name || "Watch"}</h3>
                              <p className="text-sm text-gray-400 mq450:text-xs">
                                {product.watchDetails?.watchType?.en || product.classic || "Watch"}
                              </p>
                            </div>
                          </div>

                          {/* Desktop Price */}
                          <div className="hidden md:block md:col-span-3 text-center">
                            {displayPrice}
                          </div>

                          {/* Desktop Actions */}
                          <div className="hidden md:flex md:col-span-3 justify-center gap-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-3 py-1 border border-solid-1px border-black bg-white text-black rounded-[100px] hover:bg-black hover:text-white transition-colors"
                              disabled={loading}
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => removeFromWishlist(product._id)}
                              className="px-3 py-1 bg-transparent border border-red-600 text-red-600 rounded-[100px] hover:text-black hover:bg-red-600 transition-colors"
                              disabled={loading}
                            >
                              Remove
                            </button>
                          </div>

                          {/* Mobile: Price and Add to Cart row */}
                          <div className="md:hidden flex items-center justify-between gap-4">
                            <div className="text-black">{displayPrice}</div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-3 py-1 bg-white text-black rounded-[100px] hover:bg-gray-200 transition-colors"
                              disabled={loading}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <nav className="flex items-center">
                        <button
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-l-md border border-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                            }`}
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`px-3 py-1 border-t border-b border-gray-700 ${currentPage === index + 1
                              ? 'bg-white text-black'
                              : 'hover:bg-gray-800'
                              }`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-r-md border border-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                            }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      onClick={handleContinueShopping}
                      className="py-2 px-6 bg-black text-white rounded-[100px] border border-solid-1px border-white hover:border-black hover:bg-white hover:text-black transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-medium mb-6">
                  Your Wishlist is empty
                </h2>
                <button
                  onClick={handleContinueShopping}
                  className="rounded-[100px] bg-white border border-solid-1px border-black text-black py-3 px-10 font-medium hover:bg-black hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </AnimateOnScroll>
      </div>
      <Footer
        maskGroup="/logo.webp"
        iconYoutube="/icon--youtube.svg"
        itemImg="/icon--facebook.svg"
        itemImg1="/icon--instagram.svg"
        itemImg2="/icon--linkedin.svg"
      />
    </div>
  );
};

export default WishlistPageComponent; 