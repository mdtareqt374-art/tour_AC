import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  MapPin,
  Calendar,
  Wallet,
  Building2,
  Briefcase,
  Compass,
  Store,
  GraduationCap,
  Users,
  Building,
  Landmark
} from 'lucide-react';
import { Trip, Language, AccountType } from '../types';
import { CURRENCIES } from '../constants/categories';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  initialTrip?: Trip | null;
  defaultTabType?: AccountType;
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

export const INSTITUTION_TYPES = [
  { id: 'office', nameBn: 'অফিস / বাণিজ্যিক প্রতিষ্ঠান', nameEn: 'Office / Corporate' },
  { id: 'shop', nameBn: 'দোকান / রিটেল শপ / শোরুম', nameEn: 'Shop / Retail Store' },
  { id: 'school', nameBn: 'মাদ্রাসা / স্কুল / একাডেমি', nameEn: 'Madrasa / School' },
  { id: 'club_ngo', nameBn: 'সমিতি / ক্লাব / এনজিও / সমাজকল্যাণ', nameEn: 'Club / Society / NGO' },
  { id: 'religious', nameBn: 'মসজিদ / ধর্মীয় ও সেবামূলক প্রতিষ্ঠান', nameEn: 'Mosque / Religious Center' },
  { id: 'factory', nameBn: 'কারখানা / ওয়ার্কশপ / খামার', nameEn: 'Factory / Workshop / Farm' },
  { id: 'other', nameBn: 'অন্যান্য প্রতিষ্ঠান', nameEn: 'Other Institution' },
];

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTrip,
  defaultTabType = 'institution',
  language
}) => {
  const isBn = language === 'bn';

  const [accountType, setAccountType] = useState<AccountType>(defaultTabType);
  const [institutionType, setInstitutionType] = useState('office');
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
      setAccountType(initialTrip.type || 'trip');
      setInstitutionType(initialTrip.institutionType || 'office');
      setName(initialTrip.name || '');
      setDestination(initialTrip.destination || '');
      setBudget(initialTrip.budget ? initialTrip.budget.toString() : '');
      setCurrency(initialTrip.currency || '৳');
      setStartDate(initialTrip.startDate || '');
      setEndDate(initialTrip.endDate || '');
      setNotes(initialTrip.notes || '');
      setColor(initialTrip.color || '#0d9488');
    } else {
      setAccountType(defaultTabType);
      setInstitutionType('office');
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
  }, [initialTrip, isOpen, defaultTabType]);

  if (!isOpen) return null;

  const isInstitution = accountType === 'institution' || accountType === 'business';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = isInstitution
        ? isBn
          ? 'প্রতিষ্ঠানের নাম লিখুন'
          : 'Please enter institution name'
        : isBn
        ? 'ভ্রমণের নাম লিখুন'
        : 'Please enter trip name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        name: name.trim(),
        destination: destination.trim() || (isInstitution ? (isBn ? 'প্রধান শাখা' : 'Main Branch') : name.trim()),
        budget: budget ? parseFloat(budget) || 0 : 0,
        currency,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || '',
        notes: notes.trim() || undefined,
        color,
        type: accountType,
        institutionType: isInstitution ? institutionType : undefined
      },
      initialTrip?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {isInstitution ? (
                <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              ) : (
                <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              )}
              <span>
                {initialTrip
                  ? isBn
                    ? isInstitution ? 'প্রতিষ্ঠানের তথ্য পরিবর্তন' : 'ভ্রমণের তথ্য পরিবর্তন'
                    : isInstitution ? 'Edit Institution Info' : 'Edit Trip Details'
                  : isBn
                  ? isInstitution ? 'নতুন প্রতিষ্ঠানের হিসাব খাতা (ট্যাব)' : 'নতুন ভ্রমণের ট্যাব খুলুন'
                  : isInstitution ? 'Create Institution Account Tab' : 'Create New Trip Tab'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'প্রতিটি প্রতিষ্ঠান বা ভ্রমণের জন্য আলাদা আয়-ব্যয়ের হিসাব তৈরি হবে'
                : 'Manage dedicated ledger tabs for institutions, businesses, or travel'}
            </p>
          </div>
          <button
            id="btn-close-trip-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Account Type Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isBn ? 'ট্যাবের ধরন নির্বাচন করুন *' : 'Select Account / Tab Type *'}
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                id="btn-type-institution"
                onClick={() => setAccountType('institution')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  accountType === 'institution'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'প্রতিষ্ঠান' : 'Institution'}</span>
              </button>

              <button
                type="button"
                id="btn-type-business"
                onClick={() => setAccountType('business')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  accountType === 'business'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{isBn ? 'দোকান/ব্যবসা' : 'Business/Shop'}</span>
              </button>

              <button
                type="button"
                id="btn-type-trip"
                onClick={() => setAccountType('trip')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  accountType === 'trip'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{isBn ? 'ভ্রমণ/ট্যুর' : 'Trip/Tour'}</span>
              </button>
            </div>
          </div>

          {/* Institution Category / Type dropdown if institution or business */}
          {isInstitution && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'প্রতিষ্ঠানের ক্যাটাগরি বা ধরন' : 'Institution Category / Type'}
              </label>
              <select
                id="select-institution-category"
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                {INSTITUTION_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {isBn ? t.nameBn : t.nameEn}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isInstitution
                ? isBn
                  ? 'প্রতিষ্ঠানের নাম / হিসাবের শিরোনাম *'
                  : 'Organization / Institution Name *'
                : isBn
                ? 'ভ্রমণের নাম / শিরোনাম *'
                : 'Trip Name *'}
            </label>
            <input
              id="input-trip-name"
              type="text"
              placeholder={
                isInstitution
                  ? isBn
                    ? 'যেমন: আল-আমীন ট্রেডার্স, আল-হেরা মাদ্রাসা, গ্রীনভিউ সমিতি, আইটি হাব'
                    : 'e.g. Al-Ameen Traders, Metro Clinic, Green Club'
                  : isBn
                  ? 'যেমন: সাজেক ভ্যালি ২০২৬, কক্সবাজার ট্যুর'
                  : 'e.g. Sajek Valley 2026, Cox Bazar Tour'
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.name ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'
              }`}
              autoFocus
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Destination / Address / Branch */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isInstitution
                ? isBn
                  ? 'ঠিকানা / শাখা / অবস্থান'
                  : 'Address / Branch / Location'
                : isBn
                ? 'গন্তব্য বা পর্যটন স্থান'
                : 'Destination / Place'}
            </label>
            <input
              id="input-trip-destination"
              type="text"
              placeholder={
                isInstitution
                  ? isBn
                    ? 'যেমন: মিরপুর-১০, ঢাকা অথবা দোকান নং-৪, নিউমার্কেট'
                    : 'e.g. Mirpur-10, Dhaka or Shop #4, City Center'
                  : isBn
                  ? 'যেমন: রাঙ্গামাটি, সেন্টমার্টিন, সিলেট'
                  : 'e.g. Sylhet, Saint Martin'
              }
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Budget / Initial Working Capital & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isInstitution
                  ? isBn
                    ? 'প্রারম্ভিক মূলধন / বাজেট (ঐচ্ছিক)'
                    : 'Starting Capital / Budget'
                  : isBn
                  ? 'আনুমানিক বাজেট (ঐচ্ছিক)'
                  : 'Budget (Optional)'}
              </label>
              <input
                id="input-trip-budget"
                type="number"
                placeholder={isInstitution ? '৫০০০০' : '২৫০০০'}
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
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
                {isInstitution
                  ? isBn
                    ? 'হিসাব শুরুর তারিখ'
                    : 'Fiscal Start Date'
                  : isBn
                  ? 'শুরুর তারিখ'
                  : 'Start Date'}
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
                {isInstitution
                  ? isBn
                    ? 'সমাপনী মেয়াদ (ঐচ্ছিক)'
                    : 'Fiscal End Date (Optional)'
                  : isBn
                  ? 'শেষের তারিখ'
                  : 'End Date'}
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
                    color === c ? 'scale-110 border-slate-800 dark:border-white shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Notes / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isInstitution
                ? isBn
                  ? 'প্রতিষ্ঠানের নোট বা বিবরণ (ঐচ্ছিক)'
                  : 'Institution Notes / Details (Optional)'
                : isBn
                ? 'নোট বা ভ্রমণ পরিকল্পনা (ঐচ্ছিক)'
                : 'Trip Notes (Optional)'}
            </label>
            <textarea
              id="textarea-trip-notes"
              rows={2}
              placeholder={
                isInstitution
                  ? isBn
                    ? 'ব্যাংক হিসাব নম্বর, প্রোপাইটর/পরিচালক বা প্রয়োজনীয় বিবরণ...'
                    : 'Bank account number, owner contact or description...'
                  : isBn
                  ? 'ভ্রমণসঙ্গী, হোটেল যোগাযোগ বা বিশেষ কোনো প্ল্যান...'
                  : 'Notes about travel mates, itinerary...'
              }
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
                  ? isInstitution ? 'প্রতিষ্ঠান ট্যাব খুলুন' : 'ভ্রমণ ট্যাব খুলুন'
                  : 'Create Tab'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
