const fs = require('fs');
const path = require('path');

console.log('🔍 SEO Health Check Starting...\n');

// Check robots.txt
const robotsTxtPath = path.join(__dirname, 'public', 'robots.txt');
if (fs.existsSync(robotsTxtPath)) {
    console.log('✅ robots.txt exists');
    const robotsContent = fs.readFileSync(robotsTxtPath, 'utf8');
    if (robotsContent.includes('Sitemap:')) {
        console.log('✅ robots.txt includes sitemap reference');
    } else {
        console.log('❌ robots.txt missing sitemap reference');
    }
} else {
    console.log('❌ robots.txt not found');
}

// Check sitemap files
const sitemapJsPath = path.join(__dirname, 'app', 'sitemap.js');
const sitemapXmlRoutePath = path.join(__dirname, 'app', 'sitemap.xml', 'route.js');

if (fs.existsSync(sitemapJsPath)) {
    console.log('✅ sitemap.js exists');
} else {
    console.log('❌ sitemap.js not found');
}

if (fs.existsSync(sitemapXmlRoutePath)) {
    console.log('✅ sitemap.xml route exists');
} else {
    console.log('❌ sitemap.xml route not found');
}

// Check layout.js for proper meta configuration
const layoutPath = path.join(__dirname, 'app', 'layout.js');
if (fs.existsSync(layoutPath)) {
    console.log('✅ layout.js exists');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    if (layoutContent.includes('index: true')) {
        console.log('✅ robots meta set to index: true');
    } else {
        console.log('❌ robots meta not properly configured');
    }

    if (layoutContent.includes('openGraph')) {
        console.log('✅ OpenGraph meta tags configured');
    } else {
        console.log('❌ OpenGraph meta tags missing');
    }
}

// Check main page for structured data
const pageJsPath = path.join(__dirname, 'app', 'page.js');
if (fs.existsSync(pageJsPath)) {
    console.log('✅ page.js exists');
    const pageContent = fs.readFileSync(pageJsPath, 'utf8');

    if (pageContent.includes('application/ld+json')) {
        console.log('✅ Structured data (JSON-LD) configured');
    } else {
        console.log('❌ Structured data missing');
    }
}

console.log('\n🎯 SEO Health Check Complete!\n');

console.log('📋 Next Steps:');
console.log('1. Run: npm run dev');
console.log('2. Test these URLs in your browser:');
console.log('   - http://localhost:3000/sitemap.xml');
console.log('   - http://localhost:3000/robots.txt');
console.log('3. Check browser Network tab for proper responses');
console.log('4. Use Screaming Frog to crawl http://localhost:3000');
console.log('5. Verify all pages are discoverable\n');

console.log('🚀 Common URLs to test crawling:');
const testUrls = [
    'http://localhost:3000/',
    'http://localhost:3000/about-us',
    'http://localhost:3000/shop',
    'http://localhost:3000/blog',
    'http://localhost:3000/contact',
    'http://localhost:3000/faqs',
    'http://localhost:3000/featured',
    'http://localhost:3000/productdetails',
];

testUrls.forEach(url => console.log(`   - ${url}`));
console.log('\n✨ All these URLs should now be discoverable by Screaming Frog!');