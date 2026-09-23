import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '../../types/store';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor, product.sizes ? product.sizes[0] : undefined, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Visual Asset Container (65-70% visual weight) */}
      <div className="relative aspect-square w-full bg-[#f8f9fa] overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-100 text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">{product.category}</span>
            <span className="text-sm font-semibold text-slate-700 mt-1">{product.name}</span>
          </div>
        )}

        {/* Clean Editorial Tag (max 1 subtle tag, zero-pill) */}
        {product.isHero && (
          <div className="absolute top-2.5 left-2.5 text-[11px] font-semibold tracking-wide text-amber-800 bg-amber-50/90 backdrop-blur-xs px-2 py-0.5 rounded">
            Hero Retro
          </div>
        )}
        {product.isLimitedDrop && (
          <div className="absolute top-2.5 left-2.5 text-[11px] font-semibold tracking-wide text-red-700 bg-red-50/90 backdrop-blur-xs px-2 py-0.5 rounded">
            Edition of 39
          </div>
        )}
        {product.isBestseller && !product.isHero && !product.isLimitedDrop && (
          <div className="absolute top-2.5 left-2.5 text-[11px] font-semibold tracking-wide text-blue-700 bg-blue-50/90 backdrop-blur-xs px-2 py-0.5 rounded">
            Bestseller
          </div>
        )}

        {/* Wishlist Heart Button - Min 44x44 touch target */}
        <button
          onClick={handleHeartClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/85 backdrop-blur-xs text-slate-600 hover:text-red-500 hover:bg-white transition-all shadow-xs"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorited ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </button>

        {/* Quick Add Button on Hover (Desktop) or Persistent Icon on Mobile */}
        <button
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name} to cart`}
          className={`absolute bottom-2.5 right-2.5 min-h-[40px] px-3 flex items-center gap-1.5 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 cursor-pointer ${
            addedAnimation
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-white hover:bg-blue-600 md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick Add</span>
            </>
          )}
        </button>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.collection.replace('-', ' ')}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {product.tagline}
          </p>
        </div>

        {/* Pricing Baseline & Color Swatches */}
        <div className="pt-2 mt-auto border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Preview Swatches */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {product.colors.slice(0, 3).map((col, idx) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColorIndex(idx)}
                  title={col.name}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColorIndex === idx
                      ? 'ring-1 ring-slate-900 scale-110'
                      : 'border-slate-300 opacity-80'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  aria-label={`Select ${col.name} color`}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-slate-400 font-mono">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
