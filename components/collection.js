"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getTopCollections } from "../services/productService";
import { useCountry } from "../context/CountryContext";

const MotionOverlay = ({ opacity }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity }}
    transition={{ duration: 1.5 }}
    className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/70 z-[-1]"
  />
);

const Collection = ({ className = "", property1 = "Default", limit = 10, country }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCountry, countryData } = useCountry();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getTopCollections(limit);

        if (data && data.length > 0) {
          // Map through categories and add country-specific information
          const countrySpecificCategories = data.map(category => ({
            ...category,
            name: category.information?.[selectedCountry]?.name || category.name,
            description: category.information?.[selectedCountry]?.title || "Porem ipsum dolor sit amet, consectetur adipiscing elit."
          }));

          setCategories(countrySpecificCategories);
        } else {
          // Fallback to direct API call if needed
          const response = await fetch("https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/categories/all");
          const apiData = await response.json();

          if (apiData.success) {
            const countrySpecificCategories = apiData.data
              .slice(0, limit)
              .map(category => ({
                ...category,
                name: category.information?.[selectedCountry]?.name || category.name,
                description: category.information?.[selectedCountry]?.description || "Porem ipsum dolor sit amet, consectetur adipiscing elit."
              }));

            setCategories(countrySpecificCategories);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit, selectedCountry]); // Re-fetch when country changes

  if (loading) {
    return (
      <section className="self-stretch overflow-hidden flex flex-col items-center justify-start py-[60px] px-10 gap-10 z-[6] text-left text-29xl text-[#000] font-h5-24">
        <div className="w-[1360px] flex justify-center">
          <div className="text-black">Loading collections...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="self-stretch overflow-hidden flex flex-col items-center justify-start py-[60px] px-[40px] gap-[60px] z-[6] text-left text-29xl text-[#000] font-h5-24 mq1050:gap-5 mq1050:pt-[39px] mq1050:pb-[39px] mq1050:box-border mq450:px-[24px] mq450:py-[30px]">
      <div className="w-[1360px] max-w-full flex flex-row items-center justify-between gap-[60px] mq450:gap-[30px]">
        <h2 className="m-0 relative text-[48px] leading-[120%] font-bold font-[inherit] mq750:text-[34px] mq750:leading-[40px] mq1050:text-[45px] mq1050:leading-[54px] mq450:text-[24px] mq450:leading-[120%]">
          {country?.collection_title}
        </h2>
        <div className="flex flex-row items-start justify-center gap-4 mq450:gap-2 mq450:hidden">
          <button className="swiper-button-prev-custom focus:outline-none bg-transparent cursor-pointer">
            <Image
              className="h-11 w-11 relative overflow shrink-0 object-contain mq450:h-8 mq450:w-8"
              loading="lazy"
              width={44}
              height={44}
              alt="solararrowuplinear-2@2x"
              src="/solararrowuplinear-2@2x.webp"
            />
          </button>
          <button className="swiper-button-next-custom focus:outline-none bg-transparent cursor-pointer">
            <Image
              className="h-11 w-11 relative overflow shrink-0 object-contain mq450:h-8 mq450:w-8"
              loading="lazy"
              width={44}
              height={44}
              alt="solararrowuplinear-1@2x"
              src="/solararrowuplinear-1@2x.webp"
            />
          </button>
        </div>
      </div>
      <div className="w-[1360px] max-w-full">
        <Swiper
          modules={[Navigation]}
          spaceBetween={10} // Reduced from 20 to 10
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.1,
              spaceBetween: 10
            },
            450: {
              slidesPerView: 2,
              spaceBetween: 10
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15 // Reduced from 20 to 15
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 15 // Reduced from 20 to 15
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 15 // Reduced from 20 to 15
            },
            1280: {
              slidesPerView: 3.2,
              spaceBetween: 15 // Reduced from 20 to 15
            }
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id}>
              <Link
                href={`/collection?id=${category.id || category._id || category.name}`}
                className="max-w-[400px] h-[500px] flex flex-col rounded-3xl overflow-hidden flex-shrink-0 bg-no-repeat bg-black relative mq450:max-w-[350px] mq450:rounded-2xl mq450:h-[500px] text-white no-underline hover:no-underline cursor-pointer"
                style={{
                  backgroundImage: `url("${category.image || (Array.isArray(category.images) && category.images[0]) || "default-category.jpg"}")`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
              >
                {/* Empty space that pushes content to bottom */}
                <div className="flex-grow" />
                {/* Content container aligned to bottom */}
                <div className="bg-gradient-to-t from-black/80 to-transparent w-full">
                  <div className="flex flex-col items-start justify-end px-5 mq450:px-4 space-y-2 h-full pb-5 mq450:px-[24px]"> {/* Reduced space-y and added pb-5 */}
                    <h3 className="text-white text-[32px] font-600 leading-tight mq450:text-center mq450:text-[24px] mb-1"> {/* Added mb-1 to reduce gap after heading */}
                      {category.name?.en || category.name}
                    </h3>
                    <p className="text-white text-[16px] font-medium leading-snug mq450:text-base pb-[60px]"> {/* Added pb-5 for bottom padding */}
                      {((category.description?.en || category.description || "Porem ipsum dolor sit amet, consectetur adipiscing elit.")
                        .slice(0, 70) +
                        ((category.description?.en || category.description || "").length > 70 ? '...' : '')
                      )}
                    </p>
                    <div className="rounded-full bg-white overflow-hidden hidden flex-row items-center justify-center py-2 px-6 text-black text-center">
                      <div className="font-medium">Shop Now</div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );

};

Collection.propTypes = {
  className: PropTypes.string,
  property1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  limit: PropTypes.number,
};

export default Collection;