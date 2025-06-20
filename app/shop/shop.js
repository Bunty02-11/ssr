"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Main from "../../components/main";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";
import axios from "axios";
import { useCountry } from "../../context/CountryContext";

const Shop = ({ initialData }) => {
  const router = useRouter();
  const { selectedCountry, updateCountry } = useCountry();
  const [countryDescription, setCountryDescription] = useState(initialData?.countryDescription || "");
  const [countryTitle, setCountryTitle] = useState(initialData?.countryTitle || "Shop Tornado Men's Watches");

  // Define country-specific data
  const countryData = {
    india: {
      title: "Shop Tornado Men’s Watches in India – Elegant & Premium Timepieces",
      description:
        "Tornado brings you a curated selection of men's branded watches in India. From the iconic Lumina to the exclusive Limited Edition, find watches that define elegance and precision. Shop our collections like Celestia, Spectra, and more for timeless style.",
    },
    ksa: {
      title: "Shop Tornado Watches for Men in Saudi Arabia – Timeless Luxury Awaits",
      description:
        "Tornado offers luxury watches for Saudi Arabia's finest taste. From the sophisticated Xenith to the bold Steller X, our collections like Cosmic, Autonova, and more blend craftsmanship with modern design. Elevate your style with luxury timepieces.",
    },
    uae: {
      title: "Shop Men’s Watches Online, Our Premium Watch Collection",
      description:
        "Discover a diverse collection of luxury timepieces at Tornado, from the sleek Xenith to the timeless Classic. Explore our stunning collections like Aurora, Cosmic, and Lumina, each blending tradition with innovation. Find your perfect luxury watch in Dubai today.",
    },
    qatar: {
      title: "Shop Men’s Watches in Qatar – Tornado’s Curated Collection Awaits Online",
      description:
        "Tornado offers premium watches in Qatar that merge classic elegance with modern flair. Browse the Aurora, Spectra, and Celestia collections, designed to offer precision and style. Find the perfect luxury watch to match your lifestyle.",
    },
    kuwait: {
      title: "Shop Men’s Watches Online – Explore Tornado’s Premium Watch Collection in Kuwait",
      description:
        "Tornado brings you luxury watches in Kuwait, combining traditional craftsmanship with contemporary designs. Explore collections such as Autonova, Steller X, and Classic, crafted for those who appreciate luxury and sophistication.",
    },
  };

  // Update description after component mounts (client-side only)
  useEffect(() => {
    if (selectedCountry && countryData[selectedCountry]) {
      setCountryDescription(countryData[selectedCountry].description);
      setCountryTitle(countryData[selectedCountry].title);
    } else {
      setCountryDescription(
        "Tornado brings you a curated selection of luxury men's watches worldwide..."
      );
      setCountryTitle("Shop Tornado Men's Watches");
    }
  }, [selectedCountry]);

  const handleCountrySelect = (country) => {
    updateCountry(country);
  };

  return (
    <div className="w-full relative bg-white text-black overflow-hidden flex flex-col items-center justify-start leading-[normal] tracking-[normal]">
      <PageBanner title="Shop" breadcrumb="Home > Shop" />

      <section className="self-stretch overflow-hidden flex flex-col items-center justify-start py-[60px] px-[40px] gap-[60px] z-[2] text-left text-37xl text-black font-h5-24 lg:pt-[39px] lg:pb-[39px] lg:box-border mq450:gap-[24px] mq450:py-[40px] mq450:px-[24px]  mq450:box-border mq1050:pt-[25px] mq1050:pb-[25px] mq1050:box-border">
        <div className="w-full max-w-[1360px] flex flex-row items-start justify-between px-0 mq450:w-full mq450:px-4 mq450:flex-col mq1050:gap-[25px] mq1050:w-full mq1050:flex-col">
          {/* Added mq1050:flex-col to stack on iPads */}
          <h1 className="m-0 w-[45%] relative text-[40px] leading-[120%] mq450:text-center font-bold font-[inherit] mq450:text-[24px] mq450:w-full mq750:text-[34px] mq750:leading-[40px] mq750:w-full mq1050:text-[45px] mq1050:leading-[54px] mq1050:w-full">
            {/* Added mq1050:w-full for full width on iPad */}
            {countryTitle}
          </h1>
          <div className="w-[55%] relative text-base leading-[150%] mq450:text-center font-medium text-black mq450:w-full mq450:px-0 mq450:text-sm mq750:w-full mq1050:w-full">
            {/* Added mq1050:w-full for full width on iPad */}
            {countryDescription}
          </div>
        </div>
        <Main country={selectedCountry} />
      </section>

      <Footer
        footerAlignSelf="stretch"
        footerWidth="unset"
        maskGroup="/mask-group@2x.webp"
        iconYoutube="/icon--youtube2.svg"
        itemImg="/item--img3.svg"
        itemImg1="/item--img-13.svg"
        itemImg2="/item--img-23.svg"
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

export default Shop;
