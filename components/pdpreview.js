import PropTypes from "prop-types";
import Review from "./review";
import Image from "next/image";
import TestimonialItems from "./testimonial-items";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useCountry } from "../context/CountryContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Testimonials = ({ Heading }) => {
    const [testimonial, setTestimonial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { selectedCountry } = useCountry();

    const fetchTestimonial = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/testimonials/`);
            console.log("Testimonials API response:", response.data);

            if (response.data && response.data.data && response.data.data[0]) {
                console.log("Setting testimonial to:", response.data.data[0]);
                setTestimonial(response.data.data[0] || {});
            } else if (response.data && response.data[0]) {
                console.log("Setting testimonial to:", response.data[0]);
                setTestimonial(response.data[0] || {});
            } else {
                console.log("Unexpected API response structure:", response.data);
                setTestimonial({});
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            setError("Failed to load testimonials. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonial();
    }, []);

    const countryTestimonials = useMemo(() => {
        console.log("🔍 Processing testimonials - selectedCountry:", selectedCountry);
        console.log("🔍 Processing testimonials - testimonial object:", testimonial);
        console.log("🔍 Testimonial object type:", typeof testimonial);
        console.log("🔍 Testimonial object keys:", testimonial ? Object.keys(testimonial) : 'null');

        if (!selectedCountry || !testimonial || typeof testimonial !== 'object') {
            console.log("❌ Early return: missing selectedCountry or testimonial");
            console.log("   - selectedCountry:", selectedCountry);
            console.log("   - testimonial:", testimonial);
            console.log("   - testimonial type:", typeof testimonial);
            return [];
        }

        const countryData = testimonial[selectedCountry];
        console.log(`🎯 Country data for ${selectedCountry}:`, countryData);

        if (!countryData || !countryData.testimonials || !Array.isArray(countryData.testimonials)) {
            console.log("❌ No valid testimonials found for country:", selectedCountry);
            console.log("   - countryData:", countryData);
            console.log("   - countryData.testimonials:", countryData?.testimonials);
            console.log("   - Available countries in testimonial object:", Object.keys(testimonial));
            return [];
        }

        console.log("✅ Returning testimonials:", countryData.testimonials);
        return countryData.testimonials;
    }, [testimonial, selectedCountry]);

    if (loading) return <div>Loading testimonials...</div>;
    if (error) return <div>{error}</div>;

    // If no testimonials are available for the selected country, show a message
    if (countryTestimonials.length === 0) {
        return (
            <section className="self-stretch overflow-hidden flex flex-col items-center justify-start pt-[60px] px-[40px] gap-[60px] z-[8] text-center font-h5-24 mq1050:px-[8px] mq450:pt-[40px] mq450:px-[4px] mq450:gap-[24px]">
                <div className="w-[1360px] max-w-full flex flex-row items-start justify-center">
                    <h1 className="m-0 relative text-[#000] text-[48px] mq450:text-center leading-[120%] mq450:text-left font-bold font-[inherit] mq750:text-[48px] mq750:leading-[58px] mq450:text-[24px] mq450:leading-[120%]">
                        {Heading?.testimonials_title || "Reviews"}
                    </h1>
                </div>
                <div className="text-gray-600">
                    No Reviews available for the selected region.
                </div>
            </section>
        );
    }

    return (
        <section className="self-stretch overflow-hidden flex flex-col items-center justify-start pt-[60px] px-[80px] gap-[60px] z-[8] text-center font-h5-24 mq1050:px-[8px] mq450:pt-[40px] mq450:px-[8px] mq450:gap-[24px]">
            <div className="w-[1360px] max-w-full flex flex-row items-start justify-center">
                <h1 className="m-0 relative text-[#000] mq450:text-center text-[48px] leading-[120%] mq450:text-left font-bold font-[inherit] mq750:text-[48px] mq750:leading-[58px] mq450:text-[24px] mq450:leading-[120%]">
                    {Heading?.testimonials_title || "Reviews"}
                </h1>
            </div>

            <div className="w-[1360px] max-w-full">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={30}
                    slidesPerView={4}
                    navigation={{
                        nextEl: '.swiper-button-next-testimonial',
                        prevEl: '.swiper-button-prev-testimonial',
                    }}
                    breakpoints={{
                        0: {
                            slidesPerView: 1.3,
                            spaceBetween: 20
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 25
                        },
                        1360: {
                            slidesPerView: 4,
                            spaceBetween: 30
                        },
                    }}
                >
                    {countryTestimonials.map((item, index) => (
                        <SwiperSlide key={index}>
                            <TestimonialItems
                                author={item.author}
                                quote={item.quote}
                                testimonialItemsBackgroundImage={`url('${item.images}')`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="flex flex-row items-center justify-center gap-4 mt-6">
                <button className="swiper-button-prev-testimonial focus:outline-none bg-transparent">
                    <Image
                        className="w-11 h-11 relative overflow-hidden shrink-0 object-contain mq450:w-8 mq450:h-8"
                        width={44}
                        height={44}
                        alt="solararrowuplinear-5@1x"
                        src="/solararrowuplinear-5@1x.webp"
                    />
                </button>
                <button className="swiper-button-next-testimonial focus:outline-none bg-transparent">
                    <Image
                        className="h-11 w-11 relative overflow-hidden shrink-0 object-contain mq450:w-8 mq450:h-8"
                        width={44}
                        height={44}
                        alt="solararrowuplinear-5@2x"
                        src="/solararrowuplinear-5@2x.webp"
                    />
                </button>
            </div>
        </section>
    );
};

Testimonials.propTypes = {
    className: PropTypes.string,
};

export default Testimonials;