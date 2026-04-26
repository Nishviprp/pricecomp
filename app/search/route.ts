import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const url = `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=us&language=en&limit=10&sort_by=BEST_MATCH`;

    const res = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('RapidAPI response:', res.status, res.statusText);
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    console.log('RapidAPI data keys:', Object.keys(data));

    const rawProducts = data.data?.products || data.products || [];
    console.log('Products found:', rawProducts.length);

    const products = rawProducts
      .map((item: any) => {
        const offers = item.product_offers || item.offers || [];
        const prices = offers.map((offer: any) => ({
          store: offer.store_name || offer.seller || 'Store',
          price: parseFloat((offer.price || '0').toString().replace(/[^0-9.]/g, '')) || 0,
          originalPrice: parseFloat((offer.original_price || offer.price || '0').toString().replace(/[^0-9.]/g, '')) || 0,
          inStock: offer.availability !== 'Out of Stock' && offer.in_stock !== false,
          url: offer.offer_page_url || offer.url || item.product_page_url || '#',
          color: getStoreColor(offer.store_name || offer.seller || ''),
          logo: getStoreLogo(offer.store_name || offer.seller || ''),
        })).filter((p: any) => p.price > 0);

        return {
          id: item.product_id || item.id || String(Math.random()),
          name: item.product_title || item.title || 'Unknown Product',
          image: item.product_photos?.[0] || item.image || '',
          brand: item.product_title?.split(' ')[0] || 'Unknown',
          rating: parseFloat(item.product_rating || item.rating || '0') || 0,
          reviews: parseInt(item.product_num_reviews || item.reviews || '0') || 0,
          prices,
        };
      })
      .filter((p: any) => p.prices.length > 0 && p.name !== 'Unknown Product');

    return NextResponse.json({
      products,
      query,
      total: products.length,
    });

  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json({
      products: [],
      query,
      total: 0,
      error: String(err),
    });
  }
}

function getStoreColor(store: string): string {
  const s = store.toLowerCase();
  if (s.includes('amazon')) return '#FF9900';
  if (s.includes('walmart')) return '#0071DC';
  if (s.includes('best buy') || s.includes('bestbuy')) return '#003087';
  if (s.includes('ebay')) return '#E53238';
  if (s.includes('target')) return '#CC0000';
  if (s.includes('etsy')) return '#F56400';
  if (s.includes('costco')) return '#005DAA';
  if (s.includes('newegg')) return '#F26A2E';
  return '#6B7280';
}

function getStoreLogo(store: string): string {
  const s = store.toLowerCase();
  if (s.includes('amazon')) return 'A';
  if (s.includes('walmart')) return 'W';
  if (s.includes('best buy') || s.includes('bestbuy')) return 'BB';
  if (s.includes('ebay')) return 'e';
  if (s.includes('target')) return 'T';
  if (s.includes('etsy')) return 'Et';
  if (s.includes('costco')) return 'C';
  if (s.includes('newegg')) return 'N';
  return store.charAt(0).toUpperCase() || '?';
}