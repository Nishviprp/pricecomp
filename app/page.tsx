'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      
      <div className="mb-2 text-4xl font-bold text-green-600">PriceComp</div>
      <p className="text-gray-500 mb-8 text-lg">
        Compare prices across Amazon, Walmart & Best Buy
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search for a product e.g. "iPhone 15" or "Samsung TV"'
          className="flex-1 border border-gray-300 rounded-xl px-5 py-4 text-base 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 
                     rounded-xl font-medium text-base transition-colors"
        >
          Search
        </button>
      </form>

      <div className="mt-6 flex gap-3 flex-wrap justify-center">
        {['iPhone 15', 'MacBook Air', 'Samsung TV', 'AirPods Pro', 'PS5'].map((term) => (
          <button
            key={term}
            onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 
                       rounded-full text-sm transition-colors"
          >
            {term}
          </button>
        ))}
      </div>

      <div className="mt-16 flex gap-8 text-center text-sm text-gray-400">
        <div><div className="text-2xl font-bold text-gray-700">3+</div>Stores compared</div>
        <div><div className="text-2xl font-bold text-gray-700">1M+</div>Products tracked</div>
        <div><div className="text-2xl font-bold text-gray-700">Free</div>Always free</div>
      </div>

    </main>
  );
}