export type ExpenseCategory = 
  | 'transport'
  | 'accommodation'
  | 'food'
  | 'sightseeing'
  | 'shopping'
  | 'activities'
  | 'medical'
  | 'other';

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'card' | 'bank' | 'other';

export type IncomeSource = 
  | 'contribution'     // সদস্যদের চাঁদা / কন্ট্রিবিউশন
  | 'budget_increase' // অতিরিক্ত বাজেট বৃদ্ধি
  | 'sponsor'         // স্পনসর / উপহার
  | 'savings'         // ব্যক্তিগত বা গ্রুপ ফান্ড
  | 'refund'          // ফেরত / রিফান্ড
  | 'other';          // অন্যান্য উৎস

export interface Income {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  source: IncomeSource;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  contributor?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Expense {
  id: string;
  tripId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  paidBy?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  budget: number;
  currency: string;
  startDate: string;
  endDate: string;
  notes?: string;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CategoryMeta {
  id: ExpenseCategory;
  nameBn: string;
  nameEn: string;
  iconName: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
}

export interface ExpenseFilter {
  search: string;
  category: string; // 'all' or ExpenseCategory
  paymentMethod: string; // 'all' or PaymentMethod
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}

export type Language = 'bn' | 'en';
