import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Calendar, CreditCard, User, AlignLeft, PiggyBank, Plus } from 'lucide-react';
import { Income, IncomeSource, PaymentMethod, Trip, Language } from '../types';
import { PAYMENT_METHODS, INCOME_SOURCES } from '../constants/categories';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (incomeData: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  initialIncome?: Income | null;
  trip: Trip;
  language: Language;
}

const COMMON_INCOME_SUGGESTIONS = [
  'সদস্যদের চাঁদা সংগ্রহ',
  'অতিরিক্ত বাজেট বৃদ্ধি',
  'জরুরি ব্যাকআপ ফান্ড',
  'প্রাথমিক ট্যুর ফান্ড জমা',
  'স্পনসর / উপহার',
  'হোটেল / বুকিং রিফান্ড',
  'ব্যক্তিগত কন্ট্রিবিউশন'
];

export const IncomeModal: React.FC<IncomeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialIncome,
  trip,
  language
}) => {
  const isBn = language === 'bn';

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<IncomeSource>('contribution');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [contributor, setContributor] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialIncome) {
      setTitle(initialIncome.title || '');
      setAmount(initialIncome.amount?.toString() || '');
      setSource(initialIncome.source || 'contribution');
      setDate(initialIncome.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(initialIncome.paymentMethod || 'cash');
      setContributor(initialIncome.contributor || '');
      setNotes(initialIncome.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setSource('contribution');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('cash');
      setContributor('');
      setNotes('');
    }
    setErrors({});
  }, [initialIncome, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = isBn ? 'আয় বা ফান্ডের নাম/বিবরণ লিখুন' : 'Please enter income title';
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = isBn ? 'সঠিক টাকার পরিমাণ উল্লেখ করুন' : 'Please enter a valid amount';
    }

    if (!date) {
      newErrors.date = isBn ? 'তারিখ নির্বাচন করুন' : 'Please select a date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        tripId: trip.id,
        title: title.trim(),
        amount: numAmount,
        source,
        date,
        paymentMethod,
        contributor: contributor.trim() || undefined,
        notes: notes.trim() || undefined
      },
      initialIncome ? initialIncome.id : undefined
    );

    onClose();
  };

  const addQuickAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {initialIncome
                  ? (isBn ? 'আয় / ফান্ড সংশোধন করুন' : 'Edit Income Entry')
                  : (isBn ? 'নতুন আয় বা বাজেট ফান্ড যোগ করুন' : 'Add Income / Fund Top-up')}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? `${trip.name} ভ্রমণের জন্য চাঁদা বা ফান্ড বৃদ্ধি` : `For ${trip.name}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick Suggestions */}
          {!initialIncome && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                {isBn ? '💡 দ্রুত নির্বাচন করুন (Suggestions)' : 'Quick Suggestions'}
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {COMMON_INCOME_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setTitle(sug);
                      if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'আয় / ফান্ডের নাম বা উৎস *' : 'Title / Source Description *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder={isBn ? 'উদা: সদস্যদের চাঁদা বা অতিরিক্ত বাজেট ফান্ড' : 'e.g., Member Contribution, Extra Budget'}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-950 focus:outline-hidden focus:ring-2 transition-all ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20 focus:border-emerald-600'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Amount & Quick Add Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isBn ? 'টাকার পরিমাণ *' : 'Amount *'}
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {trip.currency}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                {trip.currency}
              </div>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                }}
                placeholder="0"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-base font-bold bg-white dark:bg-slate-950 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.amount
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20 focus:border-emerald-600 text-emerald-700 dark:text-emerald-400'
                }`}
              />
            </div>
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              {[500, 1000, 2000, 5000, 10000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => addQuickAmount(val)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Income Source Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isBn ? 'আয়ের ধরণ / উৎস ক্যাটাগরি *' : 'Income Category *'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INCOME_SOURCES.map((s) => {
                const isSelected = source === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSource(s.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs font-medium flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{isBn ? s.nameBn : s.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'তারিখ *' : 'Date *'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white dark:bg-slate-950 focus:outline-hidden focus:ring-2 transition-all ${
                    errors.date
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20 focus:border-emerald-600'
                  }`}
                />
              </div>
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'পেমেন্ট মাধ্যম *' : 'Payment Method *'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {isBn ? pm.nameBn : pm.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contributor / Depositor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'প্রদানকারী / কার কাছ থেকে প্রাপ্ত (ঐচ্ছিক)' : 'Contributor / Received From (Optional)'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={contributor}
                onChange={(e) => setContributor(e.target.value)}
                placeholder={isBn ? 'উদা: তারেক, আসিফ, বা সদস্যবৃন্দ' : 'e.g., Tareq, Asif, Group Fund'}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'অতিরিক্ত মন্তব্য বা নোট (ঐচ্ছিক)' : 'Additional Notes (Optional)'}
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                <AlignLeft className="w-4 h-4" />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={isBn ? 'ট্রানজ্যাকশন আইডি, রেফারেন্স বা যেকোনো তথ্য...' : 'Transaction ID, references...'}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>
                {initialIncome
                  ? (isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')
                  : (isBn ? 'আয় সংরক্ষণ করুন' : 'Save Income')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
