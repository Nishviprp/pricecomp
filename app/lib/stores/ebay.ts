export async function searchEbay(query: string) {
  const token = process.env.EBAY_ACCESS_TOKEN;
  
  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=5`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) throw new Error('eBay API error');
    const data = await res.json();
    
    return (data.itemSummaries || []).map((item: any) => ({
      id: `ebay-${item.itemId}`,
      name: item.title,
      image: item.image?.imageUrl || '',
      brand: item.brand || 'Unknown',
      rating: item.seller?.feedbackScore || 0,
      reviews: 0,
      prices: [{
        store: 'eBay',
        price: parseFloat(item.price?.value || '0'),
        originalPrice: parseFloat(item.price?.value || '0'),
        inStock: true,
        url: item.itemWebUrl,
        color: '#E53238',
        logo: 'e'
      }]
    }));
  } catch (err) {
    console.error('eBay search failed:', err);
    return [];
  }
}