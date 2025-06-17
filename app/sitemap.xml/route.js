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
    // Fetch data from your APIs - Added product collections and product movements
    const [productsRes, allProductsRes, productCollectionsRes, productMovementsRes, movementsRes, blogsRes] = await Promise.all([
      fetch(`${apiUrl}/products/new-arrivals`),
      fetch(`${apiUrl}/products/all`),
      fetch(`${apiUrl}/products/collection`),
      fetch(`${apiUrl}/products/movement`),
      fetch(`${apiUrl}/movement`),
      fetch(`${apiUrl}/blogs`),
    ]);

    let productsData = {};
    let allProductsData = {};
    let productCollectionsData = [];
    let productMovementsData = [];
    let movementsData = [];
    let blogsData = [];

    // Handle new arrivals products data
    if (productsRes.ok) {
      const productsResponse = await productsRes.json();
      productsData = productsResponse.data || {};
    }

    // Handle all products data
    if (allProductsRes.ok) {
      const allProductsResponse = await allProductsRes.json();
      allProductsData = allProductsResponse.data || {};
    }

    // Handle product collections data
    if (productCollectionsRes.ok) {
      const productCollectionsResponse = await productCollectionsRes.json();
      productCollectionsData = productCollectionsResponse.data || productCollectionsResponse || [];
      console.log('Product Collections from /products/collection:', productCollectionsData.length);
    }
    
    // Handle product movements data
    if (productMovementsRes.ok) {
      const productMovementsResponse = await productMovementsRes.json();
      productMovementsData = productMovementsResponse.data || productMovementsResponse || [];
      console.log('Product Movements from /products/movement:', productMovementsData.length);
    }

    // Handle movements data
    if (movementsRes.ok) {
      const movementsResponse = await movementsRes.json();
      movementsData = movementsResponse.data || [];
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

    // Extract and process all products (combine new arrivals and all products)
    let allProducts = [];
    
    // Process new arrivals products
    if (productsData) {
      Object.keys(productsData).forEach(country => {
        if (Array.isArray(productsData[country])) {
          allProducts = [...allProducts, ...productsData[country]];
        }
      });
    }
    
    // Process all products
    if (allProductsData) {
      Object.keys(allProductsData).forEach(country => {
        if (Array.isArray(allProductsData[country])) {
          allProducts = [...allProducts, ...allProductsData[country]];
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
          <loc>${escapeXml(`${frontendUrl}/products-details?productId=${product._id}`)}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `
      )
      .join("");

    // Generate product collection URLs with better error handling
    console.log('Processing product collections for sitemap:', productCollectionsData?.length || 0);
    const productCollectionUrls = (productCollectionsData || [])
      .filter(collection => collection && collection._id) // Filter out invalid collections
      .map(
        (collection) => {
          console.log('Adding product collection to sitemap:', collection._id, collection.name?.en || collection.name);
          return `
        <url>
          <loc>${escapeXml(`${frontendUrl}/collection?id=${collection._id}`)}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `;
        }
      )
      .join("");

    // Generate product movement URLs
    console.log('Processing product movements for sitemap:', productMovementsData?.length || 0);
    const productMovementUrls = (productMovementsData || [])
      .filter(movement => movement && movement._id) // Filter out invalid movements
      .map(
        (movement) => {
          console.log('Adding product movement to sitemap:', movement._id, movement.name?.en || movement.name);
          return `
        <url>
          <loc>${escapeXml(`${frontendUrl}/movement?id=${movement._id}`)}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `;
        }
      )
      .join("");

    const movementUrls = (movementsData || [])
      .map(
        (movement) => `
        <url>
          <loc>${escapeXml(`${frontendUrl}/movement?id=${movement._id}`)}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
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
  ${productCollectionUrls}
  ${productMovementUrls}
  ${movementUrls}
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