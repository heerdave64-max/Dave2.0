import React from 'react';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types/store';

interface WishlistViewProps {
  onSelectProduct: (product: Product) => void;
  onExploreShop: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ onSelectProduct, onExploreShop }) => {
  const { wishlistIds } = useWishlist();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>Saved Favorites</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Your Saved Merchandise ({wishlistedProducts.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Items saved for later. Fast 1-tap checkout with Google Pay.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Your wishlist is empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tap the heart icon on any product in the 1998 Retro or Core collection to save it here.
          </p>
          <button
            onClick={onExploreShop}
            className="mt-2 min-h-[44px] px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 inline-flex items-center gap-2"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
