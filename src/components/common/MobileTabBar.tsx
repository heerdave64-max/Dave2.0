import React from 'react';
import { Home, Compass, Flame, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface MobileTabBarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ currentView, onNavigate }) => {
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistIds } = useWishlist();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, action: () => onNavigate('home') },
    { id: 'shop', label: 'Shop', icon: Compass, action: () => onNavigate('shop') },
    {
      id: 'campaign',
      label: 'Suit Up',
      icon: Flame,
      action: () => onNavigate('campaign'),
      highlight: true,
    },
    { id: 'wishlist', label: 'Saved', icon: Heart, action: () => onNavigate('wishlist'), count: wishlistIds.length },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      action: () => setIsCartDrawerOpen(true),
      count: totalItemsCount,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={tab.action}
              className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center relative transition-all active:scale-90 ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    tab.highlight && !isActive ? 'text-red-500 animate-pulse' : ''
                  }`}
                />
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-slate-900 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 truncate ${
                  isActive ? 'font-bold text-blue-600' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
