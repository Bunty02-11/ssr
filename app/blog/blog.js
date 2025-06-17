"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageBanner from "../../components/page-banner";

const Blog = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(9); // Show 9 blogs initially

  useEffect(() => {
    // Set the initial window width after component mounts
    setWindowWidth(window.innerWidth);

    // Add event listener for window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/blogs/");
      setBlogs(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onCatContainerClick = useCallback((id) => {
    router.push(`/blog-details?id=${id}`);
  }, [router]);

  if (loading) {
    return (
      <div className="w-full relative bg-white text-black overflow-hidden flex flex-col items-center justify-center h-screen">
        <div>Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full relative bg-white text-black overflow-hidden flex flex-col items-center justify-center h-screen">
        <div>Error loading blogs: {error}</div>
      </div>
    );
  }

  // Determine how many blogs to show based on screen size
  const isMobile = windowWidth < 768;
  const firstRowCount = 2;
  const secondRowCount = isMobile ? 1 : 3;

  // Only show up to visibleCount blogs
  const visibleBlogs = blogs.slice(0, visibleCount);

  return (
    <div className="w-full relative bg-white text-black overflow-hidden flex flex-col items-start justify-start leading-[normal] tracking-[normal]">
      <PageBanner title="Blogs" breadcrumb="Home > Blogs" />
      <section className="self-stretch flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 lg:p-10 gap-6 z-[2] text-left text-base text-[#fff] font-h5-24 mq450:px-[24px] mq450:py-[40px] mq450:gap-[24px]">
        {/* First row - shows 1 blog on mobile, 2 on tablet/desktop */}
        <div className="w-full max-w-[1360px] flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-6">
          {visibleBlogs.slice(0, firstRowCount).map((blog) => (
            <div
              key={blog._id}
              className="w-full md:w-1/2 h-[300px] sm:h-[370px] md:h-[400px] lg:h-[470px] rounded-2xl flex flex-col items-start justify-end p-4 sm:p-6 md:py-10 md:pl-6 md:pr-5 box-border gap-3 sm:gap-4 bg-cover bg-no-repeat bg-[center] cursor-pointer"
              onClick={() => onCatContainerClick(blog._id)}
              style={{
                backgroundImage: blog.sectionImages
                  ? `url('${blog.sectionImages}')`
                  : "url('/cat@3x.webp')"
              }}
            >
              <h2 className="m-0 self-stretch relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[140%] font-semibold font-[inherit]">
                {blog.title}
              </h2>
              <div className="self-stretch relative leading-[150%] font-medium text-[rgba(255,255,255,0.8)] text-sm sm:text-base">
                {new Date(blog.publishedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Second row - shows 1 blog on mobile, 2-3 on tablet/desktop */}
        {visibleBlogs.length > firstRowCount && (
          <div className="w-full max-w-[1360px] flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-6">
            {visibleBlogs.slice(firstRowCount, firstRowCount + secondRowCount).map((blog) => (
              <div
                key={blog._id}
                className="w-full md:w-1/2 lg:w-1/3 h-[300px] sm:h-[370px] md:h-[400px] lg:h-[470px] rounded-2xl flex flex-col items-start justify-end p-4 sm:p-6 md:py-10 md:pl-6 md:pr-5 box-border gap-6 sm:gap-4 bg-cover bg-no-repeat bg-[top] cursor-pointer"
                onClick={() => onCatContainerClick(blog._id)}
                style={{
                  backgroundImage: blog.sectionImages
                    ? `url('${blog.sectionImages}')`
                    : "url('/cat@3x.webp')"
                }}
              >
                <h2 className="m-0 self-stretch relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[140%] font-semibold font-[inherit]">
                  {blog.title}
                </h2>
                <div className="self-stretch relative leading-[150%] font-medium text-[rgba(255,255,255,0.8)] text-sm sm:text-base">
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Third row - for remaining blogs */}
        {visibleBlogs.length > (firstRowCount + secondRowCount) && (
          <div className="w-full max-w-[1360px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
            {visibleBlogs.slice(firstRowCount + secondRowCount).map((blog) => (
              <div
                key={blog._id}
                className="w-full h-[300px] sm:h-[370px] md:h-[400px] lg:h-[470px] rounded-2xl flex flex-col items-start justify-end p-4 sm:p-6 md:py-10 md:pl-6 md:pr-5 box-border gap-6 sm:gap-6 bg-cover bg-no-repeat bg-[top] cursor-pointer"
                onClick={() => onCatContainerClick(blog._id)}
                style={{
                  backgroundImage: blog.sectionImages
                    ? `url('${blog.sectionImages}')`
                    : "url('/cat@3x.webp')"
                }}
              >
                <h2 className="m-0 self-stretch relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[140%] font-semibold font-[inherit]">
                  {blog.title}
                </h2>
                <div className="self-stretch relative leading-[150%] font-medium text-[rgba(255,255,255,0.8)] text-sm sm:text-base">
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More button */}
        {visibleCount < blogs.length && (
          <button
            className="rounded-[100px] bg-[#fff] border border-solid border-[#000] hover:bg-[#000] hover:text-[#fff] overflow-hidden flex flex-row items-center justify-center py-2 px-6 sm:py-3 sm:px-10 text-center text-sm sm:text-base text-[#000]"
            onClick={() => setVisibleCount((prev) => prev + 9)}
          >
            <div className="relative leading-[150%] font-medium">Load More</div>
          </button>
        )}
      </section>
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
        navbarBackgroundColor={"transparent"}
      />
    </div>
  );
};

export default Blog;