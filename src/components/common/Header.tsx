import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, BarChart3, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAnalytics } from '../../context/AnalyticsContext';

interface HeaderProps {
  currentView?: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
  isMobileDeviceView?: boolean;
  onToggleMobileDeviceView?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = 'home',
  onNavigate,
  onOpenSearch,
  isMobileDeviceView = false,
  onToggleMobileDeviceView,
}) => {
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistIds } = useWishlist();
  const { setIsInspectorOpen, events } = useAnalytics();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs px-4 py-2 flex items-center justify-between">
        <div className="mx-auto flex items-center gap-2 text-center text-slate-200">
          <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">Limited Drop</span>
          <span className="hidden sm:inline">·</span>
          <button
            onClick={() => onNavigate('campaign')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>Suit Up for 39: Only 2 hoodies left worldwide</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>
        <button
          onClick={() => setIsInspectorOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-emerald-400 hover:bg-slate-700 transition-colors"
          title="Open GA4 Funnel & Telemetry Inspector"
        >
          <BarChart3 className="w-3 h-3" />
          <span>GA4 Live ({events.length})</span>
        </button>
      </div>

      {/* Main Top Bar - Strict 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-slate-900 -ml-2"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="flex items-center space-x-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]"></span>
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Google Merch
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('shop')}
            className={`cursor-pointer transition-colors hover:text-slate-900 ${
              currentView === 'shop' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Shop All
          </button>
          <button
            onClick={() => onNavigate('collection', '1998-retro')}
            className="cursor-pointer transition-colors hover:text-slate-900 flex items-center gap-1.5"
          >
            <span>1998 Retro</span>
            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded px-1 font-mono uppercase">
              Hero
            </span>
          </button>
          <button
            onClick={() => onNavigate('campaign')}
            className="cursor-pointer transition-colors hover:text-slate-900 flex items-center gap-1.5"
          >
            <span>Suit Up for 39</span>
            <span className="text-[10px] text-red-600 bg-red-50 border border-red-200/60 rounded px-1 font-mono uppercase font-bold animate-pulse">
              37/39
            </span>
          </button>
          <button
            onClick={() => onNavigate('collection', 'chrome-dino')}
            className="cursor-pointer transition-colors hover:text-slate-900"
          >
            Chrome Dino
          </button>
          <button
            onClick={() => onNavigate('shop', 'drinkware')}
            className="cursor-pointer transition-colors hover:text-slate-900"
          >
            Spectra Tumbler
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions + Search & Cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Responsive Preview Toggle (Desktop Evaluators Tool) */}
          <button
            onClick={onToggleMobileDeviceView}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Toggle Android Mobile Screen Simulator to test mobile thumb ergonomics"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{isMobileDeviceView ? 'Exit Mobile Frame' : 'Test Mobile UX'}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Search Merchandise"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onNavigate('wishlist')}
            className="relative min-h-[44px] min-w-[44px] hidden sm:flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Saved Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative min-h-[44px] px-3 py-2 flex items-center gap-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer ml-1"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold tabular-nums">
              {totalItemsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Shop All Catalog
            </button>
            <button
              onClick={() => {
                onNavigate('collection', '1998-retro');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>1998 Retro Collection</span>
              <span className="text-xs text-amber-700 font-semibold">Hero</span>
            </button>
            <button
              onClick={() => {
                onNavigate('campaign');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-sm font-medium text-red-600 rounded-lg bg-red-50/60 hover:bg-red-50 flex items-center justify-between"
            >
              <span>Suit Up for 39 (Limited Drop)</span>
              <span className="text-xs font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">2 Left</span>
            </button>
            <button
              onClick={() => {
                onNavigate('collection', 'chrome-dino');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Chrome Dino Merchandise
            </button>
            <button
              onClick={() => {
                onNavigate('shop', 'drinkware');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Spectra Tumbler & Drinkware
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setIsInspectorOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 py-1 px-2 rounded bg-emerald-50"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Inspect GA4 Realtime Funnel</span>
            </button>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Official Google Merch</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
