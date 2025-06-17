"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Main from "../../components/movement/main";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useCountry } from "../../context/CountryContext";

const Collection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const collectionId = searchParams.get("id");
    const [products, setProducts] = useState({ data: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { selectedCountry, updateCountry, countryData, setCountryData } = useCountry();

    const PRODUCTS_PER_PAGE = 12; // Set the number of products per page

    const fetchProducts = useCallback(async (pageNum, loadMore = false) => {
        if (!collectionId) {
            setError("No collection ID provided");
            setLoading(false);
            return;
        }

        try {
            loadMore ? setLoadingMore(true) : setLoading(true);
            setError(null);

            const url = `https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/products/movement/${collectionId}?page=${pageNum}&limit=${PRODUCTS_PER_PAGE}`;
            // console.log("Fetching from:", url);

            const response = await axios.get(url);
            // console.log("API Response:", response.data);

            if (!response.data || !response.data.data) {
                throw new Error("Invalid API response structure");
            }

            const newProducts = response.data.data;
            const totalProducts = response.data.total || 0;

            if (loadMore) {
                setProducts(prev => ({
                    data: [...prev.data, ...newProducts],
                    total: totalProducts
                }));
            } else {
                setProducts({
                    data: newProducts,
                    total: totalProducts
                });
            }

            // Calculate total pages
            const calculatedTotalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
            setTotalPages(calculatedTotalPages);
            setHasMore(pageNum < calculatedTotalPages);

        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.message);
            if (!loadMore) {
                setProducts({ data: [], total: 0 });
            }
            setTotalPages(0);
            setHasMore(false);
        } finally {
            loadMore ? setLoadingMore(false) : setLoading(false);
        }
    }, [collectionId, PRODUCTS_PER_PAGE]);

    useEffect(() => {
        if (collectionId) {
            fetchProducts(1);
            setPage(1); // Reset page when collectionId changes
        }
    }, [collectionId, fetchProducts]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, true);
    };

    useEffect(() => {
        if (products.data && products.data[0]?.movement?.information) {
            const countrySpecificData = products.data[0]?.movement?.information?.[selectedCountry];
            if (countrySpecificData) {
                setCountryData(countrySpecificData);
            } else {
                console.log('No data found for country:', selectedCountry);
            }
        } else {
            console.log('No home data available yet');
        }
    }, [selectedCountry, products.data, setCountryData]);

    const handleCountrySelect = (country) => {
        updateCountry(country);
    };
    // console.log(products.data)

    return (
        <div className="w-full relative bg-white text-white overflow-hidden flex flex-col items-center justify-start leading-[normal] tracking-[normal]">
            <PageBanner title="Category" breadcrumb="Home > Category" />

            <section className="self-stretch overflow-hidden flex flex-col items-center justify-start py-[60px] px-[40px] gap-[60px] z-[2] text-left text-37xl text-black font-h5-24 lg:pt-[39px] lg:pb-[39px] lg:box-border mq450:gap-[24px] mq450:py-[40px] mq450:px-[24px]  mq450:box-border mq1050:pt-[25px] mq1050:pb-[25px] mq1050:box-border">
                <div className="w-[1360px] flex flex-row items-start justify-between px-0 mq450:w-full mq450:px-4 mq450:flex-col mq1050:gap-[25px] mq1050:w-full mq1050:flex-col">
                    {/* Added mq1050:flex-col to stack on iPads */}

                    <h1 className="m-0 w-[45%] relative text-[40px] leading-[120%] mq450:text-center font-bold font-[inherit] mq450:text-[24px] mq450:w-full mq750:text-[34px] mq750:leading-[40px] mq750:w-full mq1050:text-[45px] mq1050:leading-[54px] mq1050:w-full">

                        {/* Added mq1050:w-full for full width on iPad */}
                        {countryData?.title ||
                            products.data[0]?.movement?.information?.[selectedCountry]?.title ||
                            products.data[0]?.movement?.name ||
                            "Movement"}
                    </h1>

                    <div className="w-[55%] relative text-base leading-[150%] mq450:text-center font-medium text-black mq450:w-full mq450:px-0 mq450:text-sm mq750:w-full mq1050:w-full">

                        {/* Added mq1050:w-full for full width on iPad */}
                        {countryData?.heading ||
                            products.data[0]?.movement?.information?.[selectedCountry]?.heading ||
                            "Tornado brings you a curated selection"}
                    </div>
                </div>
                <Main
                    products={products}
                    loading={loading}
                    error={error}
                    page={page}
                    onLoadMore={handleLoadMore}
                    totalPages={totalPages}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                    movementId={collectionId}
                    country={selectedCountry}
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

export default Collection;