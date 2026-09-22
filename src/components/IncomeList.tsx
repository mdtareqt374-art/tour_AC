import React, { useState } from 'react';
import {
  Search,
  Plus,
  PiggyBank,
  Edit3,
  Trash2,
  Calendar,
  CreditCard,
  User,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { Income, Trip, Language, IncomeSource } from '../types';
import { INCOME_SOURCES, getIncomeSourceMeta, PAYMENT_METHODS } from '../constants/categories';

interface IncomeListProps {
  trip: Trip;
  incomes: Income[];
  onOpenAddIncome: () => void;
  onEditIncome: (income: Income) => void;
  onDeleteIncome: (incomeId: string) => void;
  language: Language;
}

export const IncomeList: React.FC<IncomeListProps> = ({
  trip,
  incomes,
  onOpenAddIncome,
  onEditIncome,
  onDeleteIncome,
  language
}) => {
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter & Sort
  const filteredIncomes = incomes.filter((inc) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (inc.title || '').toLowerCase().includes(q);
      const contribMatch = (inc.contributor || '').toLowerCase().includes(q);
      const notesMatch = (inc.notes || '').toLowerCase().includes(q);
      if (!titleMatch && !contribMatch && !notesMatch) return false;
    }
    if (selectedSource !== 'all' && inc.source !== selectedSource) return false;
    if (selectedMethod !== 'all' && inc.paymentMethod !== selectedMethod) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  const totalFilteredAmount = filteredIncomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isBn ? 'আয় ও ফান্ড সংগ্রহের তালিকা' : 'Income & Funds Log'}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                {filteredIncomes.length} / {incomes.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? 'সদস্যদের চাঁদা, ব্যক্তিগত জমা বা যেকোনো অতিরিক্ত ফান্ড বৃদ্ধি'
                : 'Member contributions, savings, sponsors, or budget top-ups'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAddIncome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ আয় / ফান্ড যোগ করুন' : '+ Add Income / Fund'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
          {/* Search */}
          <div className="sm:col-span-1 md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'আয়ের বিবরণ, নাম বা দাতা দিয়ে খুঁজুন...' : 'Search by title, contributor...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="all">{isBn ? 'সকল আয়ের উৎস' : 'All Sources'}</option>
              {INCOME_SOURCES.map((s) => (
                <option key={s.id} value={s.id}>
                  {isBn ? s.nameBn : s.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="date-desc">{isBn ? 'তারিখ: নতুন থেকে পুরাতন' : 'Date: Newest'}</option>
              <option value="date-asc">{isBn ? 'তারিখ: পুরাতন থেকে নতুন' : 'Date: Oldest'}</option>
              <option value="amount-desc">{isBn ? 'টাকা: বেশি থেকে কম' : 'Amount: High to Low'}</option>
              <option value="amount-asc">{isBn ? 'টাকা: কম থেকে বেশি' : 'Amount: Low to High'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incomes Table / List */}
      {filteredIncomes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4 w-28">{isBn ? 'তারিখ' : 'Date'}</th>
                <th className="py-3 px-4">{isBn ? 'আয় / ফান্ডের নাম' : 'Title'}</th>
                <th className="py-3 px-4 w-40">{isBn ? 'উৎস ক্যাটাগরি' : 'Source'}</th>
                <th className="py-3 px-4 w-32">{isBn ? 'মাধ্যম' : 'Method'}</th>
                <th className="py-3 px-4 w-32">{isBn ? 'প্রদানকারী' : 'Contributor'}</th>
                <th className="py-3 px-4 text-right w-28">{isBn ? 'টাকা' : 'Amount'}</th>
                <th className="py-3 px-4 text-center w-24">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIncomes.map((inc) => {
                const sourceMeta = getIncomeSourceMeta(inc.source);
                const methodMeta = PAYMENT_METHODS.find((m) => m.id === inc.paymentMethod);
                const methodName = isBn ? (methodMeta?.nameBn || inc.paymentMethod) : (methodMeta?.nameEn || inc.paymentMethod);

                return (
                  <tr
                    key={inc.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap font-mono">
                      {inc.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {inc.title}
                      </div>
                      {inc.notes && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                          {inc.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md ${sourceMeta.badgeClass}`}>
                        {isBn ? sourceMeta.nameBn : sourceMeta.nameEn}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">
                      {methodName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">
                      {inc.contributor ? (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {inc.contributor}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                      +{trip.currency} {inc.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditIncome(inc)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          title={isBn ? 'এডিট করুন' : 'Edit'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {deleteConfirmId === inc.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteIncome(inc.id);
                                setDeleteConfirmId(null);
                              }}
                              className="text-[10px] px-2 py-1 rounded-md bg-red-600 text-white font-bold hover:bg-red-700"
                            >
                              {isBn ? 'হ্যাঁ' : 'Yes'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-[10px] px-1.5 py-1 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(inc.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-950/60 font-bold border-t border-slate-200 dark:border-slate-800">
                <td colSpan={5} className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  {isBn ? 'মোট ফিল্টারকৃত আয় / ফান্ড:' : 'Total Filtered Income:'}
                </td>
                <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold text-sm sm:text-base whitespace-nowrap">
                  +{trip.currency} {totalFilteredAmount.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <PiggyBank className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            {incomes.length === 0
              ? (isBn ? 'এখনও কোনো আয় বা চাঁদা যুক্ত করা হয়নি' : 'No income or fund entries yet')
              : (isBn ? 'অনুসন্ধানে কোনো ফলাফল পাওয়া যায়নি' : 'No matching entries found')}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {incomes.length === 0
              ? (isBn
                  ? 'সদস্যদের চাঁদা বা অতিরিক্ত বাজেট ফান্ড যুক্ত করে আপনার ট্যুরের আর্থিক তহবিল সমৃদ্ধ রাখুন।'
                  : 'Start by recording member contributions, personal savings, or extra budget.')
              : (isBn ? 'সার্চ বা ফিল্টার পরিবর্তন করে দেখুন।' : 'Try adjusting your filters.')}
          </p>
          {incomes.length === 0 && (
            <button
              type="button"
              onClick={onOpenAddIncome}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'প্রথম আয় / ফান্ড যোগ করুন' : 'Add First Income Entry'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
