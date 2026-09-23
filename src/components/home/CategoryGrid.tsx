import React from 'react';
import { ArrowRight, Shirt, Coffee, Box, Glasses } from 'lucide-react';
import apparelImg from '../../assets/images/category_apparel_lifestyle_1790190974999.jpg';
import tumblerImg from '../../assets/images/product_spectra_tumbler_1790190919688.jpg';
import dinoImg from '../../assets/images/product_chrome_dino_plush_1790190961252.jpg';
import heroRetroImg from '../../assets/images/hero_1998_retro_hoodie_1790190889981.jpg';

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'apparel',
      title: 'Apparel & Fleeces',
      count: '4 styles',
      image: apparelImg,
      icon: Shirt,
    },
    {
      id: 'drinkware',
      title: 'Drinkware & Tumblers',
      count: '2 styles',
      image: tumblerImg,
      icon: Coffee,
    },
    {
      id: 'collectibles',
      title: 'Dino & Collectibles',
      count: '3 styles',
      image: dinoImg,
      icon: Box,
    },
    {
      id: 'accessories',
      title: 'Commuter Accessories',
      count: '2 styles',
      image: heroRetroImg,
      icon: Glasses,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Curated Categories
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Shop by Department
          </h2>
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
        >
          <span>View All Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-square w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-[11px] font-mono text-slate-200">{cat.count}</div>
                  <h3 className="text-sm sm:text-base font-bold leading-tight">{cat.title}</h3>
                </div>
              </div>

              <div className="p-3 bg-white flex items-center justify-between text-xs font-medium text-slate-700 group-hover:text-blue-600">
                <span className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span>Explore category</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
