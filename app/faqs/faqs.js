// app/delivery-policy/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Inter } from 'next/font/google';
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";
import Image from "next/image";
import axios from "axios";
import { useCountry } from "../../context/CountryContext";

const inter = Inter({ subsets: ['latin'] });

const Faqs = ({ initialData }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [faqData, setFaqData] = useState(initialData?.faqData || null);
    const [loading, setLoading] = useState(!initialData?.faqData); // Start with false if we have initial data
    const [error, setError] = useState(null);
    const { selectedCountry } = useCountry();

    useEffect(() => {
        const fetchFaqData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/faq-country");
                setFaqData(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to load FAQs. Please try again later.");
                console.error("Error fetching FAQ data:", err);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we don't have initial data from SSR
        if (!initialData?.faqData) {
            fetchFaqData();
        }
    }, [initialData]);
    // console.log(faqData?.data[0], "faqData");

    // Determine which country to use (default to 'india')
    const countryKey = (selectedCountry || "india").toLowerCase();
    const countryFaqs = faqData?.data[0] && faqData?.data[0][countryKey] ? faqData?.data[0][countryKey].faqs : [];

    // console.log(countryFaqs, "countryFaqs");

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    return (

        <>
            <Navbar
                logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
                search="/search1.svg"
                account="/account1.svg"
                sVG="/svg1.svg"
                navbarBackgroundColor={"transparent"}
            />
            <PageBanner
                title="Frequently Asked Questions"
                breadcrumb="Home > Frequently Asked Questions"
            />
            <div className={`flex flex-col min-h-screen items-center justify-center ${inter.className}`}>
                <main className="flex-grow">
                    <section
                        className="
                        w-full
                        flex
                        flex-col
                        items-center
                        justify-center
                        px-4
                        py-10
                        box-border
                        z-[11]
                        text-left
                        text-base
                        text-black
                        font-h5-24
                        sm:px-6
                        md:px-10
                        lg:px-20
                        xl:px-0
                        max-w-[1360px]
                    "
                    >
                        <div
                            className="
                            w-full
                            max-w-[1360px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-8
                            md:gap-10
                            lg:gap-12
                        "
                        >
                            <h2 className="
                            w-full
                            text-center
                            text-[2rem]
                            md:text-[2.5rem]
                            lg:text-[3rem]
                            font-bold
                            mb-4
                            leading-tight
                        ">
                                Frequently Asked Questions
                            </h2>
                            <div className="w-full flex flex-col items-center justify-center">
                                {countryFaqs && countryFaqs.length > 0 ? (
                                    countryFaqs.map((faq, index) => (
                                        <div
                                            key={index}
                                            className={
                                                `
                                            w-full
                                            bg-white
                                            rounded-xl
                                            shadow
                                            mb-4
                                            transition-all
                                            duration-200
                                            border
                                            ` +
                                                (activeIndex === index ? "border-black" : "border-gray-200")
                                            }
                                        >
                                            <div
                                                className="
                                                flex
                                                flex-row
                                                items-center
                                                justify-between
                                                py-4
                                                px-5
                                                cursor-pointer
                                                select-none
                                            "
                                                onClick={() => toggleFAQ(index)}
                                            >
                                                <div className="flex-1 text-lg md:text-xl font-medium">
                                                    {`${index + 1}) ${faq.question}`}
                                                </div>
                                                <Image
                                                    className={`w-6 h-6 transition-transform duration-200 ${activeIndex === index ? "rotate-180" : ""}`}
                                                    width={24}
                                                    height={24}
                                                    alt="iconamoonarrowup21-1@2x"
                                                    src="/iconamoonarrowup21-1@2x.webp"
                                                />
                                            </div>
                                            <div
                                                className={
                                                    `
                                                overflow-hidden
                                                transition-all
                                                duration-300
                                                px-5
                                                ` +
                                                    (activeIndex === index
                                                        ? "max-h-[500px] opacity-100 pb-4"
                                                        : "max-h-0 opacity-0")
                                                }
                                            >
                                                <div className="text-base md:text-lg text-black/80">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-center py-10">No FAQs available for this country.</div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                <Footer
                    footerAlignSelf="stretch"
                    footerWidth="unset"
                    maskGroup="/mask-group@2x.webp"
                    iconYoutube="/icon--youtube2.svg"
                    itemImg="/item--img3.svg"
                    itemImg1="/item--img-13.svg"
                    itemImg2="/item--img-23.svg"
                />
            </div>
        </>
    );
};

export default Faqs;