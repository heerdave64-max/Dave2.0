import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, Tag, Check } from 'lucide-react';
import { useCart, FREE_SHIPPING_THRESHOLD } from '../../context/CartContext';
import { PRODUCTS, SPECTRA_TUMBLER_ID } from '../../data/products';
import { useAnalytics } from '../../context/AnalyticsContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onProceedToGooglePay: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onProceedToGooglePay,
}) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    totalItemsCount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    addSpectraCrossSell,
    isSpectraInCart,
  } = useCart();
  const { logEvent } = useAnalytics();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const spectraProduct = PRODUCTS.find((p) => p.id === SPECTRA_TUMBLER_ID);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, error: true });
    }
  };

  const handleCheckoutClick = () => {
    logEvent('begin_checkout', {
      value: total,
      currency: 'USD',
      items_count: totalItemsCount,
      has_cross_sell: isSpectraInCart,
    });
    onProceedToCheckout();
  };

  const handleGooglePayClick = () => {
    logEvent('begin_checkout', {
      value: total,
      currency: 'USD',
      payment_type: 'google_pay_1click',
      items_count: totalItemsCount,
      has_cross_sell: isSpectraInCart,
    });
    onProceedToGooglePay();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Cart Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Your Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 tabular-nums">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-blue-50/70 border-b border-blue-100">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-blue-900 font-medium mb-1.5 flex items-center justify-between">
                <span>
                  Add <strong className="font-bold">${remainingForFreeShipping.toFixed(2)}</strong> more for FREE shipping
                </span>
                <span className="text-[11px] font-mono text-blue-700">
                  {Math.round(freeShippingProgress)}%
                </span>
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-semibold mb-1.5 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You unlocked FREE Standard Shipping!</span>
              </p>
            )}
            <div className="w-full bg-blue-200/80 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  remainingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Scrollable Cart Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Tag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore the 1998 Retro collection or the limited Suit Up for 39 drop to start.
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3.5 items-start">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200/70"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Attributes */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{item.selectedColor.name}</span>
                        </span>
                        {item.selectedSize && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Size {item.selectedSize}</span>
                          </>
                        )}
                        {item.collectorEditionNumber && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-red-600 font-bold">
                              #{item.collectorEditionNumber}/39
                            </span>
                          </>
                        )}
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="min-h-[28px] min-w-[28px] flex items-center justify-center text-slate-600 hover:bg-slate-200"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-medium text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="min-h-[28px] min-w-[28px] flex items-center justify-center text-slate-600 hover:bg-slate-200"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 tabular-nums">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MANDATORY CROSS-SELL MODULE: SPECTRA TUMBLER (Section 12 PRD) */}
            {!isSpectraInCart && spectraProduct && (
              <div className="mt-4 p-3.5 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>Complete the look</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                    Highest rated companion
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={spectraProduct.images[0]}
                    alt={spectraProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-white border border-blue-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {spectraProduct.name}
                    </h5>
                    <p className="text-[11px] text-slate-600 line-clamp-1">
                      Matte black + iridescent prism ring
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        ${spectraProduct.price.toFixed(2)}
                      </span>
                      {spectraProduct.originalPrice && (
                        <span className="text-[10px] line-through text-slate-400 font-mono">
                          ${spectraProduct.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={addSpectraCrossSell}
                    className="min-h-[40px] px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Promo Code Accordion */}
            {items.length > 0 && (
              <div className="pt-2">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Promo <strong>{appliedPromo.code}</strong> applied (-${discount.toFixed(2)})
                      </span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-xs text-emerald-700 hover:text-red-600 font-medium underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. GOOGLE10)"
                      className="flex-1 min-h-[38px] px-3 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3.5 min-h-[38px] bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMessage && !appliedPromo && (
                  <p
                    className={`text-[11px] mt-1 ${
                      promoMessage.error ? 'text-red-500' : 'text-emerald-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sticky Footer Summary & CTAs */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-mono tabular-nums">
                    {shipping === 0 ? (
                      <strong className="text-emerald-600 uppercase text-[11px]">Free</strong>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total</span>
                  <span className="font-mono tabular-nums text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* HIGH-CONVERTING 1-CLICK GOOGLE PAY BUTTON (PRD Sec 13) */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleGooglePayClick}
                  className="w-full min-h-[48px] py-2.5 px-4 bg-black hover:bg-slate-900 active:scale-98 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span className="text-slate-300 text-xs">Buy with</span>
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

                {/* Standard Proceed to Checkout */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-slate-900 hover:bg-blue-600 active:scale-98 text-white rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Encrypted Checkout</span>
                </span>
                <span>·</span>
                <span>30-Day Free Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
