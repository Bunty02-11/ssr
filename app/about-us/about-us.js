"use client"
import Image from "next/image";
import Description from "../../components/ourStory";
import Reason from "../../components/reason";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCountry } from "../../context/CountryContext";

const AboutUs = ({ initialData }) => {
  const [home, setHome] = useState(initialData?.aboutData || { data: [] });
  const [loading, setLoading] = useState(false); // Start with false since we have initial data
  const [error, setError] = useState(null);
  const { selectedCountry, updateCountry, countryData, setCountryData } = useCountry();

  const fetchHome = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/about/`);
      console.log(response.data, "Products data from API");
      setHome(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize country data from SSR if available
  useEffect(() => {
    if (initialData?.countryData && !countryData) {
      setCountryData(initialData.countryData);
    }
  }, [initialData?.countryData, countryData, setCountryData]);

  useEffect(() => {
    if (home && home[0]) {
      const countrySpecificData = home[0]?.[selectedCountry];
      console.log('Country specific data:', countrySpecificData);
      if (countrySpecificData) {
        setCountryData(countrySpecificData);
        console.log('Updated country data:', countrySpecificData);
      } else {
        console.log('No data found for country:', selectedCountry);
      }
    } else {
      console.log('No home data available yet');
    }
  }, [selectedCountry, home.data, setCountryData]);

  const handleCountrySelect = (country) => {
    updateCountry(country);
  };

  useEffect(() => {
    // Only fetch if we don't have initial data from SSR
    if (!initialData?.aboutData?.data?.length) {
    fetchHome();
    }
  }, [initialData]);
  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-center justify-start leading-[normal] tracking-[normal]">
      {/* <header className="self-stretch bg-black overflow-hidden flex flex-row items-start justify-start py-[13px] px-10 box-border top-[0] z-[99] sticky max-w-full text-center text-xs text-white font-h5-24">
        <div className="w-[1360px] flex flex-row items-center justify-between gap-5 max-w-full">
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0 object-contain"
            loading="lazy"
            width={24}
            height={24}
            alt="iconamoonarrowup2@2x"
            src="/iconamoonarrowup2@2x.webp"
          />
          <div className="relative leading-[150%] font-medium">
            Sale: 20% Off - Limited Time Only
          </div>
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0 object-contain"
            loading="lazy"
            width={24}
            height={24}
            alt="iconamoonarrowup2-1@2x"
            src="/iconamoonarrowup2-1@2x.webp"
          />
        </div>
      </header> */}

      <PageBanner title="About Us" breadcrumb="Home > About Us" />

      <Description
        descriptionAlignSelf="unset"
        descriptionWidth="1440px"
        textMinWidth="unset"
        img="/our_story.jpg"
        country={countryData}
      />
      {/* <section className="self-stretch overflow-hidden flex flex-col items-center justify-start py-0 px-10 z-[3] mq1050:gap-[30px] mq450:px-4">
        <Reason country={countryData} />
      </section> */}
      <section className="self-stretch overflow-hidden flex flex-row mq1050:flex-row items-start justify-center p-10 z-[4] text-left text-base text-[rgba(255,255,255,0.8)] font-h5-24 mq450:flex-col mq450:px-[24px] mq450:py-[40px] mq450:gap-[24px] mq450:box-border mq1050:gap-5">
        <div className="w-full max-w-[1360px] flex flex-row items-center justify-between gap-6 mq1050:flex-row mq1050:gap-8 mq450:flex-col ">
          <div className="h-[420px] w-[660px] mq1280:h-[420px] mq1280:w-[560px] mq1050:h-[500px] mq1050:w-[450px] mq750:h-[400px] mq750:w-[330px] rounded-3xl flex flex-row items-end justify-start py-[60px] px-10 box-border bg-[url('/our_mission.jpg')] bg-cover bg-no-repeat bg-[top] mq1050:gap-[30px] mq1050:w-full mq750:py-[40px]  mq750:px-6 mq450:h-[350px] mq450:py-[30px] mq450:px-4 relative">
            {/* Add overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

            <div className="self-stretch w-[580px] max-w-full flex flex-col items-center justify-start gap-4 z-10">
              <div className="w-[580px] relative leading-[150%] font-medium text-center hidden">
                Limited Offer
              </div>
              <h2 className="m-0 self-stretch relative text-[36px] mq450:text-center leading-[140%] font-bold font-[inherit] text-[#fff] mq750:text-[24px] mq750:leading-[34px] mq450:text-[20px] mq450:leading-[28px]">
                Our Mission
              </h2>
              <div className="self-stretch relative leading-[150%] mq450:text-center font-medium text-white mq450:text-sm">
                {countryData?.our_mission}
              </div>
            </div>
          </div>
          <div className="h-[420px] w-[660px] mq1280:h-[420px] mq1280:w-[560px] mq1050:h-[500px] mq1050:w-[450px] mq750:h-[400px] mq750:w-[330px] rounded-3xl flex flex-row items-end justify-start py-[60px] px-10 box-border bg-[url('/our_vision.jpg')] bg-cover bg-no-repeat bg-[top] mq1050:gap-[30px] mq1050:w-full mq750:py-[40px] mq750:px-6 mq450:h-[350px] mq450:py-[30px] mq450:px-4 relative">
            {/* Add overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

            <div className="self-stretch w-[580px] max-w-full flex flex-col items-center justify-start gap-4 z-10">
              <div className="w-[580px]  relative leading-[150%] font-medium text-center hidden">
                Limited Offer
              </div>
              <h2 className="m-0 self-stretch text-white mq450:text-center relative text-[36px] leading-[140%] font-bold font-[inherit] text-[#fff] mq750:text-[24px] mq750:leading-[34px] mq450:text-[20px] mq450:leading-[28px]">
                Our Vision
              </h2>
              <div className="self-stretch text-white mq450:text-center relative leading-[150%] font-medium mq450:text-sm">
                {countryData?.our_vision}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full max-w-[1440px] overflow-hidden flex flex-row items-center mq1050:flex-row justify-center p-10 box-border gap-[60px] z-[5] text-left text-37xl text-[#000] font-h5-24 mq450:flex-col  mq450:px-[24px] mq450:py-[40px] mq450:gap-[24px] mq450:box-border mq1050:gap-[30px]">
        <Image
          className="h-[500px] w-[500px] mq1050:h-[350px] mq1050:w-[350px] mq750:h-[300px] mq750:w-[300px] rounded-3xl object-cover mq1050:w-full mq1050:h-auto mq450:h-[300px]"
          loading="lazy"
          width={500}
          height={500}
          alt="sustanibility"
          src="/sustanibility.jpg"
        />
        <div className="flex-1 w-full flex flex-col  items-start justify-start gap-6">
          <h2 className="m-0 self-stretch relative text-black text-[36px] mq450:text-center leading-[120%] font-bold font-[inherit] mq750:text-[34px] mq750:leading-[40px] mq450:text-[24px] mq450:leading-[34px]">
            Sustainability
          </h2>
          <div className="self-stretch relative text-black mq450:text-center text-base leading-[150%] font-medium mq450:text-sm">
            {countryData?.Sustainability}
          </div>
        </div>
      </section>
      <Footer
        footerAlignSelf="stretch"
        footerWidth="unset"
        maskGroup="/mask-group@2x.webp"
        iconYoutube="/icon--youtube.svg"
        itemImg="/item--img2.svg"
        itemImg1="/item--img-12.svg"
        itemImg2="/item--img-22.svg"
      />
      <Navbar
        logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
        search="/search1.svg"
        account="/account1.svg"
        sVG="/svg1.svg"
        onCountrySelect={handleCountrySelect}
        navbarBackgroundColor={"transparent"}
      />
    </div>
  );
};

export default AboutUs;
