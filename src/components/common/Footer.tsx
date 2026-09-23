import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenGA4Inspector: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenGA4Inspector }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pb-20 md:pb-8">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white block text-sm">Free Standard Delivery</strong>
              <span className="text-slate-400">On all orders over $65 in 48 contiguous states</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white block text-sm">1-Click Google Pay</strong>
              <span className="text-slate-400">Encrypted tokenization with zero card exposure</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white block text-sm">30-Day Free Returns</strong>
              <span className="text-slate-400">Pre-paid shipping label included in every box</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center space-x-0.5">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span>
              <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span>
              <span className="w-2 h-2 rounded-full bg-[#FBBC05]"></span>
              <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
            </div>
            <strong className="text-white text-sm">Google Merch Store</strong>
          </div>
          <p className="text-slate-400 leading-relaxed">
            The official merchandise shop reimagined for Android and Chrome mobile shoppers based on empirical GA4 user behavior data.
          </p>
          <button
            onClick={onOpenGA4Inspector}
            className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
          >
            <span>View GA4 Telemetry & Metrics</span>
          </button>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Priority Collections</h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate('collection', '1998-retro')}
                className="hover:text-white transition-colors"
              >
                1998 Retro Archive
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('campaign')}
                className="hover:text-white text-red-400 transition-colors"
              >
                Suit Up for 39 (Limited Drop)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('collection', 'chrome-dino')}
                className="hover:text-white transition-colors"
              >
                Chrome Dino Offline Edition
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('shop', 'drinkware')}
                className="hover:text-white transition-colors"
              >
                Spectra Insulated Drinkware
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Departments</h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate('shop', 'apparel')}
                className="hover:text-white transition-colors"
              >
                Apparel & Hoodies
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('shop', 'drinkware')}
                className="hover:text-white transition-colors"
              >
                Tumblers & Ceramic Mugs
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('shop', 'collectibles')}
                className="hover:text-white transition-colors"
              >
                Pixel Sculptures & Pins
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('shop', 'accessories')}
                className="hover:text-white transition-colors"
              >
                Commuter Bags & Caps
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Customer Support</h4>
          <ul className="space-y-2 text-slate-400">
            <li><span>Track Your Package (TKR)</span></li>
            <li><span>Campus Pickup Locations</span></li>
            <li><span>Sustainable GOTS Materials</span></li>
            <li><span>Privacy Policy & Terms</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} Google LLC. Merchandise designed and fulfilled under official license.
        </div>
        <div className="flex items-center gap-4">
          <span>Android & Chrome Optimized</span>
          <span>·</span>
          <span>Fast Google Pay</span>
        </div>
      </div>
    </footer>
  );
};
