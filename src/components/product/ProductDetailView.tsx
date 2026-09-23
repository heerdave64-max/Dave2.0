import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Ruler,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Product, ProductColor } from '../../types/store';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { PRODUCTS, SPECTRA_TUMBLER_ID } from '../../data/products';
import { useAnalytics } from '../../context/AnalyticsContext';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onSelectProduct,
}) => {
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { logEvent } = useAnalytics();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[1] || product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping'>('details');

  const isFavorited = isInWishlist(product.id);
  const crossSellProduct = product.crossSellProductId
    ? PRODUCTS.find((p) => p.id === product.crossSellProductId)
    : null;

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handle1ClickGooglePay = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsCartDrawerOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
      {/* Back & Breadcrumb Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="min-h-[44px] px-3 -ml-3 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            title="Share Product"
          >
            {copiedLink ? (
              <span className="text-xs text-emerald-600 font-semibold">Copied!</span>
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => toggleWishlist(product)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Wishlist toggle"
          >
            <Heart
              className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column (Sticky left on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square sm:aspect-4/3 w-full bg-[#f8f9fa] rounded-2xl overflow-hidden border border-slate-200/80 flex items-center justify-center relative">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {product.isLimitedDrop && (
              <div className="absolute top-4 left-4 bg-slate-900 text-amber-400 text-xs font-mono font-bold px-3 py-1.5 rounded-lg shadow-lg border border-amber-400/30">
                LIMITED DROP: 37/39 CLAIMED
              </div>
            )}
          </div>

          {/* Thumbnail switcher if multiple images */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module Column (Sticky right on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Unboxed Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <span>{product.collection.replace('-', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 mt-2 font-normal leading-relaxed">
              {product.tagline}
            </p>

            {/* Price & Rating */}
            <div className="flex items-center justify-between pt-4 pb-2 border-b border-slate-100">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-slate-400 font-mono tabular-nums">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-slate-900">{product.rating}</span>
                <span className="text-slate-400 font-mono">({product.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Color: <strong>{selectedColor.name}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center p-1 transition-all cursor-pointer ${
                    selectedColor.name === color.name
                      ? 'ring-2 ring-slate-900 ring-offset-2'
                      : 'hover:scale-105'
                  }`}
                  aria-label={`Select ${color.name} color`}
                >
                  <span
                    className="w-8 h-8 rounded-full border border-slate-300 block"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection & Size Guide */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-medium text-slate-700">
                <span>Size: <strong>{selectedSize || 'Select a size'}</strong></span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-h-[44px] rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 text-slate-800 hover:border-slate-400 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Stock Status */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:bg-slate-200"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-mono font-semibold text-sm text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:bg-slate-200"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>In stock ({product.stock} units) — ships next business day</span>
            </div>
          </div>

          {/* Desktop Buy CTAs */}
          <div className="space-y-2.5 pt-2 hidden sm:block">
            {/* Google Pay 1-Click Button */}
            <button
              onClick={handle1ClickGooglePay}
              className="w-full min-h-[48px] py-3 px-6 bg-black hover:bg-slate-900 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="text-slate-300 text-xs">Buy now with</span>
              <div className="flex items-center gap-1 font-semibold tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
                <span className="text-white ml-0.5">Pay</span>
              </div>
            </button>

            {/* Standard Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full min-h-[48px] py-3 px-6 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              Add to Cart · ${(product.price * quantity).toFixed(2)}
            </button>
          </div>

          {/* MANDATORY CROSS-SELL MODULE: SPECTRA TUMBLER (Section 12 PRD) */}
          {crossSellProduct && crossSellProduct.id !== product.id && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Frequently Paired Together</span>
                </span>
                <span className="text-[10px] font-mono font-semibold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                  Best Value
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={crossSellProduct.images[0]}
                  alt={crossSellProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {crossSellProduct.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    {product.crossSellCallout || crossSellProduct.tagline}
                  </p>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    +${crossSellProduct.price.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(crossSellProduct, crossSellProduct.colors[0], undefined, 1)}
                  className="min-h-[40px] px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}

          {/* Product Specifications & Trust Tabs */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Overview & Features
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'materials'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Materials & Care
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'shipping'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed min-h-[90px]">
              {activeTab === 'details' && (
                <div className="space-y-2">
                  <p>{product.description}</p>
                  <ul className="space-y-1 mt-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-2">
                  <p><strong>Composition:</strong> {product.details.materials}</p>
                  <p><strong>Fit Guide:</strong> {product.details.fit}</p>
                  <p><strong>Care Instructions:</strong> {product.details.care}</p>
                  <p><strong>Country of Assembly:</strong> {product.details.origin}</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Fast Carbon-Neutral Shipping</strong>
                      <span>Free standard shipping on all orders over $65. Arrives in 2-4 business days.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <RotateCcw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Hassle-Free 30-Day Returns</strong>
                      <span>Unworn items with original tags can be returned for full refund or exchange.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Garment Sizing Specs (Inches)</h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-slate-400 hover:text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">Chest Width</th>
                    <th className="py-2 px-3">Body Length</th>
                    <th className="py-2 px-3">Sleeve Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-600">
                  <tr><td className="py-2 px-3 font-bold text-slate-900">XS</td><td className="py-2 px-3">38"</td><td className="py-2 px-3">26.5"</td><td className="py-2 px-3">32.5"</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-slate-900">S</td><td className="py-2 px-3">40"</td><td className="py-2 px-3">27.5"</td><td className="py-2 px-3">33.5"</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-slate-900">M</td><td className="py-2 px-3">42"</td><td className="py-2 px-3">28.5"</td><td className="py-2 px-3">34.5"</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-slate-900">L</td><td className="py-2 px-3">45"</td><td className="py-2 px-3">29.5"</td><td className="py-2 px-3">35.5"</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-slate-900">XL</td><td className="py-2 px-3">48"</td><td className="py-2 px-3">30.5"</td><td className="py-2 px-3">36.5"</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-slate-900">2XL</td><td className="py-2 px-3">51"</td><td className="py-2 px-3">31.5"</td><td className="py-2 px-3">37.5"</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500">
              Measured flat across garment. Machine washable pre-shrunk cotton terry.
            </p>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BUY CTA BAR (PRD Section 10 & Mobile Touch Ref Pattern C) */}
      <div className="sm:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-slate-500 line-clamp-1">{product.name}</div>
          <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
            ${(product.price * quantity).toFixed(2)}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="min-h-[48px] px-6 bg-slate-900 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
