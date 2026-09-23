import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Calendar, CreditCard, User, AlignLeft, Tag, Building2, Compass } from 'lucide-react';
import { Expense, ExpenseCategory, PaymentMethod, Trip, Language } from '../types';
import { CATEGORIES, PAYMENT_METHODS } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  initialExpense?: Expense | null;
  trip: Trip;
  language: Language;
}

const COMMON_TRIP_SUGGESTIONS = [
  'বাস টিকিট',
  'ট্রেন টিকিট',
  'চাঁদের গাড়ি রিজার্ভ',
  'হোটেল / রিসোর্ট ভাড়া',
  'সকালের নাস্তা',
  'দুপুরের খাবার',
  'রাতের ডিনার',
  'চা ও হালকা নাস্তা',
  'মিনারেল ওয়াটার',
  'দর্শনীয় স্থান টিকিট',
  'বোট ভাড়া / রাইড',
  'স্যুভেনির শপিং',
  'ফার্মেসি ও ঔষধ'
];

const COMMON_INSTITUTION_SUGGESTIONS = [
  'কর্মচারী/স্টাফ বেতন',
  'অফিস/দোকান ভাড়া',
  'বিদ্যুৎ বিল',
  'ইন্টারনেট ও ডোমেইন বিল',
  'মালামাল/পণ্য স্টক ক্রয়',
  'স্টেশনারি ও খাতা-কলম',
  'আপ্যায়ন ও চা-নাশতা',
  'মেরামত ও সার্ভিসিং',
  'বিজ্ঞাপন ও ফেসবুক বুস্টিং',
  'পরিবহন ও কুরিয়ার ডেলিভারি',
  'পরিচ্ছন্নতা ও টয়লেটিজ সামগ্রী',
  'ট্যাক্স / ট্রেড লাইসেন্স ফি'
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialExpense,
  trip,
  language
}) => {
  const isBn = language === 'bn';
  const isInstitution = trip.type === 'institution' || trip.type === 'business';

  const defaultCategory: ExpenseCategory = isInstitution ? 'salary' : 'food';

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(defaultCategory);
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paidBy, setPaidBy] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialExpense) {
      setDescription(initialExpense.description || '');
      setAmount(initialExpense.amount?.toString() || '');
      setCategory(initialExpense.category || defaultCategory);
      setDate(initialExpense.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(initialExpense.paymentMethod || 'cash');
      setPaidBy(initialExpense.paidBy || '');
      setNotes(initialExpense.notes || '');
    } else {
      setDescription('');
      setAmount('');
      setCategory(defaultCategory);
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('cash');
      setPaidBy('');
      setNotes('');
    }
    setErrors({});
  }, [initialExpense, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = isBn
        ? isInstitution
          ? 'খরচের বিবরণ বা ভাউচারের নাম লিখুন'
          : 'খরচের বিবরণ বা নাম লিখুন'
        : 'Please enter description';
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
        description: description.trim(),
        amount: numAmount,
        category,
        date,
        paymentMethod,
        paidBy: paidBy.trim() || undefined,
        notes: notes.trim() || undefined
      },
      initialExpense?.id
    );
    onClose();
  };

  const suggestions = isInstitution ? COMMON_INSTITUTION_SUGGESTIONS : COMMON_TRIP_SUGGESTIONS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${isInstitution ? 'bg-sky-600 shadow-sky-200' : 'bg-teal-600 shadow-teal-200'} shadow-xs`}>
              {isInstitution ? <Building2 className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialExpense
                  ? isBn
                    ? 'খরচের তথ্য আপডেট করুন'
                    : 'Update Expense'
                  : isBn
                  ? isInstitution ? 'প্রতিষ্ঠানের খরচ যুক্ত করুন' : 'নতুন খরচ যুক্ত করুন'
                  : 'Add New Expense'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn
                  ? isInstitution ? `প্রতিষ্ঠান: ${trip.name}` : `ভ্রমণ: ${trip.name}`
                  : `Account: ${trip.name}`}
              </p>
            </div>
          </div>
          <button
            id="btn-close-expense-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn
                ? isInstitution ? 'খরচের বিবরণ / ভাউচার / খাতের নাম *' : 'খরচের বিবরণ / নাম *'
                : 'Description / Item *'}
            </label>
            <input
              id="input-expense-description"
              type="text"
              placeholder={
                isBn
                  ? isInstitution
                    ? 'যেমন: মে মাসের স্টাফ বেতন, দোকান ভাড়া, বিদ্যুৎ বিল, খাতা-কলম ক্রয়'
                    : 'যেমন: বাস টিকিট, হোটেল বুকিং, সকালের নাস্তা...'
                  : 'e.g., Staff salary, Office rent, Electricity bill...'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.description ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'
              }`}
              autoFocus
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}

            {/* Quick suggestion chips */}
            {!initialExpense && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto">
                {suggestions.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setDescription(chip)}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-transparent transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Amount & Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? `টাকার পরিমাণ (${trip.currency}) *` : `Amount (${trip.currency}) *`}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm font-bold text-slate-400">
                  {trip.currency}
                </span>
                <input
                  id="input-expense-amount"
                  type="number"
                  step="any"
                  placeholder="০.০০"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-8 pr-3.5 py-2 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.amount ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'তারিখ *' : 'Date *'}
              </label>
              <div className="relative">
                <input
                  id="input-expense-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.date ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isBn ? 'খরচের খাত বা ক্যাটাগরি *' : 'Expense Category *'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 ring-1 ring-teal-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/60'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${cat.bgClass} ${cat.colorClass} shrink-0`}>
                      <CategoryIcon category={cat.id} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold truncate">
                      {isBn ? cat.nameBn : cat.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method & Paid By in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
              </label>
              <select
                id="select-expense-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {isBn ? m.nameBn : m.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Paid by */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn
                  ? isInstitution ? 'পরিশোধকারী / ক্যাশিয়ার (ঐচ্ছিক)' : 'কে পরিশোধ করেছেন? (ঐচ্ছিক)'
                  : 'Paid By / In-charge (Optional)'}
              </label>
              <input
                id="input-expense-paid-by"
                type="text"
                placeholder={isBn ? (isInstitution ? 'যেমন: ম্যানেজার, অ্যাকাউন্টস, ক্যাশিয়ার' : 'যেমন: তারেক, আসিফ') : 'e.g. Manager, Tareq'}
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'ভাউচার নম্বর / নোট (ঐচ্ছিক)' : 'Voucher No / Notes (Optional)'}
            </label>
            <input
              id="input-expense-notes"
              type="text"
              placeholder={isBn ? 'ভাউচার নং #১০৪, দোকান বা সরবরাহকারী...' : 'Voucher #104, Supplier info...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              id="btn-submit-expense"
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>
                {initialExpense
                  ? isBn
                    ? 'আপডেট করুন'
                    : 'Update Expense'
                  : isBn
                  ? 'সংরক্ষণ করুন'
                  : 'Save Expense'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
