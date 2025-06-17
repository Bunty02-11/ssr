// pages/sitemap.xml.js
import { apiUrl } from "../apiUrl";

const BASE_URL = "https://tornado-livid.vercel.app/";

export async function getServerSideProps({ res }) {
  try {
    // Fetch data from all endpoints concurrently
    const [productsRes, categoriesRes, collectionsRes, blogsRes] = await Promise.all([
      fetch(`${apiUrl}/products`),
      fetch(`${apiUrl}/categories`),
      fetch(`${apiUrl}/collection`),
      fetch(`${apiUrl}/blogs`),
    ]);

    // Process all responses
    const [productsData, categoriesData, collectionsData, blogsData] = await Promise.all([
      productsRes.json(),
      categoriesRes.json(),
      collectionsRes.json(),
      blogsRes.json(),
    ]);

    // Static URLs with proper formatting
    const staticUrls = [
      "",
      "offers",
      "seasoning",
      "blogs",
      "about-us",
      "faqs",
      "contact-us",
    ].map(path => `
      <url>
        <loc>${BASE_URL}/${path}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${path === "" ? "1.0" : "0.6"}</priority>
      </url>
    `).join("");

    // Product URLs with proper formatting
    const productUrls = (productsData || []).map(product => `
      <url>
        <loc>${BASE_URL}/product/${product.slug}</loc>
        <lastmod>${new Date(product.updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
    `).join("");

    // Category URLs with proper formatting
    const categoryUrls = (categoriesData || []).map(category => `
      <url>
        <loc>${BASE_URL}/category/${category.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join("");

    // Collection URLs with proper formatting
    const collectionUrls = (collectionsData || []).map(collection => `
      <url>
        <loc>${BASE_URL}/collection/${collection.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join("");

    // Blog URLs with proper formatting
    const blogUrls = (blogsData?.blogs || []).map(blog => `
      <url>
        <loc>${BASE_URL}/blog/${blog._id}</loc>
        <lastmod>${new Date(blog.updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
    `).join("");

    // Complete sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${productUrls}
  ${categoryUrls}
  ${collectionUrls}
  ${blogUrls}
</urlset>`;

    // Set headers and write response
    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return { props: {} };

  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Fallback minimal sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.write(fallbackSitemap);
    res.end();

    return { props: {} };
  }
}

export default function Sitemap() {
  return null;
}