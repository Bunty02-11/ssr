"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/navbar";
import Content from "../../components/content";
import Form from "../../components/form";
import Blogs from "../../components/blogs";
import Footer from "../../components/footer";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/blogs/${id}`);
      setBlog(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading blog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        <div>Error loading blog: {error}</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full min-h-screen bg-white text-black flex items-center justify-center">
        <div>Blog not found</div>
      </div>
    );
  }

  // Helper function to render content with proper formatting
  const renderContent = (content) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  // Helper function to render list items
  const renderListItems = (content) => {
    const lines = content.split('\n');
    return (
      <ul className="list-disc pl-5 space-y-2 my-4">
        {lines.filter(line => line.startsWith('- ')).map((item, index) => (
          <li key={index}>{item.substring(2)}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full bg-white text-black">
      <header className="sticky top-0 z-50">
        <Navbar
          logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
          search="/search3.svg"
          account="/account3.svg"
          sVG="/svg2.svg"
          navbarBackgroundColor={"rgba(0, 0, 0, 0.5)"}
        />
      </header>

      <main className="max-w-[1360px] mx-auto px-[40px] mq450:px-[24px] gap-[40px] mq450:gap-[24px]  py-[100px] mq450:py-[100px]">
        {/* Blog Header */}
        <section className="mb-10">
          <h1 className="text-[56px] mq450:text-[32px] font-bold leading-tight mb-4">
            {blog.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Published on {new Date(blog.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </section>

        {/* Featured Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden mb-10">
          <Image
            src={blog.featuredImage || "/cat2@3x.webp"}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Table of Contents */}
        {blog.tableOfContents && blog.tableOfContents.length > 0 && (
          <div className=" py-6 rounded-lg mb-0">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-3 mq450:ml-[-20px]">
              {blog.tableOfContents.map((item, index) => (
                <li key={index}>
                  <a
                    href={`#section-${index}`}
                    className="text-black no-underline hover:underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Takeaways */}
        {/* Key Takeaways */}
        {blog.keyTakeaways && blog.keyTakeaways.length > 0 && (
          <div className="py-6 rounded-lg mb-10 mq450:py-0">
            <h2 className="text-xl font-semibold mb-4">Key Takeaways</h2>
            <ul className="space-y-2 mq450:ml-[-38px]">
              {blog.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* Blog Content */}
        <article className="prose prose-lg max-w-none">
          {blog.content.map((section, index) => (
            <section key={index} id={`section-${index}`} className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">
                {section.title}
              </h2>

              {section.content && (
                <div className="text-black leading-relaxed">
                  {renderContent(section.content)}
                  {renderListItems(section.content)}
                </div>
              )}

              {section.subsections && section.subsections.map((subsection, subIndex) => (
                <div key={subIndex} className="mt-6">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-black">
                    {subsection.title}
                  </h3>
                  <div className="text-black leading-relaxed">
                    {renderContent(subsection.content)}
                    {renderListItems(subsection.content)}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </article>
      </main>

      {/* Related Components */}
      <Form />

      <Blogs
        relatedBlogs="Related Blogs"
        solararrowUpLinear="/solararrowuplinear1@2x.webp"
        solararrowUpLinear1="/solararrowuplinear-11@2x.webp"
        category="AUTOMATIC"
        category1="ANALOG"
        category2="DIGITAL"
        category3="VINTAGE"
      />

      <Footer
        footerAlignSelf="stretch"
        footerWidth="unset"
        maskGroup="/mask-group@2x.webp"
        iconYoutube="/icon--youtube3.svg"
        itemImg="/item--img4.svg"
        itemImg1="/item--img-14.svg"
        itemImg2="/item--img-24.svg"
      />
    </div>
  );
};

export default BlogDetails;