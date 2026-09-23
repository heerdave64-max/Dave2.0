import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductColor, Order, PaymentMethodType, ShippingAddress } from '../types/store';
import { PRODUCTS, SPECTRA_TUMBLER_ID, DOOMSDAY_HOODIE_ID } from '../data/products';
import { useAnalytics } from './AnalyticsContext';

export const FREE_SHIPPING_THRESHOLD = 65.0;
export const STANDARD_SHIPPING_FEE = 5.99;

interface PromoCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description: string;
}

const PROMO_CODES: Record<string, PromoCode> = {
  GOOGLE10: { code: 'GOOGLE10', type: 'percent', value: 10, description: '10% off entire order' },
  RETRO1998: { code: 'RETRO1998', type: 'percent', value: 15, description: '15% off 1998 Retro Collection' },
  DOOMSDAY39: { code: 'DOOMSDAY39', type: 'fixed', value: 20, description: '$20 off collector order' },
};

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    selectedColor?: ProductColor,
    selectedSize?: string,
    quantity?: number,
    collectorNumber?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  totalItemsCount: number;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  addSpectraCrossSell: () => void;
  isSpectraInCart: boolean;
  activeOrder: Order | null;
  completeOrder: (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethodType
  ) => Order;
  feedbackNotification: { show: boolean; message: string; productName?: string } | null;
  dismissFeedback: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { logEvent } = useAnalytics();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gmerch_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('gmerch_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [feedbackNotification, setFeedbackNotification] = useState<{
    show: boolean;
    message: string;
    productName?: string;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('gmerch_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  useEffect(() => {
    if (activeOrder) {
      try {
        localStorage.setItem('gmerch_last_order', JSON.stringify(activeOrder));
      } catch {
        // ignore
      }
    }
  }, [activeOrder]);

  const addToCart = (
    product: Product,
    selectedColor?: ProductColor,
    selectedSize?: string,
    quantity = 1,
    collectorNumber?: number
  ) => {
    const color = selectedColor || product.colors[0];
    const size = selectedSize || (product.sizes ? product.sizes[0] : undefined);
    const cartItemId = `${product.id}-${color.name}-${size || 'nosize'}-${collectorNumber || 'std'}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity,
          collectorEditionNumber: collectorNumber,
        },
      ];
    });

    logEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity,
      item_category: product.category,
      variant: `${color.name} / ${size || 'default'}`,
    });

    setFeedbackNotification({
      show: true,
      message: `Added to cart (${quantity}x)`,
      productName: product.name,
    });

    setTimeout(() => {
      setFeedbackNotification((current) => (current?.show ? null : current));
    }, 3500);

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const addSpectraCrossSell = () => {
    const spectra = PRODUCTS.find((p) => p.id === SPECTRA_TUMBLER_ID);
    if (spectra) {
      addToCart(spectra, spectra.colors[0], undefined, 1);
      logEvent('cross_sell_added', {
        item_id: spectra.id,
        item_name: spectra.name,
        source: 'cart_cross_sell_widget',
      });
    }
  };

  const isSpectraInCart = items.some((item) => item.productId === SPECTRA_TUMBLER_ID);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discount = (subtotal * appliedPromo.value) / 100;
    } else {
      discount = Math.min(subtotal, appliedPromo.value);
    }
  }

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const tax = Number(((subtotal - discount) * 0.0825).toFixed(2));
  const total = Math.max(0, Number((subtotal - discount + shipping + tax).toFixed(2)));

  const applyPromoCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const promo = PROMO_CODES[normalized];
    if (promo) {
      setAppliedPromo(promo);
      logEvent('apply_promo', {
        coupon: normalized,
        discount_amount: promo.value,
      });
      return { success: true, message: `Applied code: ${promo.description}` };
    }
    return { success: false, message: 'Invalid promo code. Try "GOOGLE10" or "RETRO1998".' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const completeOrder = (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethodType
  ): Order => {
    const orderNumber = `GMR-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingCode = `TKR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Delivery 3 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const collectorItem = items.find((i) => i.collectorEditionNumber);

    const newOrder: Order = {
      id: orderNumber,
      createdAt: new Date().toISOString(),
      items: [...items],
      subtotal,
      discount,
      shipping,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      status: 'confirmed',
      trackingNumber: trackingCode,
      estimatedDelivery,
      collectorEditionNumber: collectorItem?.collectorEditionNumber || (items.some(i => i.productId === DOOMSDAY_HOODIE_ID) ? 38 : undefined),
    };

    setActiveOrder(newOrder);

    logEvent('purchase', {
      transaction_id: orderNumber,
      value: total,
      tax,
      shipping,
      currency: 'USD',
      items_count: totalItemsCount,
      payment_type: paymentMethod,
    });

    clearCart();
    return newOrder;
  };

  const dismissFeedback = () => setFeedbackNotification(null);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
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
        activeOrder,
        completeOrder,
        feedbackNotification,
        dismissFeedback,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
