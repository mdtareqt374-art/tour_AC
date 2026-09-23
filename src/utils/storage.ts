import { Trip, Expense, Income, CommitteeMember, DevelopmentProject, PhotoRecord } from '../types';

// Storage keys
const TRIPS_KEY = 'tripex_trips_v2';
const EXPENSES_KEY = 'tripex_expenses_v2';
const INCOMES_KEY = 'tripex_incomes_v2';
const ACTIVE_TRIP_KEY = 'tripex_active_trip_v2';
const HAS_CUSTOM_DATA_KEY = 'tripex_has_custom_data_v2';
const MEMBERS_KEY = 'tripex_members_v2';
const PROJECTS_KEY = 'tripex_projects_v2';
const PHOTOS_KEY = 'tripex_photos_v2';

// Legacy keys for migration
const LEGACY_TRIPS_KEY = 'tripex_trips_v1';
const LEGACY_EXPENSES_KEY = 'tripex_expenses_v1';
const LEGACY_INCOMES_KEY = 'tripex_incomes_v1';
const LEGACY_ACTIVE_TRIP_KEY = 'tripex_active_trip_id';

// Default initial demo data (used ONLY on first ever launch if no user data exists)
export const INITIAL_TRIPS: Trip[] = [
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

export const INITIAL_EXPENSES: Expense[] = [
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

export const INITIAL_INCOMES: Income[] = [
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

// In-memory memory fallback if localStorage fails or is blocked
interface MemoryCache {
  trips?: Trip[];
  expenses?: Expense[];
  incomes?: Income[];
  activeTripId?: string;
  hasCustomData?: boolean;
}

const memoryStore: MemoryCache = ((window as any).__tripex_memory_cache =
  (window as any).__tripex_memory_cache || {});

// Multi-storage helper functions: checks localStorage then sessionStorage then memoryStore
function rawGet(key: string): string | null {
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return val;
  } catch {
    // LocalStorage blocked
  }

  try {
    const sVal = sessionStorage.getItem(key);
    if (sVal !== null) return sVal;
  } catch {
    // SessionStorage blocked
  }

  return null;
}

function rawSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`Could not save key ${key} to localStorage:`, err);
  }

  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Ignore
  }

  // Also sync to IndexedDB for ultra durability across browser restarts
  saveToIndexedDB(key, value).catch(() => {});
}

// ----------------------------------------------------
// IndexedDB Engine for resilient offline persistence
// ----------------------------------------------------
const DB_NAME = 'TripExTrackerDB_v2';
const STORE_NAME = 'keyval';

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToIndexedDB(key: string, val: string): Promise<void> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(val, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore IndexedDB failures silently
  }
}

async function getFromIndexedDB(key: string): Promise<string | null> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

// ----------------------------------------------------
// Migration & Initialization Check
// ----------------------------------------------------
function checkAndMigrate(): void {
  // If v2 already has custom data or trips, we are set
  if (rawGet(HAS_CUSTOM_DATA_KEY) || rawGet(TRIPS_KEY)) {
    return;
  }

  // Check if v1 data existed
  const legacyTrips = rawGet(LEGACY_TRIPS_KEY);
  if (legacyTrips) {
    try {
      const parsedTrips = JSON.parse(legacyTrips);
      if (Array.isArray(parsedTrips) && parsedTrips.length > 0) {
        rawSet(TRIPS_KEY, legacyTrips);
        const legacyExpenses = rawGet(LEGACY_EXPENSES_KEY);
        if (legacyExpenses) rawSet(EXPENSES_KEY, legacyExpenses);
        const legacyIncomes = rawGet(LEGACY_INCOMES_KEY);
        if (legacyIncomes) rawSet(INCOMES_KEY, legacyIncomes);
        const legacyActive = rawGet(LEGACY_ACTIVE_TRIP_KEY);
        if (legacyActive) rawSet(ACTIVE_TRIP_KEY, legacyActive);
        rawSet(HAS_CUSTOM_DATA_KEY, 'true');
        return;
      }
    } catch {
      // parse error
    }
  }
}

