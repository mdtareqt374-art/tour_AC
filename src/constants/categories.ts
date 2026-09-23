import { CategoryMeta, ExpenseCategory, PaymentMethod } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  // Institutional / Business Categories
  {
    id: 'salary',
    nameBn: 'বেতন ও স্টাফ সম্মানী',
    nameEn: 'Salary & Staff Wages',
    iconName: 'Briefcase',
    colorClass: 'text-sky-600 dark:text-sky-400',
    bgClass: 'bg-sky-50 dark:bg-sky-950/40',
    borderClass: 'border-sky-200 dark:border-sky-800',
    badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
  },
  {
    id: 'rent_utility',
    nameBn: 'ভাড়া, বিদ্যুৎ ও বিল',
    nameEn: 'Rent & Utilities',
    iconName: 'Building2',
    colorClass: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-50 dark:bg-violet-950/40',
    borderClass: 'border-violet-200 dark:border-violet-800',
    badgeClass: 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200'
  },
  {
    id: 'inventory',
    nameBn: 'মালামাল ও স্টক ক্রয়',
    nameEn: 'Inventory & Purchases',
    iconName: 'Package',
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    bgClass: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderClass: 'border-cyan-200 dark:border-cyan-800',
    badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200'
  },
  {
    id: 'office_supplies',
    nameBn: 'অফিস ও স্টেশনারি',
    nameEn: 'Office & Stationery',
    iconName: 'FileText',
    colorClass: 'text-teal-600 dark:text-teal-400',
    bgClass: 'bg-teal-50 dark:bg-teal-950/40',
    borderClass: 'border-teal-200 dark:border-teal-800',
    badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200'
  },
  {
    id: 'maintenance',
    nameBn: 'মেরামত ও সার্ভিসিং',
    nameEn: 'Maintenance & Repairs',
    iconName: 'Wrench',
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
  },
  {
    id: 'marketing',
    nameBn: 'বিজ্ঞাপন ও প্রচার',
    nameEn: 'Marketing & Ads',
    iconName: 'Megaphone',
    colorClass: 'text-fuchsia-600 dark:text-fuchsia-400',
    bgClass: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    borderClass: 'border-fuchsia-200 dark:border-fuchsia-800',
    badgeClass: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/60 dark:text-fuchsia-200'
  },
  {
    id: 'entertainment',
    nameBn: 'আপ্যায়ন ও চা-নাশতা',
    nameEn: 'Refreshments & Tea',
    iconName: 'Coffee',
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-50 dark:bg-orange-950/40',
    borderClass: 'border-orange-200 dark:border-orange-800',
    badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200'
  },

  // Travel & General Categories
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
  // Institutional Incomes
  {
    id: 'sales',
    nameBn: 'পণ্য বা সেবা বিক্রয় (Sales)',
    nameEn: 'Sales & Revenue',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
  },
  {
    id: 'service_fee',
    nameBn: 'ফি / সার্ভিস চার্জ / বিলিং',
    nameEn: 'Fees & Service Charge',
    badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200'
  },
  {
    id: 'contribution',
    nameBn: 'সদস্যদের চাঁদা / অংশীদারি',
    nameEn: 'Member Contribution',
    badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200'
  },
  {
    id: 'investment',
    nameBn: 'মূলধন বা ব্যবসায়িক বিনিয়োগ',
    nameEn: 'Capital & Investment',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
  },
  {
    id: 'donation',
    nameBn: 'অনুদান, জাকাত বা সহায়তা',
    nameEn: 'Donation & Grants',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
  },
  {
    id: 'budget_increase',
    nameBn: 'অতিরিক্ত বাজেট বৃদ্ধি',
    nameEn: 'Budget Top-up / Increase',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200'
  },
  {
    id: 'savings',
    nameBn: 'গ্রুপ বা ব্যক্তিগত ফান্ড',
    nameEn: 'Personal / Group Fund',
    badgeClass: 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200'
  },
  {
    id: 'sponsor',
    nameBn: 'স্পনসর / উপহার',
    nameEn: 'Sponsor / Gift',
    badgeClass: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/60 dark:text-fuchsia-200'
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
