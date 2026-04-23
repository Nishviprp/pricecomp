export async function searchWalmart(query: string) {
  const apiKey = process.env.WALMART_API_KEY;
  
  // Walmart Open API endpoint
  const url = `https://api.walmart.com/v1/search?query=${encodeURIComponent(query)}&format=json`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'WM_SEC.ACCESS_TOKEN': apiKey || '',
        'WM_CONSUMER.ID': process.env.WALMART_CONSUMER_ID || '',
        'WM_CONSUMER.INTIMESTAMP': Date.now().toString(),
        'Accept': 'application/json',
      }
    });
    
    if (!res.ok) throw new Error('Walmart API error');
    const data = await res.json();
    
    return (data.items || []).slice(0, 5).map((item: any) => ({
      id: `walmart-${item.itemId}`,
      name: item.name,
      image: item.thumbnailImage,
      brand: item.brandName || 'Unknown',
      rating: item.customerRating || 0,
      reviews: item.numReviews || 0,
      prices: [{
        store: 'Walmart',
        price: item.salePrice || item.msrp,
        originalPrice: item.msrp || item.salePrice,
        inStock: item.availableOnline,
        url: item.productUrl,
        color: '#0071DC',
        logo: 'W'
      }]
    }));
  } catch (err) {
    console.error('Walmart search failed:', err);
    return [];
  }
}