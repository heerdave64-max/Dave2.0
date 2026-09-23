import React, { useState } from 'react';
import { Star, ShieldCheck, Plus, Check, Sparkles } from 'lucide-react';
import { PRODUCTS, SPECTRA_TUMBLER_ID } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useAnalytics } from '../../context/AnalyticsContext';

export const SpectraSpotlight: React.FC = () => {
  const { addToCart } = useCart();
  const { logEvent } = useAnalytics();
  const spectra = PRODUCTS.find((p) => p.id === SPECTRA_TUMBLER_ID)!;

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const selectedColor = spectra.colors[selectedColorIndex];

  const handleAdd = () => {
    addToCart(spectra, selectedColor, undefined, 1);
    logEvent('cross_sell_added', {
      item_id: spectra.id,
      item_name: spectra.name,
      source: 'homepage_spotlight',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="bg-slate-50 border-y border-slate-200 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/70 relative">
              <img
                src={spectra.images[0]}
                alt={spectra.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                loading="lazy"
              />

              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-blue-700 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span>#1 Cart-To-Purchase Completion</span>
              </div>
            </div>
          </div>

          {/* Value Prop & Conversion Module */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <span>Core Essentials</span>
                <span aria-hidden="true">·</span>
                <span>All-Day Thermal Performance</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {spectra.name}
              </h2>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {spectra.description}
              </p>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-900">4.95 / 5.0</span>
              <span className="text-slate-400">·</span>
              <span>Based on 1,280+ verified Google campus orders</span>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-700">
                Finish: <strong className="text-slate-900">{selectedColor.name}</strong>
              </div>
              <div className="flex items-center gap-2">
                {spectra.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColorIndex(i)}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full p-1 transition-all cursor-pointer ${
                      selectedColorIndex === i ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full border border-slate-300 block"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Bullets */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24h Iced / 12h Piping Hot</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Splash-proof magnetic slider</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fits standard car cup holders</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero condensation outer wall</span>
              </li>
            </ul>

            {/* Action Bar */}
            <div className="pt-2 flex items-center gap-4">
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                ${spectra.price.toFixed(2)}
              </div>

              <button
                onClick={handleAdd}
                className={`min-h-[48px] px-6 rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  added ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-blue-600 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart · $32.00</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
