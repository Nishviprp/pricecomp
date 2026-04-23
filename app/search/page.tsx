'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

interface Price {
  store: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
  url: string;
  color: string;
  logo: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  prices: Price[];
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return (
    <span className="text-yellow-400 text-sm">
      {'★'.repeat(full)}{'☆'.repeat(empty)}
      <span className="text-gray-400 ml-1 text-xs">{rating > 0 ? rating.toFixed(1) : ''}</span>
    </span>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError('');
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Something went wrong. Please try again.');
        setResults([]);
        setLoading(false);
      });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const getLowestPrice = (prices: Price[]) => {
    const inStock = prices.filter(p => p.inStock && p.price > 0);
    if (inStock.length === 0) return 0;
    return Math.min(...inStock.map(p => p.price));
  };

  const getSavings = (prices: Price[]) => {
    const lowest = getLowestPrice(prices);
    const highest = Math.max(...prices.map(p => p.originalPrice || p.price));
    const saved = highest - lowest;
    return saved > 0 ? saved : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">P</span>
            </div>
            <span className="font-black text-xl text-gray-900 hidden sm:block">
              Price<span className="text-green-600">Comp</span>
            </span>
          </button>

          <form onSubmit={handleSearch} className="flex-1 flex gap-2 max-w-2xl">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="flex-1 border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-gray-50"
              placeholder="Search products..."
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">

        {loading && (
          <div className="text-center py-24">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Comparing prices across stores...</p>
              <p className="text-gray-400 text-sm">Checking Amazon, Walmart, Best Buy and more</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-gray-700 font-medium mb-2">{error}</p>
            <button onClick={() => router.push('/')} className="text-green-600 hover:underline text-sm">
              Go back home
            </button>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-700 font-medium mb-2">No results found for "{query}"</p>
            <p className="text-gray-400 text-sm">Try a different search term</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{results.length} results</span>
                {' '}for <span className="font-semibold text-green-600">"{query}"</span>
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Live prices
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {results.map(product => {
                const lowest = getLowestPrice(product.prices);
                const savings = getSavings(product.prices);
                return (
                  <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-md transition-all">
                    <div className="flex gap-5">

                      <div className="w-32 h-32 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/128x128/f3f4f6/9ca3af?text=No+Image';
                            }}
                          />
                        ) : (
                          <span className="text-gray-300 text-xs text-center px-2">No image</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{product.brand}</p>
                            <h2 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">{product.name}</h2>
                            {product.rating > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <Stars rating={product.rating} />
                                {product.reviews > 0 && (
                                  <span className="text-xs text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            {lowest > 0 && (
                              <>
                                <p className="text-xs text-gray-400 mb-0.5">Lowest price</p>
                                <p className="text-2xl font-black text-green-600">${lowest.toFixed(2)}</p>
                                {savings > 0 && (
                                  <p className="text-xs text-green-500 font-medium">Save ${savings.toFixed(2)}</p>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2 flex-wrap">
                          {product.prices.map((p, idx) => {
                            const isBest = p.inStock && p.price === lowest && lowest > 0;
                            return (
                              <a
                                key={idx}
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                                  !p.inStock
                                    ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50'
                                    : isBest
                                    ? 'border-green-400 bg-green-50 hover:bg-green-100 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                }`}
                              >
                                <div
                                  className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-black shrink-0"
                                  style={{ background: p.color }}
                                >
                                  {p.logo}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">
                                    {p.price > 0 ? `$${p.price.toFixed(2)}` : 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {p.inStock ? p.store : 'Out of stock'}
                                  </div>
                                </div>
                                {isBest && (
                                  <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-semibold ml-1">
                                    Best
                                  </span>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-gray-400 border-t border-gray-100 mt-10">
        PriceComp — Comparing prices so you don't have to
      </footer>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
