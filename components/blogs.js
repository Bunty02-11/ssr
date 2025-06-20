"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";

const Blogs = ({
  className = "",
  heading,
  relatedBlogsColor,
  solararrowUpLinear = "/solararrowuplinear-5@1x.webp",
  solararrowUpLinear1 = "/solararrowuplinear-5@2x.webp",
}) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/blogs/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const relatedBlogsStyle = useMemo(() => {
    return {
      color: relatedBlogsColor,
    };
  }, [relatedBlogsColor]);

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const onCatContainerClick = useCallback((id) => {
    router.push(`/blog-details?id=${id}`);
  }, [router]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className={`text-center py-10 ${className}`}>Loading blogs...</div>;
  }

  if (error) {
    return <div className={`text-center py-10 text-red-500 ${className}`}>Error: {error}</div>;
  }

  return (
    <section
      className={`self-stretch overflow-hidden flex flex-col items-center justify-start pb-[60px] px-[40px] gap-[60px] text-left text-29xl font-h5-24 mq450:pb-[40px] mq450:px-[24px] mq450:gap-[24px] ${className}`}
    >
      <div className="w-[1360px] max-w-full flex flex-row items-center justify-between">
        <h2
          className="m-0 relative text-[48px] leading-[120%] mq450:text-center font-bold font-[inherit] mq750:text-[34px] mq750:leading-[40px] mq1050:text-[45px] mq1050:leading-[54px] mq450:text-[24px] mq450:leading-[120%]"
        >
          {heading?.blog_title || "Related Blogs"}
        </h2>
        <div className="flex flex-row items-start justify-center gap-4 mq450:hidden">
          <button
            onClick={handlePrev}
            className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
          >
            <Image
              className="h-11 w-11 relative overflow-hidden shrink-0 object-contain mq450:h-8 mq450:w-8 cursor-pointer hover:opacity-80 transition-opacity"
              loading="lazy"
              width={44}
              height={44}
              alt="solararrowuplinear-2@2x"
              src="/solararrowuplinear-2@2x.webp"
            />
          </button>
          <button
            onClick={handleNext}
            className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
          >
            <Image
              className="h-11 w-11 relative overflow-hidden shrink-0 object-contain mq450:h-8 mq450:w-8 cursor-pointer hover:opacity-80 transition-opacity"
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
          navigation={false}
          slidesPerView={1}
          spaceBetween={20}
          onSwiper={setSwiperInstance}
          className="w-full"
          breakpoints={{
            0: {
              slidesPerView: 1.1,
              spaceBetween: 10,
            },
            450: {
              slidesPerView: 1.1,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1360: {
              slidesPerView: 3.2,
              spaceBetween: 30,
            },
          }}
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog._id}>
              <div
                className="h-[500px] w-full rounded-3xl flex flex-col items-start justify-end py-10 pl-6 pr-5 box-border gap-4 bg-cover bg-no-repeat bg-[top] relative transition-transform duration-300 mq750:h-[400px] mq450:h-[500px] mq350:w-[350px] mq450:py-6 mq450:px-4 mq450:rounded-xl cursor-pointer"
                style={{
                  backgroundImage: blog.sectionImages
                    ? `url('${blog.sectionImages}')`
                    : "url('/cat@3x.webp')",
                  backgroundPosition: 'center'
                }}
                onClick={() => onCatContainerClick(blog._id)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-3xl mq450:rounded-xl"></div>

                <h2 className="m-0 self-stretch relative text-[24px] leading-[140%] text-[#fff] font-[600] font-[inherit] mq1050:text-[19px] mq1050:leading-[27px] mq450:text-[24px] mq450:leading-[150%] mq450:line-clamp-2 z-10 cursor-pointer">
                  {blog.title}
                </h2>
                {/* <div className="self-stretch relative text-base leading-[150%] font-medium text-[rgba(255,255,255,0.8)] mq450:text-sm z-10">
                  {formatDate(blog.publishedAt)}
                </div> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

Blogs.propTypes = {
  className: PropTypes.string,
  relatedBlogsColor: PropTypes.string,
  solararrowUpLinear: PropTypes.string,
  solararrowUpLinear1: PropTypes.string,
};

export default Blogs;