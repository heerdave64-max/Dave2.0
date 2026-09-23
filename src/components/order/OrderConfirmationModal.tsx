import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import { Order } from '../../types/store';

interface OrderConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onContinueShopping,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti burst animation on mount
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#000000'];
    const particles = Array.from({ length: 60 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.8) * 8,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha -= 0.012;
        p.rotation += 4;
        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      if (alive) {
        animId = requestAnimationFrame(render);
      }
    };
    render();

    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Confetti Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-20 w-full h-full"
        />

        {/* Modal Top Header */}
        <div className="p-6 text-center space-y-3 bg-gradient-to-b from-emerald-50/70 to-white border-b border-slate-100">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-widest">
              Payment Authorized & Verified
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Order Confirmed!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Receipt sent to <strong className="text-slate-800">{order.shippingAddress.email}</strong>
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
            <span>Order Reference:</span>
            <strong className="text-slate-900 font-bold">{order.id}</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* SPECIAL COLLECTOR CERTIFICATE IF SUIT UP FOR 39 WAS IN ORDER */}
          {order.collectorEditionNumber && (
            <div className="p-4 rounded-xl bg-slate-950 text-white border border-red-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-red-400" />
                  <span>OFFICIAL COLLECTOR ARCHIVE</span>
                </span>
                <span className="text-[11px] font-mono text-amber-300">NFC ENCRYPTED</span>
              </div>
              <p className="text-xs text-slate-300">
                You are registered as the verified owner of <strong>Suit Up for 39 Edition #{order.collectorEditionNumber}</strong>. Your physical NFC provenance badge has been sealed into your collector archive box.
              </p>
            </div>
          )}

          {/* Delivery & Tracking Timeline */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Estimated Arrival: <strong>{order.estimatedDelivery}</strong></span>
              </span>
              <span className="font-mono text-slate-500 text-[11px]">Track: {order.trackingNumber}</span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-4 gap-2 text-center pt-2">
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-900 block">Confirmed</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[10px] font-semibold text-blue-700 block">Packaging</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-slate-200" />
                <span className="text-[10px] text-slate-400 block">Courier</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-slate-200" />
                <span className="text-[10px] text-slate-400 block">Delivered</span>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Items Ordered ({order.items.length})
            </h4>
            <div className="divide-y divide-slate-100 border-y border-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block truncate max-w-xs">
                        {item.product.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.selectedColor.name} {item.selectedSize ? `· Size ${item.selectedSize}` : ''} · Qty {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="space-y-1.5 text-xs text-slate-600 pt-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount Applied</span>
                <span className="font-mono">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-mono text-slate-900">
                {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-mono text-slate-900">${order.tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Paid via {order.paymentMethod === 'google_pay' ? 'Google Pay' : order.paymentMethod.toUpperCase()}</span>
              <span className="font-mono text-base">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <strong className="text-slate-800 block mb-0.5">Shipping To:</strong>
            <div>{order.shippingAddress.fullName}</div>
            <div>{order.shippingAddress.street} {order.shippingAddress.apartment}</div>
            <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-1/2 min-h-[44px] py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order Receipt</span>
            </button>

            <button
              onClick={onContinueShopping}
              className="w-full sm:w-1/2 min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
