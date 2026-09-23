import React from 'react';
import { ArrowRight, Flame, Sparkles, Star, ShieldCheck, Check } from 'lucide-react';
import { HeroBanner } from './HeroBanner';
import { CategoryGrid } from './CategoryGrid';
import { SpectraSpotlight } from './SpectraSpotlight';
import { ProductCard } from '../common/ProductCard';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types/store';

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateShop: (category?: string) => void;
  onNavigateCollection: (collection: string) => void;
  onNavigateCampaign: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProduct,
  onNavigateShop,
  onNavigateCollection,
  onNavigateCampaign,
}) => {
  const retroProducts = PRODUCTS.filter((p) => p.collection === '1998-retro');
  const bestsellerProducts = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* 1. Hero Banner */}
      <HeroBanner
        onShopRetro={() => onNavigateCollection('1998-retro')}
        onExploreCampaign={onNavigateCampaign}
      />

      {/* 2. Urgent Limited Drop Ticker Banner (Suit Up for 39) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          onClick={onNavigateCampaign}
          className="group relative rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 p-5 sm:p-7 border border-red-500/40 text-white cursor-pointer shadow-lg hover:shadow-red-950/40 transition-all overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <Flame className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" />
                <span>LIMITED EXPERIMENTAL DROP</span>
                <span className="text-slate-400">·</span>
                <span className="text-red-400">37 / 39 ALLOCATED</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                "Suit Up for 39" — The Doomsday Stealth Hoodie
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Each hoodie is individually numbered in metallic silver thread with embedded cryptographic NFC authentication. Only 2 remain unallocated.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateCampaign();
                }}
                className="min-h-[44px] px-5 py-2.5 bg-red-600 group-hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>Claim Tag #38 or #39</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <CategoryGrid onSelectCategory={(cat) => onNavigateShop(cat)} />

      {/* 4. Featured 1998 Retro Collection (PRD Section 4 & 7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
              <span>Hero Capsule</span>
              <span aria-hidden="true">·</span>
              <span>1998 Stanford Garage Roots</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              The 1998 Retro Collection
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Custom-milled heavyweight organic terry with the authentic primary spectrum logo.
            </p>
          </div>

          <button
            onClick={() => onNavigateCollection('1998-retro')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-column mobile grid as required by PRD Section 8 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {retroProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. Spectra Tumbler High-Converting Cross-Sell Spotlight (PRD Section 12) */}
      <SpectraSpotlight />

      {/* 6. All-Time Bestsellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Campus Favorites
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Most Popular This Week
            </h2>
          </div>

          <button
            onClick={() => onNavigateShop('all')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Browse All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {bestsellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 7. Social Proof Section (PRD Section 15 & Constitution Section 1.H) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-8">
          <div className="max-w-2xl">
            <div className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Verified Ownership & Quality
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Crafted for everyday engineering and comfort.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Over 28,000 orders delivered across Mountain View, Zurich, Singapore, and worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="italic text-white">
                "The 1998 Marine Layer pullover is hands-down the softest hoodie I own. The stitching on the original 1998 logo is incredibly detailed."
              </p>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                <strong className="text-white font-medium">Elena R.</strong> · Staff Engineer, Sunnyvale
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="italic text-white">
                "The Spectra Tumbler fits perfectly in my bike holder and my ice literally doesn't melt until the next morning. 1-click Google Pay took 3 seconds."
              </p>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                <strong className="text-white font-medium">Marcus T.</strong> · Chrome Dev Ecosystem
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="italic text-white">
                "Claimed #12 of the Doomsday Hoodie. The NFC certificate is such a slick touch. You can feel the 500 GSM weight immediately."
              </p>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                <strong className="text-white font-medium">David K.</strong> · Limited Drop Collector
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
