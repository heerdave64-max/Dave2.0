export type ProductCategory = 'apparel' | 'accessories' | 'drinkware' | 'collectibles';

export type ProductCollection = '1998-retro' | 'suit-up-39' | 'chrome-dino' | 'core';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  collection: ProductCollection;
  images: string[];
  description: string;
  features: string[];
  colors: ProductColor[];
  sizes?: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isHero?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  isLimitedDrop?: boolean;
  limitedDropTotal?: number;
  limitedDropClaimed?: number;
  crossSellProductId?: string;
  crossSellCallout?: string;
  details: {
    materials: string;
    care: string;
    origin: string;
    fit: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize?: string;
  quantity: number;
  collectorEditionNumber?: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type PaymentMethodType = 'google_pay' | 'credit_card' | 'cod';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: string;
  collectorEditionNumber?: number;
}

export interface GA4TelemetryEvent {
  id: string;
  timestamp: string;
  eventName:
    | 'page_view'
    | 'view_item_list'
    | 'select_item'
    | 'view_item'
    | 'add_to_cart'
    | 'view_cart'
    | 'begin_checkout'
    | 'add_payment_info'
    | 'purchase'
    | 'apply_promo'
    | 'cross_sell_added';
  parameters: Record<string, string | number | boolean | undefined>;
}
