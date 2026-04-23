'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const POPULAR = ['iPhone 15', 'MacBook Air M2', 'Samsung 4K TV', 'AirPods Pro', 'PS5', 'Nike Air Max'];

const STORES = [
  { name: 'Amazon', color: '#FF9900', letter: 'A' },
  { name: 'Walmart', color: '#0071DC', letter: 'W' },
  { name: 'Best Buy', color: '#003087', letter: 'BB' },
  { name: 'eBay', color: '#E53238', letter: 'e' },
  { name: 'Target', color: '#CC0000', letter: 'T' },
  { name: 'Etsy', color: '#F56400', letter: 'E' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const search = (q: string) => {
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="bg-green-600 text-white text-center text-xs py-2 font-medium tracking-wide">
        100% Free — No account needed. Compare prices instantly!
      </div>

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="font-black text-2xl text-gray-900 tracking-tight">
              Price<span className="text-green-600">Comp</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-green-600 transition-colors">Deals</a>
            <a href="#" className="hover:text-green-600 transition-colors">Categories</a>
            <a href="#" className="hover:text-green-600 transition-colors">Price Alerts</a>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
            Live prices updated every hour
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Stop overpaying.<br />
            <span className="text-green-600">Find the best price.</span>
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Compare prices from Amazon, Walmart, Best Buy and 10+ more stores.
            Find the lowest price in seconds — completely free.
          </p>

          <div className="bg-white rounded-2xl p-2 flex gap-2 max-w-2xl mx-auto border-2 border-gray-100 shadow-xl mb-6">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search(query)}
              placeholder='Search any product e.g. "iPhone 15"'
              className="flex-1 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              autoFocus
            />
            <button
              onClick={() => search(query)}
              className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-8 py-3 rounded-xl font-bold text-base transition-all shadow-sm"
            >
              Compare prices
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400 font-medium">Trending:</span>
            {POPULAR.map(term => (
              <button
                key={term}
                onClick={() => search(term)}
                className="px-3 py-1.5 bg-white border border-gray-200 hover:border-green-400 hover:bg-green-50 hover:text-green-700 text-gray-600 rounded-full text-sm font-medium transition-all shadow-sm"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 py-8 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs text-gray-400 font-semibold mb-6 uppercase tracking-widest">
            Comparing prices from
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {STORES.map(store => (
              <div
                key={store.name}
                className="flex items-center gap-2 px-5 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                  style={{ background: store.color }}
                >
                  {store.letter}
                </div>
                <span className="text-sm font-semibold text-gray-700">{store.name}</span>
              </div>
            ))}
            <div className="px-5 py-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 font-medium">
              + 4 more
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">How PriceComp works</h2>
            <p className="text-gray-500 text-lg">Three steps to finding the best deal</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Search any product', desc: 'Type what you are looking for — phones, laptops, TVs, shoes, anything', color: 'bg-blue-50 text-blue-600' },
              { step: '02', title: 'We compare all stores', desc: 'Our engine instantly checks prices across Amazon, Walmart, Best Buy and more', color: 'bg-green-50 text-green-600' },
              { step: '03', title: 'You save money', desc: 'See all prices side by side and click Buy Now on the cheapest option', color: 'bg-purple-50 text-purple-600' },
            ].map(item => (
              <div key={item.step} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 font-black text-lg`}>
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-green-600">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { num: '10+', label: 'Stores compared' },
            { num: '1M+', label: 'Products tracked' },
            { num: '$500', label: 'Avg yearly savings' },
            { num: '100%', label: 'Free forever' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl font-black mb-1">{s.num}</div>
              <div className="text-green-200 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to save money?</h2>
          <p className="text-gray-500 mb-8 text-lg">Search any product and start comparing prices right now.</p>
          <div className="flex gap-3 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search a product..."
              className="flex-1 px-5 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-500 text-base bg-white"
              onKeyDown={e => {
                if (e.key === 'Enter') search((e.target as HTMLInputElement).value);
              }}
            />
            <button
              onClick={() => search(query)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">P</span>
            </div>
            <span className="font-bold text-white">PriceComp</span>
          </div>
          <p className="text-sm">2025 PriceComp. Free price comparison for US shoppers.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
