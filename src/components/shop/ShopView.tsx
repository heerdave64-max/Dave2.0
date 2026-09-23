import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Tag, Sparkles, Check } from 'lucide-react';
import { Product, ProductCategory, ProductCollection } from '../../types/store';
import { PRODUCTS, CATEGORIES_LIST, COLLECTIONS_LIST } from '../../data/products';
import { ProductCard } from '../common/ProductCard';

interface ShopViewProps {
  initialCategory?: string;
  initialCollection?: string;
  onSelectProduct: (product: Product) => void;
  onNavigateCampaign: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  initialCategory = 'all',
  initialCollection,
  onSelectProduct,
  onNavigateCampaign,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(initialCollection || null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedCollection && p.collection !== selectedCollection) return false;
      if (p.price > maxPrice) return false;
      if (onlyInStock && p.stock <= 0) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured (heroes first, bestsellers)
      if (a.isHero && !b.isHero) return -1;
      if (!a.isHero && b.isHero) return 1;
      return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
    });
  }, [selectedCategory, selectedCollection, maxPrice, onlyInStock, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Storefront Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {selectedCollection
              ? `${selectedCollection.replace('-', ' ').toUpperCase()} COLLECTION`
              : selectedCategory === 'all'
              ? 'All Merchandise'
              : selectedCategory.toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filteredProducts.length} verified authentic products
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="sm:hidden min-h-[44px] px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-2 bg-white text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent outline-hidden font-medium text-slate-800 cursor-pointer"
            >
              <option value="featured">Sort: Featured & Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pill/Segmented Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_LIST.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedCollection(null);
            }}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id && !selectedCollection
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}

        {/* Collection Filter Buttons */}
        <div className="h-5 w-px bg-slate-300 mx-1 shrink-0" />

        <button
          onClick={() => {
            setSelectedCollection('1998-retro');
            setSelectedCategory('all');
          }}
          className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCollection === '1998-retro'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 border border-amber-200/80 text-amber-900 hover:bg-amber-100'
          }`}
        >
          <span>1998 Retro</span>
          <span className="text-[10px] bg-amber-700/20 px-1 rounded">Hero</span>
        </button>

        <button
          onClick={onNavigateCampaign}
          className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
        >
          <span>Suit Up for 39</span>
          <span className="text-[10px] bg-red-600 text-white px-1.5 rounded font-mono font-bold">2 Left</span>
        </button>
      </div>

      {/* Active Filter Chips / Reset */}
      {(selectedCategory !== 'all' || selectedCollection || maxPrice < 150) && (
        <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
          <span>Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')}>✕</button>
            </span>
          )}
          {selectedCollection && (
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
              Collection: {selectedCollection}
              <button onClick={() => setSelectedCollection(null)}>✕</button>
            </span>
          )}
          {maxPrice < 150 && (
            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              Under ${maxPrice}
              <button onClick={() => setMaxPrice(150)}>✕</button>
            </span>
          )}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCollection(null);
              setMaxPrice(150);
            }}
            className="text-blue-600 hover:underline font-semibold ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid: 2 columns on mobile (PRD Sec 8 requirement), 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">No products match your current filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCollection(null);
              setMaxPrice(150);
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
