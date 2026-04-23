export async function searchProducts(query: string) {
  const url = `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=us&language=en&limit=6&sort_by=BEST_MATCH`;

  try {
    const res = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com',
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    return (data.data?.products || []).map((item: any) => ({
      id: item.product_id || Math.random().toString(),
      name: item.product_title,
      image: item.product_photos?.[0] || '',
      brand: item.product_title.split(' ')[0],
      rating: parseFloat(item.product_rating) || 0,
      reviews: parseInt(item.product_num_reviews) || 0,
      prices: buildPrices(item),
    })).filter((p: any) => p.prices.length > 0);

  } catch (err) {
    console.error('Product search failed:', err);
    return [];
  }
}

function buildPrices(item: any) {
  const prices = [];
  const stores = [
    { name: 'Amazon', color: '#FF9900', logo: 'A' },
    { name: 'Walmart', color: '#0071DC', logo: 'W' },
    { name: 'Best Buy', color: '#003087', logo: 'BB' },
  ];

  if (item.offer) {
    const storeName = item.offer.store_name || stores[0].name;
    const storeInfo = stores.find(s => storeName.toLowerCase().includes(s.name.toLowerCase())) || stores[0];
    prices.push({
      store: storeInfo.name,
      price: parseFloat(item.offer.price?.replace(/[^0-9.]/g, '')) || 0,
      originalPrice: parseFloat(item.offer.original_price?.replace(/[^0-9.]/g, '')) || parseFloat(item.offer.price?.replace(/[^0-9.]/g, '')) || 0,
      inStock: true,
      url: item.product_page_url || '#',
      color: storeInfo.color,
      logo: storeInfo.logo,
    });
  }
  return prices;
}