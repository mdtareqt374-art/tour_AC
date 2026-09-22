import { Trip, Expense, Income } from '../types';

const TRIPS_KEY = 'tripex_trips_v1';
const EXPENSES_KEY = 'tripex_expenses_v1';
const INCOMES_KEY = 'tripex_incomes_v1';
const ACTIVE_TRIP_KEY = 'tripex_active_trip_id';

const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-sajek-2026',
    name: 'সাজেক ভ্যালি ভ্রমণ',
    destination: 'সাজেক ভ্যালি, রাঙ্গামাটি',
    budget: 25000,
    currency: '৳',
    startDate: '2026-03-10',
    endDate: '2026-03-14',
    notes: 'মেঘের রাজ্য সাজেক ভ্যালি ও খাগড়াছড়ি ট্যুর',
    color: '#0284c7',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'trip-coxbazar-2026',
    name: 'কক্সবাজার সমুদ্র সৈকত',
    destination: 'কক্সবাজার ও ইনানী',
    budget: 35000,
    currency: '৳',
    startDate: '2026-04-01',
    endDate: '2026-04-05',
    notes: 'সমুদ্র দর্শন, ড্রাইভ এবং সি-ফুড টেস্ট',
    color: '#0d9488',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  }
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    tripId: 'trip-sajek-2026',
    description: 'ঢাকা টু খাগড়াছড়ি শান্তি পরিবহন বাস টিকিট (৪ জন)',
    amount: 3600,
    category: 'transport',
    date: '2026-03-10',
    paymentMethod: 'bkash',
    paidBy: 'আসিফ',
    notes: 'অনলাইন টিকিট কনফার্মেশন',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'exp-2',
    tripId: 'trip-sajek-2026',
    description: 'খাগড়াছড়ি থেকে সাজেক চাঁদের গাড়ি রিজার্ভ (৩ দিন)',
    amount: 9500,
    category: 'transport',
    date: '2026-03-11',
    paymentMethod: 'cash',
    paidBy: 'তারেক',
    notes: 'ড্রাইভার ও ফুয়েল সহ',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'exp-3',
    tripId: 'trip-sajek-2026',
    description: 'মেঘপুঞ্জি ইকো রিসোর্ট রুম বুকিং (২ রাত)',
    amount: 7000,
    category: 'accommodation',
    date: '2026-03-11',
    paymentMethod: 'bkash',
    paidBy: 'আসিফ',
    notes: 'কটেজ ১ ও কটেজ ২',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'exp-4',
    tripId: 'trip-sajek-2026',
    description: 'ঐতিহ্যবাহী ব্যাম্বু চিকেন ও পাহাড়ি খাবার লাঞ্চ',
    amount: 1850,
    category: 'food',
    date: '2026-03-11',
    paymentMethod: 'cash',
    paidBy: 'রাফি',
    notes: 'চিলেকোঠা রেস্তোরাঁ',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'exp-5',
    tripId: 'trip-sajek-2026',
    description: 'কংলাক পাহাড় ও হেলিপ্যাড এন্ট্রি টিকিট ও গাইড ফি',
    amount: 600,
    category: 'sightseeing',
    date: '2026-03-12',
    paymentMethod: 'cash',
    paidBy: 'তারেক',
    notes: 'স্থানীয় গাইড সহ',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'exp-6',
    tripId: 'trip-sajek-2026',
    description: 'পাহাড়ি খাঁটি মধু ও বাঁশের তৈরি স্যুভেনির শপিং',
    amount: 1400,
    category: 'shopping',
    date: '2026-03-12',
    paymentMethod: 'cash',
    paidBy: 'রাফি',
    notes: 'রুইলুই পাড়া বাজার',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'exp-7',
    tripId: 'trip-coxbazar-2026',
    description: 'হোটেল সি প্যালেস রুম বুকিং (১ রাত অগ্রিম)',
    amount: 4500,
    category: 'accommodation',
    date: '2026-04-01',
    paymentMethod: 'card',
    paidBy: 'তারেক',
    notes: 'ডিলাক্স কাপল রুম',
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'exp-8',
    tripId: 'trip-coxbazar-2026',
    description: 'ট্রেন টিকিট - পর্যটক এক্সপ্রেস এসি শোভন',
    amount: 3200,
    category: 'transport',
    date: '2026-04-01',
    paymentMethod: 'bkash',
    paidBy: 'তারেক',
    notes: 'রেলওয়ে অ্যাপ থেকে কেনা',
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  }
];

const INITIAL_INCOMES: Income[] = [
  {
    id: 'inc-1',
    tripId: 'trip-sajek-2026',
    title: 'প্রাথমিক চাঁদা সংগ্রহ (৪ জন x ৫,০০০)',
    amount: 20000,
    source: 'contribution',
    date: '2026-03-09',
    paymentMethod: 'bkash',
    contributor: 'আসিফ, তারেক, রাফি, শুভ',
    notes: 'ট্যুরের শুরুর প্রাথমিক জমা ফান্ড',
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'inc-2',
    tripId: 'trip-sajek-2026',
    title: 'জরুরি ব্যাকআপ ফান্ড বৃদ্ধি',
    amount: 5000,
    source: 'budget_increase',
    date: '2026-03-11',
    paymentMethod: 'cash',
    contributor: 'তারেক',
    notes: 'রিজার্ভ চাঁদের গাড়ি ও বাড়তি শপিং বাবদ ফান্ড বৃদ্ধি',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'inc-3',
    tripId: 'trip-coxbazar-2026',
    title: 'কক্সবাজার ট্যুর প্রাথমিক ফান্ড কালেকশন',
    amount: 35000,
    source: 'contribution',
    date: '2026-03-25',
    paymentMethod: 'bank',
    contributor: 'গ্রুপ সদস্যবৃন্দ',
    notes: 'অনলাইন ব্যাংক ট্রান্সফার',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  }
];