// Run check once on module load
checkAndMigrate();

// ----------------------------------------------------
// Public APIs for Trips
// ----------------------------------------------------
export function loadTrips(): Trip[] {
  // Check memory cache first
  if (memoryStore.trips && memoryStore.trips.length > 0) {
    return memoryStore.trips;
  }

  try {
    const hasCustomData = rawGet(HAS_CUSTOM_DATA_KEY) === 'true';
    const raw = rawGet(TRIPS_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // If user already initialized and emptied trips, respect that
        if (parsed.length > 0 || hasCustomData) {
          memoryStore.trips = parsed;
          return parsed;
        }
      }
    }

    // If never initialized before, initialize with default initial demo trips
    if (!hasCustomData) {
      saveTrips(INITIAL_TRIPS);
      saveExpenses(INITIAL_EXPENSES);
      saveIncomes(INITIAL_INCOMES);
      rawSet(HAS_CUSTOM_DATA_KEY, 'true');
      memoryStore.trips = INITIAL_TRIPS;
      return INITIAL_TRIPS;
    }

    return [];
  } catch (err) {
    console.error('Error in loadTrips:', err);
    return memoryStore.trips || INITIAL_TRIPS;
  }
}

export function saveTrips(trips: Trip[]): void {
  try {
    memoryStore.trips = trips;
    rawSet(TRIPS_KEY, JSON.stringify(trips));
    rawSet(HAS_CUSTOM_DATA_KEY, 'true');
  } catch (err) {
    console.error('Error saving trips:', err);
  }
}

// ----------------------------------------------------
// Public APIs for Expenses
// ----------------------------------------------------
export function loadExpenses(): Expense[] {
  if (memoryStore.expenses) {
    return memoryStore.expenses;
  }

  try {
    const raw = rawGet(EXPENSES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryStore.expenses = parsed;
        return parsed;
      }
    }

    const hasCustom = rawGet(HAS_CUSTOM_DATA_KEY) === 'true';
    if (!hasCustom) {
      saveExpenses(INITIAL_EXPENSES);
      memoryStore.expenses = INITIAL_EXPENSES;
      return INITIAL_EXPENSES;
    }

    return [];
  } catch (err) {
    console.error('Error in loadExpenses:', err);
    return memoryStore.expenses || INITIAL_EXPENSES;
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    memoryStore.expenses = expenses;
    rawSet(EXPENSES_KEY, JSON.stringify(expenses));
    rawSet(HAS_CUSTOM_DATA_KEY, 'true');
  } catch (err) {
    console.error('Error saving expenses:', err);
  }
}

// ----------------------------------------------------
// Public APIs for Incomes
// ----------------------------------------------------
export function loadIncomes(): Income[] {
  if (memoryStore.incomes) {
    return memoryStore.incomes;
  }

  try {
    const raw = rawGet(INCOMES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryStore.incomes = parsed;
        return parsed;
      }
    }

    const hasCustom = rawGet(HAS_CUSTOM_DATA_KEY) === 'true';
    if (!hasCustom) {
      saveIncomes(INITIAL_INCOMES);
      memoryStore.incomes = INITIAL_INCOMES;
      return INITIAL_INCOMES;
    }

    return [];
  } catch (err) {
    console.error('Error in loadIncomes:', err);
    return memoryStore.incomes || INITIAL_INCOMES;
  }
}

export function saveIncomes(incomes: Income[]): void {
  try {
    memoryStore.incomes = incomes;
    rawSet(INCOMES_KEY, JSON.stringify(incomes));
    rawSet(HAS_CUSTOM_DATA_KEY, 'true');
  } catch (err) {
    console.error('Error saving incomes:', err);
  }
}

