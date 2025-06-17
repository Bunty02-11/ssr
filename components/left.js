import Image from "next/image";
import PropTypes from "prop-types";
import { useState } from "react";

const Left = ({ className = "", product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  // Function to decode URL
  const decodeImageUrl = (url) => {
    try {
      return decodeURIComponent(url);
    } catch (e) {
      console.error("Error decoding URL:", e);
      return url; // Return original if decoding fails
    }
  };

  // Get all image URLs from the product object and decode them
  const imageLinks = product?.imageLinks
    ? Object.keys(product.imageLinks)
        .filter((key) => /^image\d+$/.test(key))
        .sort((a, b) => {
          const numA = parseInt(a.replace("image", ""), 10);
          const numB = parseInt(b.replace("image", ""), 10);
          return numA - numB;
        })
        .map((key) => decodeImageUrl(product.imageLinks[key]))
        .filter(Boolean)
    : [];
  
  const hasImages = imageLinks.length > 0;
  const visibleThumbnails = 4;

  // Calculate visible thumbnail range with looping
  const getVisibleThumbnails = () => {
    const thumbnails = [];
    for (let i = 0; i < visibleThumbnails; i++) {
      const index = (thumbnailStartIndex + i) % imageLinks.length;
      thumbnails.push({
        image: imageLinks[index],
        actualIndex: index
      });
    }
    return thumbnails;
  };

  // Navigation handlers
  const handleNext = () => {
    if (!hasImages) return;

    const nextIndex = (currentImageIndex + 1) % imageLinks.length;
    setCurrentImageIndex(nextIndex);

    if (nextIndex >= (thumbnailStartIndex + visibleThumbnails) % imageLinks.length) {
      setThumbnailStartIndex((prev) => (prev + 1) % imageLinks.length);
    }
  };

  const handlePrevious = () => {
    if (!hasImages) return;

    const prevIndex = (currentImageIndex - 1 + imageLinks.length) % imageLinks.length;
    setCurrentImageIndex(prevIndex);

    if (
      prevIndex < thumbnailStartIndex ||
      (thumbnailStartIndex + visibleThumbnails) % imageLinks.length > thumbnailStartIndex &&
      prevIndex >= (thumbnailStartIndex + visibleThumbnails) % imageLinks.length
    ) {
      setThumbnailStartIndex((prev) => (prev - 1 + imageLinks.length) % imageLinks.length);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    if (imageLinks.length > visibleThumbnails) {
      setThumbnailStartIndex((index - Math.floor(visibleThumbnails / 2) + imageLinks.length) % imageLinks.length);
    }
  };

  return (
    <div
      className={`h-auto flex flex-col justify-center items-center relative min-w-[300px] max-w-full md:min-w-[600px] mq750:min-w-full mq1125:flex-1 ${className}`}
    >
      {/* Main Image Container */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] flex justify-center items-center">
        {hasImages ? (
          <Image
            className="rounded-3xl w-full h-full object-contain"
            width={600}
            height={600}
            alt="Product image"
            src={imageLinks[currentImageIndex]}
            priority
          />
        ) : (
          <Image
            className="rounded-3xl w-full h-full object-cover"
            width={500}
            height={500}
            alt="No product image available"
            src="/rectangle-3@2x.webp"
          />
        )}
      </div>

      {/* Thumbnail Navigation */}
      {hasImages && imageLinks.length > 1 && (
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 relative w-full max-w-[300px] sm:max-w-[500px]">
          <div className="flex gap-4 overflow-hidden px-2">
            {getVisibleThumbnails().map(({ image, actualIndex }) => (
              <div
                key={actualIndex}
                onClick={() => handleThumbnailClick(actualIndex)}
                className={`flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  currentImageIndex === actualIndex
                    ? "border-black scale-105"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${actualIndex + 1}`}
                  width={96}
                  height={96}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dots Indicator */}
      {hasImages && imageLinks.length > 1 && (
        <div className="mt-2 sm:mt-4 flex justify-center">
          <div className="rounded-[50px] bg-[rgba(0,0,0,0.08)] overflow-hidden flex flex-col items-start justify-start py-2 px-3">
            <div className="flex gap-1 sm:gap-2">
              {imageLinks.map((_, index) => (
                <button
                  key={index}
                  className={`h-[4px] w-[4px] sm:h-[5px] sm:w-[5px] rounded-[50%] ${
                    index === currentImageIndex
                      ? "bg-[#000]"
                      : "bg-[rgba(0,0,0,0.16)]"
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    if (imageLinks.length > visibleThumbnails) {
                      setThumbnailStartIndex(
                        (index - Math.floor(visibleThumbnails / 2) + imageLinks.length) % imageLinks.length
                      );
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {hasImages && imageLinks.length > 1 && (
        <>
          <div
            className="absolute top-[calc(50%_-_20px)] left-[8px] sm:left-[16px] rounded-[100px] w-8 h-8 sm:w-10 sm:h-10 overflow-hidden z-[1] cursor-pointer flex items-center justify-center bg-white/80 hover:bg-white"
            onClick={handlePrevious}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>

          <div
            className="absolute top-[calc(50%_-_20px)] right-[8px] sm:right-[16px] rounded-[100px] w-8 h-8 sm:w-10 sm:h-10 overflow-hidden z-[1] cursor-pointer flex items-center justify-center bg-white/80 hover:bg-white"
            onClick={handleNext}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

Left.propTypes = {
  className: PropTypes.string,
  product: PropTypes.shape({
    imageLinks: PropTypes.objectOf(PropTypes.string),
  }),
};

export default Left;