export type AccountType = 'trip' | 'institution' | 'business';

export type ExpenseCategory = 
  | 'transport'
  | 'accommodation'
  | 'food'
  | 'sightseeing'
  | 'shopping'
  | 'activities'
  | 'medical'
  | 'salary'          // বেতন ও স্টাফ সম্মানী
  | 'rent_utility'    // ভাড়া ও ইউটিলিটি/বিদ্যুৎ বিল
  | 'office_supplies' // অফিস সরঞ্জাম ও স্টেশনারি
  | 'inventory'       // পণ্য ও কাঁচামাল ক্রয়
  | 'maintenance'     // মেরামত ও সার্ভিসিং
  | 'marketing'       // প্রচার ও বিজ্ঞাপন
  | 'entertainment'   // আপ্যায়ন ও নাশতা
  | 'other';

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'card' | 'bank' | 'other';

export type IncomeSource = 
  | 'contribution'     // সদস্যদের চাঁদা / কন্ট্রিবিউশন
  | 'budget_increase' // অতিরিক্ত বাজেট বৃদ্ধি
  | 'sponsor'         // স্পনসর / উপহার
  | 'savings'         // ব্যক্তিগত বা গ্রুপ ফান্ড
  | 'refund'          // ফেরত / রিফান্ড
  | 'sales'           // পণ্য বা সেবা বিক্রয়
  | 'service_fee'     // ফি, সার্ভিস চার্জ বা বিল
  | 'donation'        // অনুদান, সাহায্য বা জাকাত
  | 'investment'      // মূলধন বা শেয়ার বিনিয়োগ
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
  destination: string; // গন্তব্য অথবা প্রতিষ্ঠানের ঠিকানা/শাখা
  budget: number; // বাজেট অথবা প্রারম্ভিক মূলধন
  currency: string;
  startDate: string;
  endDate: string;
  notes?: string;
  color?: string;
  createdAt: number;
  updatedAt: number;
  type?: AccountType; // 'trip' | 'institution' | 'business'
  institutionType?: string; // e.g., 'office', 'shop', 'school', 'club_ngo', 'factory', 'other'
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

export type PostingMenuTab = 
  | 'committee'   // কমিটি
  | 'map'         // ম্যাপ
  | 'income'      // আয়
  | 'expense'     // ব্যয়
  | 'posting'     // পোস্টিং
  | 'donation'    // অনুদান
  | 'development' // উন্নয়ন
  | 'photos';     // ফটো

export interface CommitteeMember {
  id: string;
  tripId: string;
  name: string;
  role: string; // e.g., সভাপতি, সাধারণ সম্পাদক, ক্যাশিয়ার, সদস্য, ট্যুর লিডার
  phone?: string;
  contributedAmount?: number;
  notes?: string;
  createdAt: number;
}

export interface DevelopmentProject {
  id: string;
  tripId: string;
  title: string;
  cost: number;
  status: 'planning' | 'ongoing' | 'completed';
  startDate?: string;
  completionDate?: string;
  contractorOrLead?: string;
  notes?: string;
  createdAt: number;
}

export interface PhotoRecord {
  id: string;
  tripId: string;
  title: string;
  imageUrl: string;
  date: string;
  category?: string;
  notes?: string;
  createdAt: number;
}
