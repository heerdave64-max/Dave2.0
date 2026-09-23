import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, ArrowLeft, Check, CreditCard, Lock, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ShippingAddress, PaymentMethodType, Order } from '../../types/store';
import { useAnalytics } from '../../context/AnalyticsContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
  initialPaymentMethod?: PaymentMethodType;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderComplete,
  initialPaymentMethod = 'credit_card',
}) => {
  const { items, subtotal, discount, shipping, tax, total, completeOrder, totalItemsCount } = useCart();
  const { logEvent } = useAnalytics();

  const [step, setStep] = useState<'contact' | 'address' | 'payment'>('contact');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(initialPaymentMethod);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: 'Alex Chen',
    email: 'alex.chen@androiddev.io',
    phone: '+1 (650) 555-0198',
    street: '1600 Amphitheatre Parkway',
    apartment: 'Bldg 43, Ste 200',
    city: 'Mountain View',
    state: 'CA',
    zipCode: '94043',
    country: 'United States',
  });

  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    exp: '09/28',
    cvv: '984',
    nameOnCard: 'Alex Chen',
  });

  if (!isOpen) return null;

  const handleQuickAutofillGoogle = () => {
    setFormData({
      fullName: 'Alex Chen',
      email: 'alex.chen@androiddev.io',
      phone: '+1 (650) 555-0198',
      street: '1600 Amphitheatre Parkway',
      apartment: 'Bldg 43, Ste 200',
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94043',
      country: 'United States',
    });
  };

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'contact') {
      logEvent('add_payment_info', { step: 'contact_submitted' });
      setStep('address');
    } else if (step === 'address') {
      logEvent('add_payment_info', { step: 'address_submitted' });
      setStep('payment');
    } else if (step === 'payment') {
      handleFinalizeOrder();
    }
  };

  const handleFinalizeOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = completeOrder(formData, paymentMethod);
      setIsProcessing(false);
      onOrderComplete(order);
    }, 1200);
  };

  const handleInstantGooglePay = () => {
    setPaymentMethod('google_pay');
    setIsProcessing(true);
    setTimeout(() => {
      const order = completeOrder(formData, 'google_pay');
      setIsProcessing(false);
      onOrderComplete(order);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">Secure Express Checkout</span>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setStep('contact')}
              className={`flex items-center gap-1.5 font-medium ${
                step === 'contact' ? 'text-blue-600 font-bold' : 'text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'contact' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
              <span>Contact</span>
            </button>

            <span className="text-slate-300">──</span>

            <button
              onClick={() => setStep('address')}
              className={`flex items-center gap-1.5 font-medium ${
                step === 'address' ? 'text-blue-600 font-bold' : 'text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'address' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
              <span>Shipping</span>
            </button>

            <span className="text-slate-300">──</span>

            <button
              onClick={() => setStep('payment')}
              className={`flex items-center gap-1.5 font-medium ${
                step === 'payment' ? 'text-blue-600 font-bold' : 'text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
              <span>Payment</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* FAST 1-CLICK GOOGLE PAY BANNER (PRD Section 13) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Express Chrome / Android Checkout</span>
              </div>
              <p className="text-[11px] text-slate-500">
                1-tap checkout with your default Google Account payment & address.
              </p>
            </div>

            <button
              type="button"
              onClick={handleInstantGooglePay}
              disabled={isProcessing}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-black hover:bg-slate-900 active:scale-95 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
            >
              <span>Instant Pay with</span>
              <div className="flex items-center gap-0.5 font-semibold">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
                <span className="text-white ml-0.5 font-normal">Pay</span>
              </div>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Or continue with guest checkout
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Checkout Steps Form */}
          <form onSubmit={handleStepSubmit} className="space-y-4">
            {/* Step 1: Contact */}
            {step === 'contact' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">1. Contact Information</h3>
                  <button
                    type="button"
                    onClick={handleQuickAutofillGoogle}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Quick Autofill
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address (for order receipt & tracking)
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Phone Number (for courier SMS updates)
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span>Continue to Shipping Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === 'address' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">2. Shipping Destination</h3>
                  <button
                    type="button"
                    onClick={() => setStep('contact')}
                    className="text-xs text-slate-500 hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Apt, Suite, Bldg (optional)</label>
                    <input
                      type="text"
                      value={formData.apartment || ''}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 outline-hidden font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">3. Select Payment</h3>
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="text-xs text-slate-500 hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                {/* Payment Selection Options */}
                <div className="space-y-2">
                  {/* Option: Google Pay */}
                  <label
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'google_pay'
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'google_pay'}
                        onChange={() => setPaymentMethod('google_pay')}
                        className="text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Google Pay</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">Fastest 1-tap authenticated checkout</p>
                      </div>
                    </div>
                    <div className="font-semibold text-xs tracking-tight">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">P</span>
                      <span className="text-[#FBBC05]">a</span>
                      <span className="text-[#34A853]">y</span>
                    </div>
                  </label>

                  {/* Option: Credit Card */}
                  <label
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                        className="text-blue-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Credit / Debit Card</span>
                        <p className="text-[11px] text-slate-500">Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-slate-500" />
                  </label>

                  {/* Option: Cash on Delivery (COD) */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-blue-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                        <p className="text-[11px] text-slate-500">Pay cash upon package delivery</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700">COD</span>
                  </label>
                </div>

                {/* Credit Card inputs if selected */}
                {paymentMethod === 'credit_card' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full min-h-[40px] px-3 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Expires</label>
                        <input
                          type="text"
                          value={cardData.exp}
                          onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                          className="w-full min-h-[40px] px-3 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">CVV</label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full min-h-[40px] px-3 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Order Review & Place Order Button */}
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Total Charged</span>
                    <span className="text-lg font-bold font-mono text-slate-900">${total.toFixed(2)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full min-h-[50px] py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="animate-pulse">Authorizing Payment...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Place Order · ${total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
