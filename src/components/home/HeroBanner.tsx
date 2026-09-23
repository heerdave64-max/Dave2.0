import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import heroRetroImg from '../../assets/images/hero_1998_retro_hoodie_1790190889981.jpg';

interface HeroBannerProps {
  onShopRetro: () => void;
  onExploreCampaign: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopRetro, onExploreCampaign }) => {
  return (
    <div className="relative bg-[#f8f9fa] border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Messaging Column */}
          <div className="lg:col-span-6 space-y-5 text-left">
            {/* Unboxed editorial category kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Official Heritage Capsule</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-700 font-bold">1998 Archive</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] text-balance">
              RETRO IS BACK. <br />
              <span className="text-slate-800 font-normal">Wear the era.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
              Milled in heavyweight 420 GSM organic French terry cotton with authentic Stanford garage spectrum embroidery. Built to outlast trends.
            </p>

            {/* CTAs Visible without scrolling on mobile (PRD Section 7) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onShopRetro}
                className="min-h-[48px] px-6 py-3 bg-slate-900 hover:bg-blue-600 active:scale-98 text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Shop Retro Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCampaign}
                className="min-h-[48px] px-5 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Suit Up for 39 (2 Left)</span>
              </button>
            </div>

            {/* Adjacency Trust Micro-copy */}
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Google Pay 1-Tap</span>
              </span>
              <span>·</span>
              <span>Free Shipping over $65</span>
              <span>·</span>
              <span>30-Day Returns</span>
            </div>
          </div>

          {/* Right Visual Hero Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-200">
              <img
                src={heroRetroImg}
                alt="1998 Retro Marine Layer Google Hoodie"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Subtle Floating Feature Tag */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200/70 text-xs">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Featured Heritage Piece
                </div>
                <div className="font-bold text-slate-900 mt-0.5">
                  1998 Marine Layer Pullover · <span className="font-mono text-blue-600">$68.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
