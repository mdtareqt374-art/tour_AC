import React, { useState, useEffect } from 'react';
import { X, Check, MapPin, Calendar, Wallet } from 'lucide-react';
import { Trip, Language } from '../types';
import { CURRENCIES } from '../constants/categories';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  initialTrip?: Trip | null;
  language: Language;
}

const COLOR_OPTIONS = [
  '#0d9488', // teal
  '#0284c7', // sky
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#64748b'  // slate
];

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTrip,
  language
}) => {
  const isBn = language === 'bn';

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('৳');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#0d9488');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialTrip) {
      setName(initialTrip.name || '');
      setDestination(initialTrip.destination || '');
      setBudget(initialTrip.budget ? initialTrip.budget.toString() : '');
      setCurrency(initialTrip.currency || '৳');
      setStartDate(initialTrip.startDate || '');
      setEndDate(initialTrip.endDate || '');
      setNotes(initialTrip.notes || '');
      setColor(initialTrip.color || '#0d9488');
    } else {
      setName('');
      setDestination('');
      setBudget('');
      setCurrency('৳');
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      setEndDate('');
      setNotes('');
      setColor(COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)]);
    }
    setErrors({});
  }, [initialTrip, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = isBn ? 'ভ্রমণ বা ট্যাবের নাম লিখুন' : 'Please enter a trip name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        name: name.trim(),
        destination: destination.trim() || name.trim(),
        budget: budget ? parseFloat(budget) || 0 : 0,
        currency,
        startDate,
        endDate,
        notes: notes.trim() || undefined,
        color
      },
      initialTrip?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {initialTrip
                ? isBn
                  ? 'ভ্রমণের তথ্য পরিবর্তন করুন'
                  : 'Edit Trip Details'
                : isBn
                ? 'নতুন ভ্রমণের ট্যাব খুলুন'
                : 'Create New Trip Tab'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'আলাদা আলাদা ভ্রমণের জন্য ভিন্ন ভিন্ন ট্যাব তৈরি হবে'
                : 'Each trip will have its dedicated tab and expense ledger'}
            </p>
          </div>
          <button
            id="btn-close-trip-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Trip Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'ভ্রমণের নাম / ট্যাবের শিরোনাম *' : 'Trip / Tab Name *'}
            </label>
            <input
              id="input-trip-name"
              type="text"
              placeholder={isBn ? 'যেমন: সাজেক ভ্যালি ২০২৬, কক্সবাজার ট্যুর' : 'e.g. Sajek Valley, Cox Bazar Tour'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.name ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'
              }`}
              autoFocus
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'গন্তব্য বা স্থান' : 'Destination / Location'}
            </label>
            <input
              id="input-trip-destination"
              type="text"
              placeholder={isBn ? 'যেমন: রাঙ্গামাটি, সেন্টমার্টিন, সিলেট' : 'e.g. Sylhet, Saint Martin'}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Budget & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'আনুমানিক বাজেট (ঐচ্ছিক)' : 'Budget (Optional)'}
              </label>
              <input
                id="input-trip-budget"
                type="number"
                placeholder="২৫০০০"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'মুদ্রা' : 'Currency'}
              </label>
              <select
                id="select-trip-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'শুরুর তারিখ' : 'Start Date'}
              </label>
              <input
                id="input-trip-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'শেষের তারিখ' : 'End Date'}
              </label>
              <input
                id="input-trip-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Tab Color Theme */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isBn ? 'ট্যাবের কালার থিম' : 'Tab Accent Color'}
            </label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-110 border-slate-800 shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Trip Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'নোট বা ভ্রমণ পরিকল্পনা (ঐচ্ছিক)' : 'Trip Notes (Optional)'}
            </label>
            <textarea
              id="textarea-trip-notes"
              rows={2}
              placeholder={isBn ? 'ভ্রমণসঙ্গী, হোটেল যোগাযোগ বা বিশেষ কোনো প্ল্যান...' : 'Notes about travel mates, itinerary...'}
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
              id="btn-submit-trip"
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>
                {initialTrip
                  ? isBn
                    ? 'পরিবর্তন সংরক্ষণ করুন'
                    : 'Save Changes'
                  : isBn
                  ? 'ট্যাব তৈরি করুন'
                  : 'Create Tab'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
