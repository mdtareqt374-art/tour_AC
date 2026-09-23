import { Trip, Expense, Income, CommitteeMember, DevelopmentProject, PhotoRecord } from '../types';

// Storage keys (v3 clean slate: start completely fresh without any demo/mock entries)
const TRIPS_KEY = 'tripex_trips_v3';
const EXPENSES_KEY = 'tripex_expenses_v3';
const INCOMES_KEY = 'tripex_incomes_v3';
const ACTIVE_TRIP_KEY = 'tripex_active_trip_v3';
const HAS_CUSTOM_DATA_KEY = 'tripex_has_custom_data_v3';
const MEMBERS_KEY = 'tripex_members_v3';
const PROJECTS_KEY = 'tripex_projects_v3';
const PHOTOS_KEY = 'tripex_photos_v3';

// Default initial data: Start completely blank (no demo/mock trips, expenses or incomes)
export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-main-default',
    name: 'আমার হিসাব',
    destination: 'সাধারণ হিসাব',
    budget: 0,
    currency: '৳',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    notes: '',
    color: '#0d9488',
    type: 'institution',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_INCOMES: Income[] = [];

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
const DB_NAME = 'TripExTrackerDB_v3';
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
  // Clean start, no legacy demo migration
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
    const raw = rawGet(TRIPS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryStore.trips = parsed;
        return parsed;
      }
    }

    // Default clean trip if nothing exists yet
    saveTrips(INITIAL_TRIPS);
    saveExpenses([]);
    saveIncomes([]);
    rawSet(HAS_CUSTOM_DATA_KEY, 'true');
    memoryStore.trips = INITIAL_TRIPS;
    return INITIAL_TRIPS;
  } catch (err) {
    console.error('Error in loadTrips:', err);
    return INITIAL_TRIPS;
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
    return [];
  } catch (err) {
    console.error('Error in loadExpenses:', err);
    return [];
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
    return [];
  } catch (err) {
    console.error('Error in loadIncomes:', err);
    return [];
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

// Clears all records and creates a completely clean blank state
export function resetToBlankState(): { trips: Trip[]; expenses: Expense[]; incomes: Income[] } {
  const todayStr = new Date().toISOString().split('T')[0];
  const blankTrip: Trip = {
    id: 'trip-' + Date.now(),
    name: 'আমার হিসাব',
    destination: 'সাধারণ হিসাব',
    budget: 0,
    currency: '৳',
    startDate: todayStr,
    endDate: todayStr,
    color: '#0d9488',
    type: 'institution',
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

// Cleans all data completely
export function restoreDemoData(): { trips: Trip[]; expenses: Expense[]; incomes: Income[] } {
  return resetToBlankState();
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
