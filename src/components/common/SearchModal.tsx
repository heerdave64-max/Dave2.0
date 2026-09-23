import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { Product } from '../../types/store';
import { PRODUCTS } from '../../data/products';
import { useAnalytics } from '../../context/AnalyticsContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory,
}) => {
  const { logEvent } = useAnalytics();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPicks = [
    { label: '1998 Retro Hoodie', query: 'retro hoodie' },
    { label: 'Spectra Tumbler', query: 'spectra' },
    { label: 'Suit Up for 39', query: 'suit up' },
    { label: 'Chrome Dino', query: 'dino' },
    { label: 'T-Shirts', query: 'tee' },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredProducts = searchTerm.trim()
    ? PRODUCTS.filter((p) => {
        const query = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.tagline.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.collection.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      })
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      logEvent('select_item', {
        search_term: searchTerm,
        results_count: filteredProducts.length,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden mt-8 sm:mt-16 border border-slate-200">
        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, collections (e.g. 'retro hoodie', 'tumbler', 'dino')..."
            className="flex-1 text-sm sm:text-base outline-hidden text-slate-900 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="min-h-[36px] px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            Esc
          </button>
        </form>

        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Quick Suggestions when empty */}
          {!searchTerm.trim() ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Popular Quick Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickPicks.map((pick) => (
                    <button
                      key={pick.label}
                      onClick={() => setSearchTerm(pick.query)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                    >
                      {pick.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Browse by Category
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'apparel', label: 'Apparel' },
                    { id: 'drinkware', label: 'Drinkware' },
                    { id: 'collectibles', label: 'Collectibles' },
                    { id: 'accessories', label: 'Accessories' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        onClose();
                      }}
                      className="p-3 text-left rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {filteredProducts.length} Results for "{searchTerm}"
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 space-y-1">
                  <p>No products match your search query.</p>
                  <p className="text-slate-400">Try searching for "hoodie", "tumbler", or "1998".</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            {p.collection} · {p.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs sm:text-sm font-bold font-mono text-slate-900">
                          ${p.price.toFixed(2)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
