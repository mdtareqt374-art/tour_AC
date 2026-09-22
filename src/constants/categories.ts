import { CategoryMeta, ExpenseCategory, PaymentMethod } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'transport',
    nameBn: 'যাতায়াত ও ভ্রমণ',
    nameEn: 'Transport & Travel',
    iconName: 'Bus',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    borderClass: 'border-blue-200 dark:border-blue-800',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
  },
  {
    id: 'accommodation',
    nameBn: 'হোটেল ও রিসোর্ট',
    nameEn: 'Hotel & Stay',
    iconName: 'Hotel',
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderClass: 'border-indigo-200 dark:border-indigo-800',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200'
  },
  {
    id: 'food',
    nameBn: 'খাবার ও রেস্তোরাঁ',
    nameEn: 'Food & Dining',
    iconName: 'Utensils',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
  },
  {
    id: 'sightseeing',
    nameBn: 'দর্শনীয় স্থান ও টিকিট',
    nameEn: 'Sightseeing & Tickets',
    iconName: 'Ticket',
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
  },
  {
    id: 'activities',
    nameBn: 'অ্যাক্টিভিটি ও খেলাধুলা',
    nameEn: 'Activities & Rides',
    iconName: 'Compass',
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    borderClass: 'border-purple-200 dark:border-purple-800',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
  },
  {
    id: 'shopping',
    nameBn: 'শপিং ও স্যুভেনির',
    nameEn: 'Shopping & Souvenirs',
    iconName: 'ShoppingBag',
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    borderClass: 'border-rose-200 dark:border-rose-800',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
  },
  {
    id: 'medical',
    nameBn: 'জরুরি ও চিকিৎসা',
    nameEn: 'Medical & Emergency',
    iconName: 'FirstAid',
    colorClass: 'text-red-600 dark:text-red-400',
    bgClass: 'bg-red-50 dark:bg-red-950/40',
    borderClass: 'border-red-200 dark:border-red-800',
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
  },
  {
    id: 'other',
    nameBn: 'অন্যান্য খরচ',
    nameEn: 'Miscellaneous / Other',
    iconName: 'MoreHorizontal',
    colorClass: 'text-slate-600 dark:text-slate-400',
    bgClass: 'bg-slate-100 dark:bg-slate-800',
    borderClass: 'border-slate-200 dark:border-slate-700',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
  }
];

export const PAYMENT_METHODS: { id: PaymentMethod; nameBn: string; nameEn: string }[] = [
  { id: 'cash', nameBn: 'নগদ / ক্যাশ (Cash)', nameEn: 'Cash' },
  { id: 'bkash', nameBn: 'বিকাশ (bKash)', nameEn: 'bKash' },
  { id: 'nagad', nameBn: 'নগদ (Nagad)', nameEn: 'Nagad' },
  { id: 'card', nameBn: 'ডেবিট/ক্রেডিট কার্ড (Card)', nameEn: 'Debit/Credit Card' },
  { id: 'bank', nameBn: 'ব্যাংক ট্রান্সফার (Bank)', nameEn: 'Bank Transfer' },
  { id: 'other', nameBn: 'অন্যান্য মাধ্যম', nameEn: 'Other' }
];

export const CURRENCIES = [
  { code: '৳', name: 'BDT (টাকা)' },
  { code: '$', name: 'USD ($)' },
  { code: '€', name: 'EUR (€)' },
  { code: '₹', name: 'INR (রুপি)' },
  { code: '£', name: 'GBP (£)' },
  { code: 'SR', name: 'SAR (রিয়াল)' },
  { code: 'AED', name: 'AED (দিরহাম)' }
];

export const INCOME_SOURCES: {
  id: import('../types').IncomeSource;
  nameBn: string;
  nameEn: string;
  badgeClass: string;
}[] = [
  {
    id: 'contribution',
    nameBn: 'সদস্যদের চাঁদা / অংশীদারি',
    nameEn: 'Member Contribution',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
  },
  {
    id: 'budget_increase',
    nameBn: 'অতিরিক্ত বাজেট বৃদ্ধি',
    nameEn: 'Budget Top-up / Increase',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
  },
  {
    id: 'savings',
    nameBn: 'গ্রুপ বা ব্যক্তিগত ফান্ড',
    nameEn: 'Personal / Group Fund',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200'
  },
  {
    id: 'sponsor',
    nameBn: 'স্পনসর / উপহার',
    nameEn: 'Sponsor / Gift',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
  },
  {
    id: 'refund',
    nameBn: 'ফেরত বা রিফান্ড',
    nameEn: 'Refund / Rebate',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
  },
  {
    id: 'other',
    nameBn: 'অন্যান্য আয়',
    nameEn: 'Other Income',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
  }
];

export function getIncomeSourceMeta(sourceId: import('../types').IncomeSource) {
  const found = INCOME_SOURCES.find(s => s.id === sourceId);
  return found || INCOME_SOURCES[0];
}

export function getCategoryMeta(categoryId: ExpenseCategory): CategoryMeta {
  const found = CATEGORIES.find(c => c.id === categoryId);
  return found || CATEGORIES[CATEGORIES.length - 1];
}