export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (!raw) {
      saveTrips(INITIAL_TRIPS);
      return INITIAL_TRIPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TRIPS;
  } catch {
    return INITIAL_TRIPS;
  }
}

export function saveTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Error saving trips to localStorage:', err);
  }
}

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) {
      saveExpenses(INITIAL_EXPENSES);
      return INITIAL_EXPENSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_EXPENSES;
  } catch {
    return INITIAL_EXPENSES;
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Error saving expenses to localStorage:', err);
  }
}

export function loadIncomes(): Income[] {
  try {
    const raw = localStorage.getItem(INCOMES_KEY);
    if (!raw) {
      saveIncomes(INITIAL_INCOMES);
      return INITIAL_INCOMES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_INCOMES;
  } catch {
    return INITIAL_INCOMES;
  }
}

export function saveIncomes(incomes: Income[]): void {
  try {
    localStorage.setItem(INCOMES_KEY, JSON.stringify(incomes));
  } catch (err) {
    console.error('Error saving incomes to localStorage:', err);
  }
}

export function loadActiveTripId(trips: Trip[]): string {
  try {
    const saved = localStorage.getItem(ACTIVE_TRIP_KEY);
    if (saved && trips.some(t => t.id === saved)) {
      return saved;
    }
    return trips[0]?.id || '';
  } catch {
    return trips[0]?.id || '';
  }
}

export function saveActiveTripId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_TRIP_KEY, id);
  } catch (err) {
    console.error('Error saving active trip ID:', err);
  }
}

export function exportBackupJSON(trips: Trip[], expenses: Expense[], incomes: Income[] = []): string {
  const data = {
    appName: 'TripExpenseTracker',
    version: '1.1',
    exportDate: new Date().toISOString(),
    trips,
    expenses,
    incomes
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): { success: boolean; trips?: Trip[]; expenses?: Expense[]; incomes?: Income[]; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.trips || !Array.isArray(parsed.trips)) {
      return { success: false, error: 'অবৈধ ফাইল ফরম্যাট: ভ্রমণের কোনো তথ্য পাওয়া যায়নি।' };
    }
    if (!parsed.expenses || !Array.isArray(parsed.expenses)) {
      return { success: false, error: 'অবৈধ ফাইল ফরম্যাট: খরচের কোনো তথ্য পাওয়া যায়নি।' };
    }
    return {
      success: true,
      trips: parsed.trips,
      expenses: parsed.expenses,
      incomes: Array.isArray(parsed.incomes) ? parsed.incomes : []
    };
  } catch (e: any) {
    return { success: false, error: `JSON পার্স করতে ব্যর্থ: ${e.message || 'অজানা ত্রুটি'}` };
  }
}

export function exportCSV(trip: Trip, expenses: Expense[], incomes: Income[] = []): void {
  const expenseHeaders = ['[খরচ] তারিখ (Date)', 'বিবরণ (Description)', 'ক্যাটাগরি (Category)', 'পরিমাণ (Amount)', 'মাধ্যম (Payment Method)', 'পরিশোধকারী (Paid By)', 'নোট (Notes)'];
  const expenseRows = expenses.map(exp => [
    exp.date,
    `"${(exp.description || '').replace(/"/g, '""')}"`,
    exp.category,
    exp.amount,
    exp.paymentMethod,
    `"${(exp.paidBy || '').replace(/"/g, '""')}"`,
    `"${(exp.notes || '').replace(/"/g, '""')}"`
  ]);

  const incomeHeaders = ['[আয়/ফান্ড] তারিখ (Date)', 'উৎস/বিবরণ (Title)', 'ক্যাটাগরি (Source)', 'পরিমাণ (Amount)', 'মাধ্যম (Payment Method)', 'প্রদানকারী (Contributor)', 'নোট (Notes)'];
  const incomeRows = incomes.map(inc => [
    inc.date,
    `"${(inc.title || '').replace(/"/g, '""')}"`,
    inc.source,
    inc.amount,
    inc.paymentMethod,
    `"${(inc.contributor || '').replace(/"/g, '""')}"`,
    `"${(inc.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [
    `"=== ${trip.name} : খরচের খতিয়ান ==="`,
    expenseHeaders.join(','),
    ...expenseRows.map(r => r.join(',')),
    '',
    `"=== ${trip.name} : আয় ও ফান্ড সংগ্রহের খতিয়ান ==="`,
    incomeHeaders.join(','),
    ...incomeRows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${trip.name.replace(/\s+/g, '_')}_হিসাব.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
