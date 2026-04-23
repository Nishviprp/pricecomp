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
      next: { revalidate: 1800 }
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    const products = (data.data?.products || []).map((item: any) => ({
      id: item.product_id || String(Math.random()),
      name: item.product_title,
      image: item.product_photos?.[0] || '',
      brand: item.product_title?.split(' ')[0] || 'Unknown',
      rating: parseFloat(item.product_rating) || 0,
      reviews: parseInt(item.product_num_reviews) || 0,
      prices: item.product_offers?.map((offer: any) => ({
        store: offer.store_name || 'Store',
        price: parseFloat(offer.price?.replace(/[^0-9.]/g, '')) || 0,
        originalPrice: parseFloat(offer.original_price?.replace(/[^0-9.]/g, '')) || parseFloat(offer.price?.replace(/[^0-9.]/g, '')) || 0,
        inStock: offer.availability !== 'Out of Stock',
        url: offer.offer_page_url || item.product_page_url || '#',
        color: getStoreColor(offer.store_name),
        logo: getStoreLogo(offer.store_name),
      })) || [],
    })).filter((p: any) => p.prices.length > 0 && p.name);

    return NextResponse.json({ products, query, total: products.length });

  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json({ products: [], query, total: 0, error: 'Search failed' });
  }
}

function getStoreColor(store: string = '') {
  const s = store.toLowerCase();
  if (s.includes('amazon')) return '#FF9900';
  if (s.includes('walmart')) return '#0071DC';
  if (s.includes('best buy')) return '#003087';
  if (s.includes('ebay')) return '#E53238';
  if (s.includes('target')) return '#CC0000';
  return '#6B7280';
}

function getStoreLogo(store: string = '') {
  const s = store.toLowerCase();
  if (s.includes('amazon')) return 'A';
  if (s.includes('walmart')) return 'W';
  if (s.includes('best buy')) return 'BB';
  if (s.includes('ebay')) return 'e';
  if (s.includes('target')) return 'T';
  return store.charAt(0).toUpperCase();
}