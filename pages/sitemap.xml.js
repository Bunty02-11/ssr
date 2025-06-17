// pages/sitemap.xml.js
import { apiUrl, frontendUrl } from "../apiUrl";

const BASE_URL = frontendUrl;

export async function getServerSideProps({ res }) {
  try {
    const [productsRes, collectionsRes, blogsRes, categoriesRes] =
      await Promise.all([
        fetch(`${apiUrl}/products/new-arrivals`),
        fetch(`${apiUrl}/collection`),
        fetch(`${apiUrl}/blogs`),
        fetch(`${apiUrl}/categories/all`),
      ]);

    const [productsData, collectionsData, blogsData, categoriesData] =
      await Promise.all([
        productsRes.ok ? productsRes.json() : { data: {} },
        collectionsRes.ok ? collectionsRes.json() : { data: [] },
        blogsRes.ok ? blogsRes.json() : { blogs: [] },
        categoriesRes.ok ? categoriesRes.json() : { data: [] },
      ]);

    // Static pages for Tornado watch website
    const staticUrls = [
      "",
      "shop",
      "about-us",
      "contact-us",
      "featured",
      "blog",
      "faqs",
      "privacy-policy",
      "term-of-use",
      "shipping&delivery",
      "profile",
      "cart",
      "checkout",
      "login",
      "register",
    ]
      .map(
        (path) => `
        <url>
          <loc>${BASE_URL}/${path}</loc>
          <changefreq>${path === "" ? "daily" : "monthly"}</changefreq>
          <priority>${path === "" ? "1.0" : "0.6"}</priority>
        </url>
      `
      )
      .join("");

    // Extract products from all countries and remove duplicates
    let allProducts = [];
    if (productsData.data) {
      Object.keys(productsData.data).forEach(country => {
        if (Array.isArray(productsData.data[country])) {
          allProducts = [...allProducts, ...productsData.data[country]];
        }
      });
    }
    
    // Remove duplicate products by _id
    const uniqueProducts = allProducts.filter((product, index, self) => 
      index === self.findIndex(p => p._id === product._id)
    );

    const productUrls = uniqueProducts
      .map(
        (product) => `
        <url>
          <loc>${BASE_URL}/products-details?productId=${product._id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `
      )
      .join("");

    const collectionUrls = (collectionsData.data || [])
      .map(
        (collection) => `
        <url>
          <loc>${BASE_URL}/collection?id=${collection._id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `
      )
      .join("");

    const categoryUrls = (categoriesData.data || [])
      .map(
        (category) => `
        <url>
          <loc>${BASE_URL}/movement?id=${category._id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
      )
      .join("");

    const blogUrls = (blogsData?.blogs || blogsData?.data || [])
      .map(
        (blog) => `
        <url>
          <loc>${BASE_URL}/blog-details?id=${blog._id}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `
      )
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${productUrls}
  ${collectionUrls}
  ${categoryUrls}
  ${blogUrls}
</urlset>`;

    // Send XML response directly
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.write(sitemap);
    res.end();

    return {
      props: {}, // will not be used
    };
  } catch (err) {
    console.error("Sitemap generation error:", err);
    res.setHeader("Content-Type", "application/xml");
    res.write(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
    res.end();
    return { props: {} };
  }
}

export default function Sitemap() {
  return null;
} 