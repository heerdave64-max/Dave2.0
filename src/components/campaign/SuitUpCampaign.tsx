import React, { useState, useEffect } from 'react';
import { Flame, ShieldCheck, Sparkles, Check, Clock, ArrowRight, Zap } from 'lucide-react';
import { PRODUCTS, DOOMSDAY_HOODIE_ID, SPECTRA_TUMBLER_ID } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useAnalytics } from '../../context/AnalyticsContext';

interface SuitUpCampaignProps {
  onBackToShop: () => void;
  onOpenProduct: (product: typeof PRODUCTS[0]) => void;
}

export const SuitUpCampaign: React.FC<SuitUpCampaignProps> = ({ onBackToShop, onOpenProduct }) => {
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { logEvent } = useAnalytics();

  const doomsdayHoodie = PRODUCTS.find((p) => p.id === DOOMSDAY_HOODIE_ID)!;
  const spectraTumbler = PRODUCTS.find((p) => p.id === SPECTRA_TUMBLER_ID)!;

  const [selectedTagNumber, setSelectedTagNumber] = useState<number>(38);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaimHoodie = () => {
    addToCart(doomsdayHoodie, doomsdayHoodie.colors[0], selectedSize, 1, selectedTagNumber);
    logEvent('add_to_cart', {
      item_id: doomsdayHoodie.id,
      item_name: doomsdayHoodie.name,
      campaign: 'suit_up_for_39',
      collector_edition_tag: selectedTagNumber,
      edition_total: 39,
    });
  };

  const handleClaimBundle = () => {
    // Add both hoodie and tumbler with bundle discount
    addToCart(doomsdayHoodie, doomsdayHoodie.colors[0], selectedSize, 1, selectedTagNumber);
    addToCart(spectraTumbler, spectraTumbler.colors[0], undefined, 1);
    logEvent('cross_sell_added', {
      bundle: 'suit_up_39_spectra_bundle',
      items: `${doomsdayHoodie.id},${spectraTumbler.id}`,
      savings: 10,
    });
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="bg-[#0b0f19] text-white min-h-screen">
      {/* Campaign Top Ticker */}
      <div className="border-b border-red-500/30 bg-red-950/40 px-4 py-2 text-center text-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider text-[11px]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Strictly Limited Drop
          </span>
          <span className="text-slate-400">·</span>
          <span className="font-mono text-slate-200">
            37 of 39 units verified and secured. Only 2 remaining.
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        {/* Campaign Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-semibold">
              <Flame className="w-3.5 h-3.5 fill-red-500" />
              <span>COLLECTOR SERIES NO. 01</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
              ONLY 39 WILL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300">
                SUIT UP.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
              Will you? Introducing the Doomsday Stealth Hoodie — custom engineered in obsidian 500 GSM heavyweight French terry. Each garment carries an individually numbered metallic silver patch and embedded cryptographic NFC verification.
            </p>

            {/* Scarcity Bar & Countdown */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">
                  Drop Allocation Status
                </span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  37 / 39 CLAIMED
                </span>
              </div>

              {/* Progress Meter */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${(37 / 39) * 100}%` }}
                />
              </div>

              {/* Drop Expiry Countdown */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Drop Window Closes In:</span>
                </span>
                <span className="font-mono font-bold text-white tracking-widest text-sm">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Interactive Collector Tag Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Choose Your Individual Serial Number:
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTagNumber(38)}
                  className={`flex-1 py-3 px-4 rounded-xl border text-center font-mono transition-all cursor-pointer ${
                    selectedTagNumber === 38
                      ? 'border-red-500 bg-red-950/40 text-white shadow-lg ring-1 ring-red-500'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold">TAG #38 / 39</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-sans">Available to Claim</div>
                </button>

                <button
                  onClick={() => setSelectedTagNumber(39)}
                  className={`flex-1 py-3 px-4 rounded-xl border text-center font-mono transition-all cursor-pointer ${
                    selectedTagNumber === 39
                      ? 'border-red-500 bg-red-950/40 text-white shadow-lg ring-1 ring-red-500'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold">TAG #39 / 39</div>
                  <div className="text-[10px] text-amber-400 mt-0.5 font-sans">FINAL EDITION PIECE</div>
                </button>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Size:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {['S', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                      selectedSize === sz
                        ? 'border-white bg-white text-slate-900'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleClaimHoodie}
                className="w-full min-h-[52px] px-6 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>CLAIM EDITION #{selectedTagNumber} · $120.00</span>
              </button>

              <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Includes physical NFC certificate of authenticity & archival gift box</span>
              </p>
            </div>
          </div>

          {/* Visual Showcase Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src={doomsdayHoodie.images[0]}
                alt={doomsdayHoodie.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Numbered Tag Simulated Overlay */}
              <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  VERIFIED TAG
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  #{selectedTagNumber} <span className="text-slate-500 text-sm">/ 39</span>
                </div>
                <div className="text-[9px] text-emerald-400 font-mono mt-0.5">
                  CRYPTOGRAPHIC NFC INCLUDED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRD SECTION 14: COMPLETE THE DROP BUNDLE CROSS-SELL */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 fill-amber-400" />
                <span>The Definitive Drop Bundle</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                Complete the Drop: Doomsday Hoodie + Spectra Tumbler
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The ultimate pairing: the stealth collector hoodie paired with the iconic 24h insulated tumbler.
              </p>
            </div>

            <div className="text-right sm:shrink-0">
              <div className="flex items-baseline gap-2 justify-end">
                <span className="text-2xl font-bold font-mono text-white">$142.00</span>
                <span className="text-sm line-through font-mono text-slate-500">$152.00</span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Bundle & Save $10</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item 1 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <img
                src={doomsdayHoodie.images[0]}
                alt={doomsdayHoodie.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover bg-slate-900"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-white truncate">{doomsdayHoodie.name}</h3>
                <p className="text-[11px] text-slate-400">Obsidian 500 GSM · Tag #{selectedTagNumber}</p>
                <span className="text-xs font-mono text-slate-300 font-semibold">$120.00</span>
              </div>
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <img
                src={spectraTumbler.images[0]}
                alt={spectraTumbler.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover bg-slate-900"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-white truncate">{spectraTumbler.name}</h3>
                <p className="text-[11px] text-slate-400">Matte Black + Iridescent Prism Ring</p>
                <span className="text-xs font-mono text-slate-300 font-semibold">$32.00</span>
              </div>
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              ✓ Free Express Courier Delivery included · ✓ Ships with numbered authenticity seal
            </div>
            <button
              onClick={handleClaimBundle}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer active:scale-98 shadow-md"
            >
              Claim Complete Drop Bundle · $142.00
            </button>
          </div>
        </div>

        {/* Story & Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-300">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white text-sm">01. 500 GSM Heavyweight Terry</h4>
            <p className="text-slate-400">
              Milled from dense ring-spun organic cotton with zero synthetics. Heavy drape that holds architectural streetwear structure without sagging.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white text-sm">02. Cryptographic Authenticity</h4>
            <p className="text-slate-400">
              Tap the right sleeve hem with any modern smartphone. The embedded NFC tag opens a private, non-forgeable provenance record confirming your edition number.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white text-sm">03. Never Re-issued</h4>
            <p className="text-slate-400">
              Once the 39 pieces are claimed, this design mold and embroidery digitizing file are permanently decommissioned.
            </p>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-slate-800">
          <button
            onClick={onBackToShop}
            className="text-xs text-slate-400 hover:text-white underline font-medium cursor-pointer"
          >
            ← Return to standard merchandise store
          </button>
        </div>
      </div>
    </div>
  );
};
