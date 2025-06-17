import { NextResponse } from 'next/server';
import { apiUrl, frontendUrl } from "../../apiUrl";

// Helper function to escape XML special characters
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
    }
  });
}

export async function GET() {
  try {
    // Fetch data from your APIs
    const [productsRes, collectionsRes, blogsRes] = await Promise.all([
      fetch(`${apiUrl}/products/new-arrivals`),
      fetch(`${apiUrl}/collection`),
      fetch(`${apiUrl}/blogs`),
    ]);

    let productsData = {};
    let collectionsData = [];
    let blogsData = [];

    // Handle products data
    if (productsRes.ok) {
      const productsResponse = await productsRes.json();
      productsData = productsResponse.data || {};
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

    // Static URLs - FIXED XML escaping
    const staticUrls = [
      "",
      "shop",
      "about-us",
      "contact",
      "featured",
      "blog",
      "faqs",
      "privacy-policy",
      "term-of-use",
      "shipping-delivery", // Fixed: changed from shipping&delivery
      "profile",
    ]
      .map(
        (path) => `
        <url>
          <loc>${escapeXml(`${frontendUrl}/${path}`)}</loc>
          <changefreq>${path === "" ? "daily" : "monthly"}</changefreq>
          <priority>${path === "" ? "1.0" : "0.6"}</priority>
        </url>
      `
      )
      .join("");

    // Extract and process products
    let allProducts = [];
    if (productsData) {
      Object.keys(productsData).forEach(country => {
        if (Array.isArray(productsData[country])) {
          allProducts = [...allProducts, ...productsData[country]];
        }
      });
    }
    
    const uniqueProducts = allProducts.filter((product, index, self) => 
      index === self.findIndex(p => p._id === product._id)
    );

    const productUrls = uniqueProducts
      .map(
        (product) => `
        <url>
          <loc>${escapeXml(`${frontendUrl}/products-details?productId=${product._id}`)}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `
      )
      .join("");

    const collectionUrls = (collectionsData || [])
      .map(
        (collection) => `
        <url>
          <loc>${escapeXml(`${frontendUrl}/collection?id=${collection._id}`)}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `
      )
      .join("");

    const blogUrls = (blogsData || [])
      .map(
        (blog) => `
        <url>
          <loc>${escapeXml(`${frontendUrl}/blog-details?id=${blog._id}`)}</loc>
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
  ${blogUrls}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });

  } catch (error) {
    console.error("Sitemap generation error:", error);
    
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(frontendUrl)}</loc>
    <changefreq>daily</changefreq>
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