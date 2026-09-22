import React from 'react';
import { PieChart, Filter } from 'lucide-react';
import { Expense, Trip, Language } from '../types';
import { CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';

interface CategoryBreakdownProps {
  trip: Trip;
  expenses: Expense[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  language: Language;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  trip,
  expenses,
  selectedCategory,
  onSelectCategory,
  language
}) => {
  const isBn = language === 'bn';

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Calculate totals per category
  const categoryStats = CATEGORIES.map((cat) => {
    const catExpenses = expenses.filter((e) => e.category === cat.id);
    const amount = catExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const count = catExpenses.length;
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
    return {
      ...cat,
      amount,
      count,
      percentage
    };
  }).filter((c) => c.amount > 0 || selectedCategory === c.id);

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            {isBn ? 'ক্যাটাগরিভিত্তিক খরচের বিশ্লেষণ' : 'Category-wise Breakdown'}
          </h3>
        </div>

        {selectedCategory !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
          >
            {isBn ? 'সব ক্যাটাগরি দেখুন (Reset)' : 'Show All'}
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categoryStats.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 shadow-xs ring-1 ring-teal-500'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${cat.bgClass} ${cat.colorClass}`}>
                    <CategoryIcon category={cat.id} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {isBn ? cat.nameBn : cat.nameEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {cat.count} {isBn ? 'টি এন্ট্রি' : 'items'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {cat.percentage}%
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-baseline justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-900 dark:text-white font-bold">
                    {trip.currency} {cat.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-300"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
