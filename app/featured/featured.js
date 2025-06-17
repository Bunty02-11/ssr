"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Main from "../../components/featured/main";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";
import axios from "axios";
import { useCountry } from "../../context/CountryContext";

const Limited_offer = () => {
    const router = useRouter();
    const { selectedCountry, updateCountry } = useCountry();
    const [countryDescription, setCountryDescription] = useState("");
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const fetchFeaturedProducts = async (pageNum = 1, isLoadMore = false) => {
            try {
                isLoadMore ? setLoadingMore(true) : setLoading(true);
                const response = await axios.get(
                    `https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/products/featured?page=${pageNum}&limit=12`
                );

                if (isLoadMore) {
                    setFeaturedProducts(prev => [...prev, ...response.data.data]);
                } else {
                    setFeaturedProducts(response.data.data);
                }

                const totalProducts = response.data.total || 0;
                const calculatedTotalPages = Math.ceil(totalProducts / 12);
                setTotalPages(calculatedTotalPages);
                setHasMore(pageNum < calculatedTotalPages);

            } catch (err) {
                setError(err.message);
            } finally {
                isLoadMore ? setLoadingMore(false) : setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFeaturedProducts(nextPage, true);
    };

    useEffect(() => {
        setCountryDescription(
            "Tornado brings you a curated selection of luxury men's watches worldwide. Explore our signature collections for timeless style and precision."
        );
    }, [selectedCountry]);

    const handleCountrySelect = (country) => {
        updateCountry(country);
    };

    // console.log(featuredProducts, "Featured Products");

    return (
        <div className="w-full relative bg-white text-black overflow-hidden flex flex-col items-center justify-start leading-[normal] tracking-[normal]">
            <PageBanner title="Featured" breadcrumb="Home > Featured" />

            <section className="self-stretch overflow-hidden flex flex-col items-center justify-start py-[60px] px-[40px] gap-[60px] z-[2] text-left text-37xl text-black font-h5-24 lg:pt-[39px] lg:pb-[39px] lg:box-border mq450:gap-[24px] mq450:py-[40px] mq450:px-[24px]  mq450:box-border mq1050:pt-[25px] mq1050:pb-[25px] mq1050:box-border">
                <div className="w-[1360px] flex flex-row items-start justify-between px-0 mq450:w-full mq450:px-4 mq450:flex-col mq1050:gap-[25px] mq1050:w-full mq1050:flex-col">
                    {/* Added mq1050:flex-col to stack on iPads */}

                    <h1 className="m-0 w-[45%] relative text-[40px] leading-[120%] mq450:text-center font-bold font-[inherit] mq450:text-[24px] mq450:w-full mq750:text-[34px] mq750:leading-[40px] mq750:w-full mq1050:text-[45px] mq1050:leading-[54px] mq1050:w-full">
                        {/* Added mq1050:w-full for full width on iPad */}
                        Featured
                    </h1>
               
                    <div className="w-[55%] relative text-base leading-[150%] mq450:text-center font-medium text-black mq450:w-full mq450:px-0 mq450:text-sm mq750:w-[50%] mq1050:w-full">
                        {/* Added mq1050:w-full for full width on iPad */}
                        {countryDescription}
                    </div>
                </div>

                <Main
                    products={featuredProducts}
                    loading={loading}
                    error={error}
                    page={page}
                    onLoadMore={handleLoadMore}
                    totalPages={totalPages}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                    selectedCountry={selectedCountry}
                />
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

export default Limited_offer;