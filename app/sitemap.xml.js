// pages/sitemap.xml.js
import { apiUrl } from "../apiUrl";

const BASE_URL = "https://tornado-livid.vercel.app/";

export async function getServerSideProps({ res }) {
  try {
    // Fetch all necessary data
    const [
      productsRes, 
      movementsRes, 
      collectionsRes, 
      blogsRes,
      homeRes,
      aboutRes,
      faqCountryRes,
      newArrivalsRes,
      featuredRes,
      bestsellersRes,
      allProductsRes
    ] = await Promise.all([
      fetch(`${apiUrl}/products`),
      fetch(`${apiUrl}/movement`),
      fetch(`${apiUrl}/collection`),
      fetch(`${apiUrl}/blogs`),
      fetch(`${apiUrl}/home`),
      fetch(`${apiUrl}/about`),
      fetch(`${apiUrl}/faq-country`),
      fetch(`${apiUrl}/products/new-arrivals`),
      fetch(`${apiUrl}/products/featured`),
      fetch(`${apiUrl}/products/bestsellers`),
      fetch(`${apiUrl}/products/all`),
    ]);

    // Parse all responses
    const [
      productsData, 
      movementsData, 
      collectionsData, 
      blogsData,
      homeData,
      aboutData,
      faqCountryData,
      newArrivalsData,
      featuredData,
      bestsellersData,
      allProductsData
    ] = await Promise.all([
      productsRes.json(),
      movementsRes.json(),
      collectionsRes.json(),
      blogsRes.json(),
      homeRes.json(),
      aboutRes.json(),
      faqCountryRes.json(),
      newArrivalsRes.json(),
      featuredRes.json(),
      bestsellersRes.json(),
      allProductsRes.json(),
    ]);

    // Static URLs
    const staticUrls = [
      "",
      "contact-us",
      "home",
      "about",
      "faq-country",
      "products/new-arrivals",
      "products/featured",
      "products/bestsellers",
      "products/all"
    ]
      .map(
        (path) => `
        <url>
          <loc>${BASE_URL}/${path}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `
      )
      .join("");

    // Product URLs
    const productUrls = (productsData || [])
      .map(
        (p) => `
        <url>
          <loc>${BASE_URL}/product/${p.slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `
      )
      .join("");

    // Movement URLs
    const movementUrls = (movementsData || [])
      .map(
        (m) => `
        <url>
          <loc>${BASE_URL}/movement/${m.slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
      )
      .join("");

    // Collection URLs
    const collectionUrls = (collectionsData || [])
      .map(
        (c) => `
        <url>
          <loc>${BASE_URL}/collection/${c.slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
      )
      .join("");

    // Blog URLs
    const blogUrls = (blogsData?.blogs || [])
      .map(
        (b) => `
        <url>
          <loc>${BASE_URL}/blog/${b._id}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `
      )
      .join("");

    // Special product category URLs
    const specialProductUrls = [
      newArrivalsData,
      featuredData,
      bestsellersData,
      allProductsData
    ]
      .filter(data => Array.isArray(data))
      .flatMap(data => 
        data.map(
          (p) => `
          <url>
            <loc>${BASE_URL}/product/${p.slug}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `
        )
      )
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${productUrls}
  ${movementUrls}
  ${collectionUrls}
  ${blogUrls}
  ${specialProductUrls}
</urlset>`;

    // Send XML response
    res.setHeader("Content-Type", "application/xml");
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (err) {
    console.error("Sitemap generation error:", err);
    res.setHeader("Content-Type", "application/xml");
    res.write("<urlset></urlset>");
    res.end();
    return { props: {} };
  }
}

export default function Sitemap() {
  return null;
}