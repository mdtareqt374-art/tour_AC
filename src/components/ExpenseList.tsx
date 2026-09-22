import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit3,
  Trash2,
  Calendar,
  CreditCard,
  User,
  Plus,
  Receipt,
  FileText
} from 'lucide-react';
import { Expense, Trip, Language, ExpenseCategory } from '../types';
import { CATEGORIES, getCategoryMeta, PAYMENT_METHODS } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseListProps {
  trip: Trip;
  expenses: Expense[];
  onOpenAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  language: Language;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  trip,
  expenses,
  onOpenAddExpense,
  onEditExpense,
  onDeleteExpense,
  selectedCategory,
  onSelectCategory,
  language
}) => {
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered & Sorted items
  const filteredExpenses = expenses.filter((e) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const descMatch = (e.description || '').toLowerCase().includes(q);
      const paidByMatch = (e.paidBy || '').toLowerCase().includes(q);
      const notesMatch = (e.notes || '').toLowerCase().includes(q);
      if (!descMatch && !paidByMatch && !notesMatch) {
        return false;
      }
    }
    // Category match
    if (selectedCategory !== 'all' && e.category !== selectedCategory) {
      return false;
    }
    // Payment method match
    if (selectedMethod !== 'all' && e.paymentMethod !== selectedMethod) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'amount-desc') {
      return b.amount - a.amount;
    }
    if (sortBy === 'amount-asc') {
      return a.amount - b.amount;
    }
    return 0;
  });

  const subtotalFiltered = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isBn ? 'খরচের বিস্তারিত তালিকা' : 'Expense Entries'}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                {filteredExpenses.length} / {expenses.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'প্রতিটি খরচের হিসাব এডিট, আপডেট বা ডিলিট করতে পারবেন'
                : 'Manage, edit or remove any expense record'}
            </p>
          </div>

          <button
            id="btn-add-expense-list-top"
            type="button"
            onClick={onOpenAddExpense}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন খরচ যোগ করুন' : 'Add Expense'}</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-expense-search"
              type="text"
              placeholder={isBn ? 'খরচের নাম, ব্যক্তি বা নোট খুঁজুন...' : 'Search expenses...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              id="select-category-filter"
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">{isBn ? 'সব ক্যাটাগরি (All)' : 'All Categories'}</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {isBn ? c.nameBn : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <select
              id="select-method-filter"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">{isBn ? 'সব পেমেন্ট মাধ্যম' : 'All Payment Methods'}</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {isBn ? m.nameBn : m.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              id="select-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="date-desc">{isBn ? 'তারিখ: নতুন থেকে পুরাতন' : 'Date: Newest first'}</option>
              <option value="date-asc">{isBn ? 'তারিখ: পুরাতন থেকে নতুন' : 'Date: Oldest first'}</option>
              <option value="amount-desc">{isBn ? 'পরিমাণ: সর্বোচ্চ খরচ' : 'Amount: Highest first'}</option>
              <option value="amount-asc">{isBn ? 'পরিমাণ: সর্বনিম্ন খরচ' : 'Amount: Lowest first'}</option>
            </select>
          </div>
        </div>

        {/* Filter Subtotal note */}
        {(selectedCategory !== 'all' || searchQuery || selectedMethod !== 'all') && (
          <div className="flex items-center justify-between text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200">
            <span>{isBn ? 'ফিল্টারকৃত মোট খরচ:' : 'Filtered Subtotal:'}</span>
            <span className="font-bold">
              {trip.currency} {subtotalFiltered.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Expense Items List */}
      {filteredExpenses.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {expenses.length === 0
              ? isBn
                ? 'এই ভ্রমণে এখনও কোনো খরচ যোগ করা হয়নি'
                : 'No expenses added for this trip yet'
              : isBn
              ? 'ফিল্টারের সাথে কোনো খরচ মিলছে না'
              : 'No matching expenses found'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {expenses.length === 0
              ? isBn
                ? 'বাস টিকিট, হোটেল ভাড়া, রেস্তোরাঁর বিল বা যে কোনো খরচ যুক্ত করুন।'
                : 'Start tracking transportation, stay, dining, and other trip costs.'
              : isBn
              ? 'অনুসন্ধানের শব্দ পরিবর্তন করুন অথবা ফিল্টার রিসেট করুন।'
              : 'Try clearing your search query or reset filters.'}
          </p>
          {expenses.length === 0 ? (
            <button
              id="btn-add-expense-empty"
              type="button"
              onClick={onOpenAddExpense}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ প্রথম খরচ যোগ করুন' : '+ Add First Expense'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
                setSelectedMethod('all');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-teal-600 hover:bg-slate-50"
            >
              <span>{isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredExpenses.map((exp) => {
            const meta = getCategoryMeta(exp.category);
            const methodObj = PAYMENT_METHODS.find((m) => m.id === exp.paymentMethod);
            const isConfirmingDelete = deleteConfirmId === exp.id;

            return (
              <div
                key={exp.id}
                id={`expense-row-${exp.id}`}
                className="p-4 sm:px-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${meta.bgClass} ${meta.colorClass} border ${meta.borderClass}`}
                  >
                    <CategoryIcon category={exp.category} className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {exp.description}
                      </h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${meta.badgeClass}`}>
                        {isBn ? meta.nameBn : meta.nameEn}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {exp.date}
                      </span>

                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        {isBn ? methodObj?.nameBn || exp.paymentMethod : methodObj?.nameEn || exp.paymentMethod}
                      </span>

                      {exp.paidBy && (
                        <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-medium">
                          <User className="w-3 h-3" />
                          {isBn ? `পরিশোধ: ${exp.paidBy}` : `By: ${exp.paidBy}`}
                        </span>
                      )}
                    </div>

                    {exp.notes && (
                      <p className="text-xs text-slate-500 italic max-w-xl">
                        "{exp.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {trip.currency} {exp.amount.toLocaleString()}
                    </span>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1">
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                        <span className="text-[11px] font-bold text-red-700 px-1">
                          {isBn ? 'মুছবেন?' : 'Sure?'}
                        </span>
                        <button
                          id={`btn-confirm-delete-${exp.id}`}
                          type="button"
                          onClick={() => {
                            onDeleteExpense(exp.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold hover:bg-red-700"
                        >
                          {isBn ? 'হ্যাঁ' : 'Yes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] hover:bg-slate-300"
                        >
                          {isBn ? 'না' : 'No'}
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          id={`btn-edit-expense-${exp.id}`}
                          type="button"
                          onClick={() => onEditExpense(exp)}
                          className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title={isBn ? 'খরচের তথ্য এডিট করুন' : 'Edit Expense'}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-expense-${exp.id}`}
                          type="button"
                          onClick={() => setDeleteConfirmId(exp.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          title={isBn ? 'খরচ মুছে ফেলুন' : 'Delete Expense'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
