"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Content1 from "../../components/content1";
import Form1 from "../../components/form1";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";
import { useCountry } from "../../context/CountryContext";

const Contact = () => {
  const router = useRouter();
  const { selectedCountry, updateCountry, countryData, setCountryData } = useCountry();
  const [home, setHome] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHome = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/contactContent/all`);
      console.log(response.data, "Products data from API");
      setHome(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (home?.data && home?.data[0]) {
      const countrySpecificData = home?.data[0]?.[selectedCountry];
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
  }, [selectedCountry, home.data]);

  const handleCountrySelect = (country) => {
    updateCountry(country);
  };

  useEffect(() => {
    fetchHome();
  }, []);

  console.log("Selected country:", selectedCountry);
  console.log("Country data:", countryData);
  // console.log("Home data:", home.data);
  return (
    <div className="w-full relative bg-white text-black overflow-hidden flex flex-col items-start justify-start leading-[normal] tracking-[normal]">
      {/* <header className="self-stretch bg-black text-white overflow-hidden flex flex-row items-start justify-start py-[13px] px-10 box-border top-[0] z-[99] sticky max-w-full text-center text-xs font-h5-24">
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
      {/* <section className="self-stretch overflow-hidden flex flex-row items-start justify-start pt-[194px] px-10 pb-[60px] box-border bg-[url('/banner1@3x.webp')] bg-cover bg-no-repeat bg-[top] max-w-full text-center text-21xl text-[#fff] font-h5-24">
        <div className="w-[1360px] flex flex-col items-center justify-end gap-6 max-w-full">
          <h1 className="m-0 self-stretch relative text-inherit leading-[120%] font-medium font-[inherit] mq750:text-13xl mq750:leading-[38px] mq1050:text-5xl mq1050:leading-[29px]">
            Contact Us
          </h1>
          <div className="self-stretch relative text-base leading-[150%] font-medium">{`Home > Contact Us`}</div>
        </div>
      </section> */}
      <PageBanner title="Contact Us" breadcrumb="Home > Contact Us" />
      <Content1 countryData={countryData} />
      <Form1 />
      {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.8250818460874!2d76.31707797450797!3d9.948507273919741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d40840478a5%3A0x58ea7a3946d35e6!2sTime%20House%20Enterprise%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1743504156913!5m2!1sen!2sin"
        width="100%"
        height="600"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe> */}
      <Footer
        footerAlignSelf="stretch"
        footerWidth="unset"
        maskGroup="/mask-group@2x.webp"
        iconYoutube="/icon--youtube3.svg"
        itemImg="/item--img4.svg"
        itemImg1="/item--img-14.svg"
        itemImg2="/item--img-24.svg"
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

export default Contact;