// ----------------------------------------------------
// Public APIs for Committee Members
// ----------------------------------------------------
export function loadMembers(): CommitteeMember[] {
  try {
    const raw = rawGet(MEMBERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Exclude legacy mock members
        return parsed.filter((m) => !['mem-1', 'mem-2', 'mem-3'].includes(m.id));
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function saveMembers(members: CommitteeMember[]): void {
  try {
    rawSet(MEMBERS_KEY, JSON.stringify(members));
  } catch (err) {
    console.error('Error saving members:', err);
  }
}

// ----------------------------------------------------
// Public APIs for Development Projects
// ----------------------------------------------------
export function loadProjects(): DevelopmentProject[] {
  try {
    const raw = rawGet(PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Exclude legacy mock projects
        return parsed.filter((p) => p.id !== 'proj-1');
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: DevelopmentProject[]): void {
  try {
    rawSet(PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects:', err);
  }
}

// ----------------------------------------------------
// Public APIs for Photos & Vouchers
// ----------------------------------------------------
export function loadPhotos(): PhotoRecord[] {
  try {
    const raw = rawGet(PHOTOS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function savePhotos(photos: PhotoRecord[]): void {
  try {
    rawSet(PHOTOS_KEY, JSON.stringify(photos));
  } catch (err) {
    console.error('Error saving photos:', err);
  }
}

// ----------------------------------------------------
// Active Trip ID
// ----------------------------------------------------
export function loadActiveTripId(trips: Trip[]): string {
  try {
    const saved = rawGet(ACTIVE_TRIP_KEY);
    if (saved && trips.some((t) => t.id === saved)) {
      return saved;
    }
    return trips[0]?.id || '';
  } catch {
    return trips[0]?.id || '';
  }
}

export function saveActiveTripId(id: string): void {
  try {
    memoryStore.activeTripId = id;
    rawSet(ACTIVE_TRIP_KEY, id);
  } catch (err) {
    console.error('Error saving active trip ID:', err);
  }
}

// ----------------------------------------------------
// User Data Actions: Clear / Restore Demo
// ----------------------------------------------------

// Clears all demo or sample records and creates a clean blank state with a default empty trip
export function resetToBlankState(): { trips: Trip[]; expenses: Expense[]; incomes: Income[] } {
  const todayStr = new Date().toISOString().split('T')[0];
  const blankTrip: Trip = {
    id: 'trip-' + Date.now(),
    name: 'আমার ভ্রমণ',
    destination: 'নতুন গন্তব্য',
    budget: 0,
    currency: '৳',
    startDate: todayStr,
    endDate: todayStr,
    color: '#0d9488',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const trips = [blankTrip];
  const expenses: Expense[] = [];
  const incomes: Income[] = [];

  saveTrips(trips);
  saveExpenses(expenses);
  saveIncomes(incomes);
  saveMembers([]);
  saveProjects([]);
  savePhotos([]);
  saveActiveTripId(blankTrip.id);
  rawSet(HAS_CUSTOM_DATA_KEY, 'true');

  return { trips, expenses, incomes };
}

// Restores default demo data (Sajek Valley & Cox's Bazar)
export function restoreDemoData(): { trips: Trip[]; expenses: Expense[]; incomes: Income[] } {
  saveTrips(INITIAL_TRIPS);
  saveExpenses(INITIAL_EXPENSES);
  saveIncomes(INITIAL_INCOMES);
  saveActiveTripId(INITIAL_TRIPS[0].id);
  rawSet(HAS_CUSTOM_DATA_KEY, 'true');

  return {
    trips: INITIAL_TRIPS,
    expenses: INITIAL_EXPENSES,
    incomes: INITIAL_INCOMES
  };
}

// Check asynchronous IndexedDB fallback on startup
export async function syncStorageWithIndexedDB(
  onHydrate: (trips: Trip[], expenses: Expense[], incomes: Income[]) => void
): Promise<void> {
  try {
    // If localStorage already has data, persist it to IndexedDB
    const currentTrips = rawGet(TRIPS_KEY);
    if (currentTrips) {
      await saveToIndexedDB(TRIPS_KEY, currentTrips);
      const ex = rawGet(EXPENSES_KEY);
      if (ex) await saveToIndexedDB(EXPENSES_KEY, ex);
      const inc = rawGet(INCOMES_KEY);
      if (inc) await saveToIndexedDB(INCOMES_KEY, inc);
      return;
    }

    // If localStorage was cleared (e.g. partition clear in iframe), recover from IndexedDB!
    const idbTrips = await getFromIndexedDB(TRIPS_KEY);
    if (idbTrips) {
      const parsedTrips = JSON.parse(idbTrips);
      if (Array.isArray(parsedTrips) && parsedTrips.length > 0) {
        rawSet(TRIPS_KEY, idbTrips);
        const idbExpenses = await getFromIndexedDB(EXPENSES_KEY);
        const idbIncomes = await getFromIndexedDB(INCOMES_KEY);

        const parsedExpenses = idbExpenses ? JSON.parse(idbExpenses) : [];
        const parsedIncomes = idbIncomes ? JSON.parse(idbIncomes) : [];

        if (idbExpenses) rawSet(EXPENSES_KEY, idbExpenses);
        if (idbIncomes) rawSet(INCOMES_KEY, idbIncomes);
        rawSet(HAS_CUSTOM_DATA_KEY, 'true');

        onHydrate(parsedTrips, parsedExpenses, parsedIncomes);
      }
    }
  } catch (e) {
    console.warn('IndexedDB sync error:', e);
  }
}

// ----------------------------------------------------
// Export / Import Helpers
// ----------------------------------------------------
export function exportBackupJSON(trips: Trip[], expenses: Expense[], incomes: Income[] = []): string {
  const data = {
    appName: 'TripExpenseTracker',
    version: '2.0',
    exportDate: new Date().toISOString(),
    trips,
    expenses,
    incomes
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): {
  success: boolean;
  trips?: Trip[];
  expenses?: Expense[];
  incomes?: Income[];
  error?: string;
} {
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
  const expenseHeaders = [
    '[খরচ] তারিখ (Date)',
    'বিবরণ (Description)',
    'ক্যাটাগরি (Category)',
    'পরিমাণ (Amount)',
    'মাধ্যম (Payment Method)',
    'পরিশোধকারী (Paid By)',
    'নোট (Notes)'
  ];
  const expenseRows = expenses.map((exp) => [
    exp.date,
    `"${(exp.description || '').replace(/"/g, '""')}"`,
    exp.category,
    exp.amount,
    exp.paymentMethod,
    `"${(exp.paidBy || '').replace(/"/g, '""')}"`,
    `"${(exp.notes || '').replace(/"/g, '""')}"`
  ]);

  const incomeHeaders = [
    '[আয়/ফান্ড] তারিখ (Date)',
    'উৎস/বিবরণ (Title)',
    'ক্যাটাগরি (Source)',
    'পরিমাণ (Amount)',
    'মাধ্যম (Payment Method)',
    'প্রদানকারী (Contributor)',
    'নোট (Notes)'
  ];
  const incomeRows = incomes.map((inc) => [
    inc.date,
    `"${(inc.title || '').replace(/"/g, '""')}"`,
    inc.source,
    inc.amount,
    inc.paymentMethod,
    `"${(inc.contributor || '').replace(/"/g, '""')}"`,
    `"${(inc.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent =
    '\uFEFF' +
    [
      `"=== ${trip.name} : খরচের খতিয়ান ==="`,
      expenseHeaders.join(','),
      ...expenseRows.map((r) => r.join(',')),
      '',
      `"=== ${trip.name} : আয় ও ফান্ড সংগ্রহের খতিয়ান ==="`,
      incomeHeaders.join(','),
      ...incomeRows.map((r) => r.join(','))
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
