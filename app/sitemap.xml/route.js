import { NextResponse } from 'next/server';
import { apiUrl, frontendUrl } from "../../apiUrl";

const BASE_URL = frontendUrl;

export async function GET() {
  try {
    // Fetch data from your APIs
    const [productsRes, collectionsRes, blogsRes] = await Promise.all([
      fetch(`${apiUrl}/products/new-arrivals`, { 
        next: { revalidate: 3600 } // Cache for 1 hour
      }),
      fetch(`${apiUrl}/collection`, { 
        next: { revalidate: 3600 }
      }),
      fetch(`${apiUrl}/blogs`, { 
        next: { revalidate: 3600 }
      }),
    ]);

    let productsData = [];
    let collectionsData = [];
    let blogsData = [];

    // Handle products data
    if (productsRes.ok) {
      const productsResponse = await productsRes.json();
      // Extract products from all countries
      if (productsResponse.data) {
        Object.keys(productsResponse.data).forEach(country => {
          if (Array.isArray(productsResponse.data[country])) {
            productsData = [...productsData, ...productsResponse.data[country]];
          }
        });
      }
    }

    // Handle collections data
    if (collectionsRes.ok) {
      const collectionsResponse = await collectionsRes.json();
      collectionsData = collectionsResponse.data || [];
    }

    // Handle blogs data
    if (blogsRes.ok) {
      const blogsResponse = await blogsRes.json();
      blogsData = blogsResponse.blogs || blogsResponse.data || [];
    }

    // Static URLs for your watch website
    const staticUrls = [
      "",
      "shop",
      "about-us",
      "contact-us",
      "blogs",
      "featured",
      "offers",
      "faqs",
      "privacy-policy",
      "term-of-use",
      "shipping&delivery",
      "return-policy",
      "profile",
      "cart",
      "checkout",
      "login",
      "register"
    ]
      .map(
        (path) => `
        <url>
          <loc>${BASE_URL}/${path}</loc>
          <changefreq>monthly</changefreq>
          <priority>${path === "" ? "1.0" : "0.6"}</priority>
        </url>
      `
      )
      .join("");

    // Product URLs - remove duplicates by ID
    const uniqueProducts = productsData.filter((product, index, self) => 
      index === self.findIndex(p => p._id === product._id)
    );

    const productUrls = uniqueProducts
      .map(
        (product) => `
        <url>
          <loc>${BASE_URL}/product/${product._id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `
      )
      .join("");

    // Collection URLs
    const collectionUrls = (collectionsData || [])
      .map(
        (collection) => `
        <url>
          <loc>${BASE_URL}/collection?id=${collection._id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
      )
      .join("");

    // Blog URLs
    const blogUrls = (blogsData || [])
      .map(
        (blog) => `
        <url>
          <loc>${BASE_URL}/blog/${blog._id}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `
      )
      .join("");

    // Generate the complete sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${productUrls}
  ${collectionUrls}
  ${blogUrls}
</urlset>`;

    // Return XML response
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error("Sitemap generation error:", error);
    
    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
} 