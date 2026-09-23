/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/common/Header';
import { MobileTabBar } from './components/common/MobileTabBar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HomeView } from './components/home/HomeView';
import { ShopView } from './components/shop/ShopView';
import { ProductDetailView } from './components/product/ProductDetailView';
import { SuitUpCampaign } from './components/campaign/SuitUpCampaign';
import { WishlistView } from './components/wishlist/WishlistView';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/order/OrderConfirmationModal';
import { GA4InspectorModal } from './components/analytics/GA4InspectorModal';
import { Product, Order, PaymentMethodType } from './types/store';
import { PRODUCTS } from './data/products';

type ViewMode = 'home' | 'shop' | 'campaign' | 'pdp' | 'wishlist';

const MainStoreContent: React.FC = () => {
  const { logEvent, setIsInspectorOpen } = useAnalytics();
  const { isCartDrawerOpen, setIsCartDrawerOpen } = useCart();

  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(false);
  const [checkoutInitialPayment, setCheckoutInitialPayment] = useState<PaymentMethodType>('credit_card');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

  // Navigate handler
  const handleNavigate = (view: string, param?: string) => {
    if (view === 'home') {
      setCurrentView('home');
      setSelectedProduct(null);
      logEvent('page_view', { page_title: 'Home', page_location: '/' });
    } else if (view === 'shop') {
      setActiveCategory(param || 'all');
      setActiveCollection(null);
      setCurrentView('shop');
      setSelectedProduct(null);
      logEvent('page_view', { page_title: 'Catalog', category: param || 'all' });
    } else if (view === 'collection') {
      setActiveCollection(param || null);
      setActiveCategory('all');
      setCurrentView('shop');
      setSelectedProduct(null);
      logEvent('page_view', { page_title: 'Collection', collection: param });
    } else if (view === 'campaign') {
      setCurrentView('campaign');
      setSelectedProduct(null);
      logEvent('page_view', {
        page_title: 'Suit Up for 39 Campaign',
        campaign_name: 'suit_up_for_39',
      });
    } else if (view === 'wishlist') {
      setCurrentView('wishlist');
      setSelectedProduct(null);
      logEvent('page_view', { page_title: 'Wishlist' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('pdp');
    logEvent('view_item', {
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
    });
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setCheckoutInitialPayment('credit_card');
    setIsCheckoutOpen(true);
  };

  const handleProceedToGooglePay = () => {
    setIsCartDrawerOpen(false);
    setCheckoutInitialPayment('google_pay');
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (order: Order) => {
    setIsCheckoutOpen(false);
    setCompletedOrder(order);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        isMobileDeviceView={isMobileDeviceView}
        onToggleMobileDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
      />

      {/* Main View Router - with optional simulated Android mobile device viewport */}
      <div className={isMobileDeviceView ? 'py-8 px-4 bg-slate-900 min-h-screen flex flex-col items-center' : 'w-full'}>
        {isMobileDeviceView && (
          <div className="mb-4 text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Simulated Pixel 8 Pro (Chrome on Android 15 · 412 × 915)</span>
            <button
              onClick={() => setIsMobileDeviceView(false)}
              className="text-emerald-400 underline ml-2 hover:text-white"
            >
              Exit
            </button>
          </div>
        )}

        <div className={isMobileDeviceView ? 'w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-slate-800 relative' : 'w-full'}>
          <main className="flex-1">
            {currentView === 'home' && (
              <HomeView
                onSelectProduct={handleSelectProduct}
                onNavigateShop={(cat) => handleNavigate('shop', cat)}
                onNavigateCollection={(col) => handleNavigate('collection', col)}
                onNavigateCampaign={() => handleNavigate('campaign')}
              />
            )}

            {currentView === 'shop' && (
              <ShopView
                initialCategory={activeCategory}
                initialCollection={activeCollection || undefined}
                onSelectProduct={handleSelectProduct}
                onNavigateCampaign={() => handleNavigate('campaign')}
              />
            )}

            {currentView === 'pdp' && selectedProduct && (
              <ProductDetailView
                product={selectedProduct}
                onBack={() => setCurrentView('shop')}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentView === 'campaign' && (
              <SuitUpCampaign
                onBackToShop={() => handleNavigate('home')}
                onOpenProduct={handleSelectProduct}
              />
            )}

            {currentView === 'wishlist' && (
              <WishlistView
                onSelectProduct={handleSelectProduct}
                onExploreShop={() => handleNavigate('shop')}
              />
            )}
          </main>

          {/* Clean Footer inside device if simulated or bottom */}
          <Footer
            onNavigate={handleNavigate}
            onOpenGA4Inspector={() => setIsInspectorOpen(true)}
          />

          {/* Mobile Bottom Tab Bar */}
          <MobileTabBar
            currentView={currentView}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
        onProceedToGooglePay={handleProceedToGooglePay}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
        initialPaymentMethod={checkoutInitialPayment}
      />

      {/* Order Confirmation with Confetti & Receipt */}
      <OrderConfirmationModal
        isOpen={isOrderModalOpen}
        order={completedOrder}
        onClose={() => setIsOrderModalOpen(false)}
        onContinueShopping={() => {
          setIsOrderModalOpen(false);
          handleNavigate('home');
        }}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
        onSelectCategory={(cat) => handleNavigate('shop', cat)}
      />

      {/* GA4 Telemetry & Evidence Inspector */}
      <GA4InspectorModal />
    </div>
  );
};

export default function App() {
  return (
    <AnalyticsProvider>
      <WishlistProvider>
        <CartProvider>
          <MainStoreContent />
        </CartProvider>
      </WishlistProvider>
    </AnalyticsProvider>
  );
}
