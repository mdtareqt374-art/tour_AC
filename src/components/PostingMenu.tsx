import React, { useState, useId } from 'react';
import {
  Calendar,
  Send,
  Check,
  Plus,
  Users,
  TrendingUp,
  Receipt,
  Hammer,
  Image as ImageIcon,
  DollarSign,
  Trash2,
  Phone,
  User,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Layers,
  FileText,
  BarChart3,
  FileDown,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  PieChart,
  PiggyBank
} from 'lucide-react';
import {
  Trip,
  Expense,
  Income,
  Language,
  PostingMenuTab,
  CommitteeMember,
  DevelopmentProject,
  PhotoRecord,
  ExpenseCategory,
  IncomeSource,
  PaymentMethod
} from '../types';
import { PAYMENT_METHODS } from '../constants/categories';

interface PostingMenuProps {
  trip: Trip;
  expenses: Expense[];
  incomes: Income[];
  members: CommitteeMember[];
  projects: DevelopmentProject[];
  photos: PhotoRecord[];
  activeMenuTab: PostingMenuTab;
  onSelectMenuTab: (tab: PostingMenuTab) => void;
  onAddExpense: (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAddIncome: (incomeData: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteExpense: (id: string) => void;
  onDeleteIncome: (id: string) => void;
  onAddMember: (member: Omit<CommitteeMember, 'id' | 'createdAt'>) => void;
  onDeleteMember: (id: string) => void;
  onAddProject: (project: Omit<DevelopmentProject, 'id' | 'createdAt'>) => void;
  onDeleteProject: (id: string) => void;
  onAddPhoto: (photo: Omit<PhotoRecord, 'id' | 'createdAt'>) => void;
  onDeletePhoto: (id: string) => void;
  onOpenReportModal: () => void;
  language: Language;
}

export const PostingMenu: React.FC<PostingMenuProps> = ({
  trip,
  expenses,
  incomes,
  members,
  projects,
  photos,
  activeMenuTab,
  onSelectMenuTab,
  onAddExpense,
  onAddIncome,
  onDeleteExpense,
  onDeleteIncome,
  onAddMember,
  onDeleteMember,
  onAddProject,
  onDeleteProject,
  onAddPhoto,
  onDeletePhoto,
  onOpenReportModal,
  language
}) => {
  const isBn = language === 'bn';
  const isInst = trip.type === 'institution' || trip.type === 'business';

  // --- Posting Form State ---
  const todayStr = new Date().toISOString().split('T')[0];
  const [postingDate, setPostingDate] = useState<string>(todayStr);
  const [postingMode, setPostingMode] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState<string>('');
  const [payerOrVendor, setPayerOrVendor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('other');
  const [incomeSource, setIncomeSource] = useState<IncomeSource>('contribution');
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Member Modal State ---
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState(isInst ? 'সদস্য / স্টাফ' : 'ভ্রমণসঙ্গী');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberContrib, setMemberContrib] = useState('');

  // --- Project Modal State ---
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCost, setProjectCost] = useState('');
  const [projectStatus, setProjectStatus] = useState<'planning' | 'ongoing' | 'completed'>('ongoing');
  const [projectLead, setProjectLead] = useState('');

  // --- Photo Modal State ---
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // --- Year-based Report Filter State ---
  const currentYear = new Date().getFullYear();
  const [selectedReportYear, setSelectedReportYear] = useState<number | 'all'>(currentYear);

  // Format date helper: YYYY-MM-DD -> DD/MM/YYYY
  const formatDisplayDate = (dStr: string) => {
    if (!dStr) return '';
    const parts = dStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dStr;
  };

  // Handle Posting Submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    const finalTitle = description.trim() || (postingMode === 'income' 
      ? (isInst ? (isBn ? 'আয়' : 'Income') : (isBn ? 'আয়' : 'Income'))
      : (isInst ? (isBn ? 'ব্যয়' : 'Expense') : (isBn ? 'ব্যয়' : 'Expense'))
    );

    if (postingMode === 'income') {
      onAddIncome({
        tripId: trip.id,
        title: finalTitle,
        amount: numAmount,
        source: incomeSource,
        date: postingDate || todayStr,
        paymentMethod: paymentMethod,
        contributor: payerOrVendor.trim() || undefined,
        notes: description.trim() || undefined
      });
      setShowNotification(
        isBn 
          ? `✓ ৳${numAmount.toLocaleString()} টাকার আয় সফলভাবে পোস্টিং হয়েছে!` 
          : `✓ Successfully posted income of ${trip.currency}${numAmount.toLocaleString()}!`
      );
    } else {
      onAddExpense({
        tripId: trip.id,
        description: finalTitle,
        amount: numAmount,
        category: expenseCategory,
        date: postingDate || todayStr,
        paymentMethod: paymentMethod,
        paidBy: payerOrVendor.trim() || undefined,
        notes: description.trim() || undefined
      });
      setShowNotification(
        isBn 
          ? `✓ ৳${numAmount.toLocaleString()} টাকার খরচ সফলভাবে পোস্টিং হয়েছে!` 
          : `✓ Successfully posted expense of ${trip.currency}${numAmount.toLocaleString()}!`
      );
    }

    // Reset fields
    setAmount('');
    setPayerOrVendor('');
    setDescription('');
    setErrorMsg(null);

    // Auto dismiss notification
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Handle Member Add
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    onAddMember({
      tripId: trip.id,
      name: memberName.trim(),
      role: memberRole.trim() || (isInst ? 'সদস্য' : 'ভ্রমণসঙ্গী'),
      phone: memberPhone.trim() || undefined,
      contributedAmount: parseFloat(memberContrib) || 0,
      notes: ''
    });
    setMemberName('');
    setMemberPhone('');
    setMemberContrib('');
    setIsMemberModalOpen(false);
  };

  // Handle Project Add
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    onAddProject({
      tripId: trip.id,
      title: projectTitle.trim(),
      cost: parseFloat(projectCost) || 0,
      status: projectStatus,
      startDate: todayStr,
      contractorOrLead: projectLead.trim() || undefined,
      notes: ''
    });
    setProjectTitle('');
    setProjectCost('');
    setProjectLead('');
    setIsProjectModalOpen(false);
  };

  // Handle Photo Add
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;
    onAddPhoto({
      tripId: trip.id,
      title: photoTitle.trim(),
      imageUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      date: todayStr,
      category: 'voucher'
    });
    setPhotoTitle('');
    setPhotoUrl('');
    setIsPhotoModalOpen(false);
  };

  // Filter items for active trip
  const tripIncomes = incomes.filter((i) => i.tripId === trip.id);
  const tripExpenses = expenses.filter((e) => e.tripId === trip.id);
  const tripMembers = members.filter((m) => m.tripId === trip.id || m.tripId === 'all');
  const tripProjects = projects.filter((p) => p.tripId === trip.id || p.tripId === 'all');
  const tripPhotos = photos.filter((p) => p.tripId === trip.id || p.tripId === 'all');

  // Filter donations (incomes with source 'donation' or 'sponsor' or 'contribution')
  const tripDonations = tripIncomes.filter(
    (i) => i.source === 'donation' || i.source === 'sponsor' || i.source === 'contribution'
  );
  const totalDonations = tripDonations.reduce((acc, curr) => acc + curr.amount, 0);

  // Combined recent postings (last 6 items)
  const recentPostings = [
    ...tripIncomes.map((i) => ({ ...i, itemType: 'income' as const })),
    ...tripExpenses.map((e) => ({ ...e, itemType: 'expense' as const }))
  ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);

  // Navigation Items: Row 1 (6 items) & Row 2 (Photos)
  const row1Tabs: { id: PostingMenuTab; labelBn: string; labelEn: string; icon: any }[] = [
    { id: 'committee', labelBn: 'কমিটি', labelEn: 'Committee', icon: Users },
    { id: 'income', labelBn: 'আয়', labelEn: 'Income', icon: TrendingUp },
    { id: 'expense', labelBn: 'ব্যয়', labelEn: 'Expense', icon: Receipt },
    { id: 'posting', labelBn: 'পোস্টিং', labelEn: 'Posting', icon: Send },
    { id: 'report', labelBn: 'রিপোর্ট', labelEn: 'Report', icon: BarChart3 },
    { id: 'development', labelBn: 'উন্নয়ন', labelEn: 'Development', icon: Hammer }
  ];

  const photoTab = { id: 'photos' as PostingMenuTab, labelBn: 'ফটো', labelEn: 'Photos', icon: ImageIcon };

  const datePickerId = useId();

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* ========================================================
          1. TOP PILL NAVIGATION BAR (MATCHING USER'S SCREENSHOT)
          Row 1: [কমিটি] [আয়] [ব্যয়] [পোস্টিং] [রিপোর্ট] [উন্নয়ন]
          Row 2: [ফটো]
         ======================================================== */}
      <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-2 sm:p-2.5 space-y-1.5 sm:space-y-2 shadow-2xs">
        {/* Row 1: 6 buttons */}
        <div className="grid grid-cols-6 gap-1 sm:gap-2">
          {row1Tabs.map((item) => {
            const isActive = activeMenuTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectMenuTab(item.id)}
                className={`py-2 px-1 sm:px-2 rounded-xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#047857] text-white shadow-sm ring-1 ring-emerald-400/50'
                    : 'bg-[#131d33] text-slate-200 border border-slate-700/60 hover:bg-[#1a2742]'
                }`}
              >
                <span>{isBn ? item.labelBn : item.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: ফটো (Full Width) */}
        <div>
          <button
            type="button"
            onClick={() => onSelectMenuTab(photoTab.id)}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
              activeMenuTab === photoTab.id
                ? 'bg-[#047857] text-white shadow-sm ring-1 ring-emerald-400/50'
                : 'bg-[#131d33] text-slate-200 border border-slate-700/60 hover:bg-[#1a2742]'
            }`}
          >
            <span>{isBn ? photoTab.labelBn : photoTab.labelEn}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. POSTING VIEW (EXACTLY MATCHING USER'S SCREENSHOT)
         ======================================================== */}
      {activeMenuTab === 'posting' && (
        <div className="space-y-3.5 sm:space-y-4 animate-fade-in">
          {/* Notification Toast */}
          {showNotification && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-sm font-semibold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{showNotification}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowNotification(null)}
                className="text-emerald-400 hover:text-emerald-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Date Selector Card: [Icon] পোস্টিং তারিখ: [23/09/2026 ∨] */}
          <div className="bg-[#0b1322] border border-slate-800/90 rounded-2xl p-3.5 sm:p-4.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="font-bold text-white text-sm sm:text-base">
                {isBn ? 'পোস্টিং তারিখ:' : 'Posting Date:'}
              </span>
            </div>

            <div className="relative inline-flex items-center">
              <label htmlFor={datePickerId} className="sr-only">
                {isBn ? 'পোস্টিং তারিখ নির্বাচন' : 'Select Posting Date'}
              </label>
              <input
                id={datePickerId}
                type="date"
                value={postingDate}
                onChange={(e) => setPostingDate(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              />
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#131d33] border border-slate-700/60 text-slate-200 text-xs sm:text-sm font-bold shadow-2xs hover:bg-[#1a2742] transition-colors pointer-events-none">
                <span>{formatDisplayDate(postingDate)}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Main Posting Table / Form Card */}
          <form
            onSubmit={handlePostSubmit}
            className="bg-[#0b1322] border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xs"
          >
            {/* Header Row: Blue "বিবরণ" header across top */}
            <div className="bg-[#0066ff] text-white font-bold py-2.5 sm:py-3 text-center text-sm sm:text-base tracking-wide shadow-sm">
              <span>{isBn ? 'বিবরণ' : 'Details'}</span>
            </div>

            {/* Two equal halves toggle options in contrasting container */}
            <div className="p-2 sm:p-2.5 bg-slate-200 dark:bg-slate-800/80 grid grid-cols-2 gap-2 sm:gap-3">
              {/* [আয়] Option */}
              <button
                type="button"
                onClick={() => setPostingMode('income')}
                className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  postingMode === 'income'
                    ? 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm ring-1 ring-emerald-400/50'
                    : 'bg-[#131d33] text-slate-300 border border-slate-700/50 hover:bg-[#1a2742]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-2xs ${
                  postingMode === 'income' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400'
                }`}>
                  <Check className="w-3 h-3" />
                </span>
                <span className="tracking-wide">{isBn ? 'আয় (Income)' : 'Income'}</span>
              </button>

              {/* [ব্যয়] Option */}
              <button
                type="button"
                onClick={() => setPostingMode('expense')}
                className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  postingMode === 'expense'
                    ? 'bg-[#e11d48] hover:bg-rose-700 text-white shadow-sm ring-1 ring-rose-400/50'
                    : 'bg-[#131d33] text-rose-400 border border-slate-700/50 hover:bg-[#1a2742]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-2xs ${
                  postingMode === 'expense' ? 'bg-white/20 text-white' : 'bg-rose-950 text-rose-400'
                }`}>
                  {postingMode === 'expense' ? <Check className="w-3 h-3" /> : '−'}
                </span>
                <span className="tracking-wide">{isBn ? 'ব্যয় (Expense)' : 'Expense'}</span>
              </button>
            </div>

            {/* Row 1: টাকার পরিমাণ */}
            <div className="flex border-t border-b border-slate-800/90">
              <div className="w-[110px] sm:w-[150px] bg-[#7b879c] dark:bg-[#6c788d] px-3.5 sm:px-5 py-3.5 font-bold text-white text-xs sm:text-sm border-r border-slate-700/50 flex items-center shrink-0">
                <span>{isBn ? 'টাকার পরিমাণ' : 'Amount'}</span>
              </div>
              <div className="flex-1 px-3 sm:px-5 py-2.5 bg-[#0b1322] flex items-center">
                <span className="text-slate-400 font-bold text-base mr-2">
                  ৳
                </span>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={isBn ? 'টাকার পরিমাণ লিখুন' : 'Enter amount'}
                  className="w-full bg-transparent text-white text-sm sm:text-base font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden py-1"
                  required
                />
              </div>
            </div>

            {/* Row 2: চাঁদা দাতার নাম (আয় হলে) অথবা পরিশোধকারী/ভেন্ডর (ব্যয় হলে) */}
            <div className="flex border-b border-slate-800/90">
              <div className="w-[110px] sm:w-[150px] bg-[#7b879c] dark:bg-[#6c788d] px-3.5 sm:px-5 py-3.5 font-bold text-white text-xs sm:text-sm border-r border-slate-700/50 flex items-center shrink-0">
                <span>
                  {postingMode === 'income'
                    ? (isBn ? 'চাঁদা দাতার নাম' : 'Donor / Payer Name')
                    : (isBn ? 'পরিশোধকারী / ভেন্ডর' : 'Paid By / Vendor')}
                </span>
              </div>
              <div className="flex-1 px-3 sm:px-5 py-2.5 bg-[#0b1322] flex items-center">
                <input
                  type="text"
                  value={payerOrVendor}
                  onChange={(e) => setPayerOrVendor(e.target.value)}
                  placeholder={
                    postingMode === 'income'
                      ? (isBn ? 'চাঁদা দাতার নাম লিখুন (ঐচ্ছিক)' : 'Enter donor/payer name (optional)')
                      : (isBn ? 'পরিশোধকারী বা ভেন্ডরের নাম (ঐচ্ছিক)' : 'Enter paid by / vendor name (optional)')
                  }
                  className="w-full bg-transparent text-white text-sm sm:text-base placeholder:text-slate-400 focus:outline-hidden py-1"
                />
              </div>
            </div>

            {/* Row 3: বিবরণ */}
            <div className="flex">
              <div className="w-[110px] sm:w-[150px] bg-[#7b879c] dark:bg-[#6c788d] px-3.5 sm:px-5 py-3.5 font-bold text-white text-xs sm:text-sm border-r border-slate-700/50 flex items-center shrink-0">
                <span>{isBn ? 'বিবরণ' : 'Description'}</span>
              </div>
              <div className="flex-1 px-3 sm:px-5 py-2.5 bg-[#0b1322] flex items-center">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    postingMode === 'income'
                      ? (isBn ? 'আয়ের কারণ বা বিবরণ (যেমন: সদস্য চাঁদা, অনুদান, বিক্রয়...)' : 'Income details or reason...')
                      : (isBn ? 'ব্যয়ের কারণ বা বিবরণ (যেমন: বেতন, অফিস ভাড়া, নাস্তা, পরিবহন...)' : 'Expense details or reason...')
                  }
                  className="w-full bg-transparent text-white text-sm sm:text-base placeholder:text-slate-400 focus:outline-hidden py-1"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="px-5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border-t border-rose-100">
                {errorMsg}
              </div>
            )}
          </form>

          {/* Action Button on Bottom Right: [ ✈ পোস্টিং ] */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handlePostSubmit}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#0066ff] hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold shadow-lg shadow-blue-500/35 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 -rotate-12" />
              <span>{isBn ? 'পোস্টিং' : 'Post Entry'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          3. COMMITTEE VIEW (কমিটি / স্টাফ ও সদস্য)
         ======================================================== */}
      {activeMenuTab === 'committee' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <span>
                  {isInst ? (isBn ? 'কমিটি, পরিচালনা পর্ষদ ও স্টাফ' : 'Committee & Staff') : (isBn ? 'ভ্রমণসঙ্গী ও সমন্বয় কমিটি' : 'Tour Companions & Committee')}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'মোট সদস্য:' : 'Total Members:'} {tripMembers.length} {isBn ? 'জন' : 'people'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMemberModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ সদস্য যোগ' : '+ Add Member'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {tripMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-sm">
                      {member.name.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {member.name}
                      </h4>
                      <span className="inline-block text-2xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold mt-0.5">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteMember(member.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title={isBn ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {member.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.contributedAmount ? (
                    <div className="flex items-center justify-between font-semibold text-emerald-700 dark:text-emerald-400">
                      <span>{isBn ? 'জমা / চাঁদা:' : 'Contribution:'}</span>
                      <span>৳{member.contributedAmount.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Add Member Modal */}
          {isMemberModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-md shadow-xl">
                <h3 className="font-bold text-base mb-3">
                  {isBn ? 'নতুন সদস্য যুক্ত করুন' : 'Add New Member'}
                </h3>
                <form onSubmit={handleSaveMember} className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'নাম:' : 'Name:'}</label>
                    <input
                      type="text"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder={isBn ? 'সদস্যের নাম লিখুন' : 'Member name'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'পদবি / দায়িত্ব:' : 'Role / Title:'}</label>
                    <input
                      type="text"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      placeholder={isBn ? 'যেমন: সভাপতি, সাধারণ সম্পাদক, স্টাফ, সদস্য' : 'e.g. President, Secretary, Member'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'মোবাইল নম্বর:' : 'Phone:'}</label>
                    <input
                      type="text"
                      value={memberPhone}
                      onChange={(e) => setMemberPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'জমা / চাঁদা পরিমাণ (ঐচ্ছিক):' : 'Contribution amount:'}</label>
                    <input
                      type="number"
                      value={memberContrib}
                      onChange={(e) => setMemberContrib(e.target.value)}
                      placeholder="৳ 0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsMemberModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                    >
                      {isBn ? 'সংরক্ষণ করুন' : 'Save Member'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          4. ANNUAL & PERIODIC REPORT VIEW (বছরভিত্তিক অডিট ও রিপোর্ট)
         ======================================================== */}
      {activeMenuTab === 'report' && (() => {
        // Collect all distinct years from incomes and expenses
        const allYearsSet = new Set<number>();
        allYearsSet.add(currentYear);
        [...tripIncomes, ...tripExpenses].forEach((item) => {
          if (item.date) {
            const yr = parseInt(item.date.split('-')[0], 10);
            if (!isNaN(yr)) allYearsSet.add(yr);
          }
        });
        const sortedYears = Array.from(allYearsSet).sort((a, b) => b - a);

        // Filter items based on selectedReportYear
        const filteredIncomes = selectedReportYear === 'all'
          ? tripIncomes
          : tripIncomes.filter((i) => i.date && i.date.startsWith(`${selectedReportYear}-`));

        const filteredExpenses = selectedReportYear === 'all'
          ? tripExpenses
          : tripExpenses.filter((e) => e.date && e.date.startsWith(`${selectedReportYear}-`));

        const totalYearIncome = filteredIncomes.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const totalYearExpense = filteredExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const yearNetBalance = totalYearIncome - totalYearExpense;

        // Month-by-month calculation for the selected year
        const months = [
          { num: '01', nameBn: 'জানুয়ারি', nameEn: 'Jan' },
          { num: '02', nameBn: 'ফেব্রুয়ারি', nameEn: 'Feb' },
          { num: '03', nameBn: 'মার্চ', nameEn: 'Mar' },
          { num: '04', nameBn: 'এপ্রিল', nameEn: 'Apr' },
          { num: '05', nameBn: 'মে', nameEn: 'May' },
          { num: '06', nameBn: 'জুন', nameEn: 'Jun' },
          { num: '07', nameBn: 'জুলাই', nameEn: 'Jul' },
          { num: '08', nameBn: 'আগস্ট', nameEn: 'Aug' },
          { num: '09', nameBn: 'সেপ্টেম্বর', nameEn: 'Sep' },
          { num: '10', nameBn: 'অক্টোবর', nameEn: 'Oct' },
          { num: '11', nameBn: 'নভেম্বর', nameEn: 'Nov' },
          { num: '12', nameBn: 'ডিসেম্বর', nameEn: 'Dec' }
        ];

        const monthlyBreakdown = months.map((m) => {
          const mIncomes = filteredIncomes.filter((i) => {
            if (!i.date) return false;
            const parts = i.date.split('-');
            return parts[1] === m.num;
          });
          const mExpenses = filteredExpenses.filter((e) => {
            if (!e.date) return false;
            const parts = e.date.split('-');
            return parts[1] === m.num;
          });

          const incSum = mIncomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);
          const expSum = mExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
          const balance = incSum - expSum;

          return {
            ...m,
            income: incSum,
            expense: expSum,
            balance,
            hasData: incSum > 0 || expSum > 0
          };
        });

        return (
          <div className="space-y-4 animate-fade-in">
            {/* Top Bar: Year Filter & Action Buttons */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg flex items-center gap-2">
                    <span>{isBn ? 'বছরভিত্তিক আয়-ব্যয় রিপোর্ট' : 'Annual Income & Expense Report'}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
                      {selectedReportYear === 'all' ? (isBn ? 'সকল বছর' : 'All Time') : selectedReportYear}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'প্রতি বছরের বার্ষিক ও মাসভিত্তিক ব্যালেন্স খতিয়ান' : 'Annual statement and monthly breakdown'}
                  </p>
                </div>
              </div>

              {/* Year Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold px-2 text-slate-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>{isBn ? 'বছর:' : 'Year:'}</span>
                </span>
                {sortedYears.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedReportYear(yr)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedReportYear === yr
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedReportYear('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedReportYear === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {isBn ? 'সব' : 'All'}
                </button>
              </div>

              {/* PDF Report Trigger Button */}
              <button
                type="button"
                onClick={onOpenReportModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>{isBn ? 'পিডিএফ ডাউনলোড / প্রিন্ট' : 'PDF Download / Print'}</span>
              </button>
            </div>

            {/* 3 Metric Cards: Total Income, Total Expense, Net Balance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Income */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>{isBn ? 'মোট আয়' : 'Total Income'}</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 font-black text-2xl text-emerald-600">
                  ৳{totalYearIncome.toLocaleString()}
                </div>
                <div className="text-2xs text-slate-400 mt-1">
                  {filteredIncomes.length} {isBn ? 'টি এন্ট্রি' : 'entries'}
                </div>
              </div>

              {/* Expense */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>{isBn ? 'মোট ব্যয়' : 'Total Expense'}</span>
                  <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 font-black text-2xl text-rose-600">
                  ৳{totalYearExpense.toLocaleString()}
                </div>
                <div className="text-2xs text-slate-400 mt-1">
                  {filteredExpenses.length} {isBn ? 'টি এন্ট্রি' : 'entries'}
                </div>
              </div>

              {/* Net Balance / Surplus */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>{isBn ? 'নীট ব্যালেন্স / তহবিল' : 'Net Balance / Surplus'}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    yearNetBalance >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    <PiggyBank className="w-4 h-4" />
                  </div>
                </div>
                <div className={`mt-2 font-black text-2xl ${
                  yearNetBalance >= 0 ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  ৳{yearNetBalance.toLocaleString()}
                </div>
                <div className="text-2xs text-slate-400 mt-1">
                  {yearNetBalance >= 0 ? (isBn ? 'উদ্বৃত্ত তহবিল' : 'Net Surplus') : (isBn ? 'ঘাটতি' : 'Deficit')}
                </div>
              </div>
            </div>

            {/* Monthly Statement Breakdown Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>
                    {isBn
                      ? `${selectedReportYear === 'all' ? 'সর্বমোট' : selectedReportYear + ' সালের'} মাসভিত্তিক খতিয়ান`
                      : `Monthly Ledger Breakdown (${selectedReportYear})`}
                  </span>
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold bg-slate-50 dark:bg-slate-850">
                      <th className="py-2.5 px-3">{isBn ? 'মাস' : 'Month'}</th>
                      <th className="py-2.5 px-3 text-right">{isBn ? 'আয় (টাকা)' : 'Income'}</th>
                      <th className="py-2.5 px-3 text-right">{isBn ? 'ব্যয় (টাকা)' : 'Expense'}</th>
                      <th className="py-2.5 px-3 text-right">{isBn ? 'ব্যালেন্স (উদ্বৃত্ত)' : 'Balance'}</th>
                      <th className="py-2.5 px-3 text-center">{isBn ? 'অবস্থা' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {monthlyBreakdown.map((m) => (
                      <tr
                        key={m.num}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors ${
                          !m.hasData ? 'opacity-50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-200">
                          {isBn ? m.nameBn : m.nameEn}
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-emerald-600">
                          {m.income > 0 ? `৳${m.income.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-rose-600">
                          {m.expense > 0 ? `৳${m.expense.toLocaleString()}` : '—'}
                        </td>
                        <td className={`py-3 px-3 text-right font-bold ${
                          m.balance > 0
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : m.balance < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-400'
                        }`}>
                          {m.hasData ? `৳${m.balance.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {m.hasData ? (
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-2xs font-bold ${
                              m.balance >= 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {m.balance >= 0 ? (isBn ? 'উদ্বৃত্ত' : 'Surplus') : (isBn ? 'ঘাটতি' : 'Deficit')}
                            </span>
                          ) : (
                            <span className="text-2xs text-slate-400">
                              {isBn ? 'কোন লেনদেন নেই' : 'No activity'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 dark:border-slate-700 font-bold bg-slate-50/80 dark:bg-slate-850/80">
                      <td className="py-3 px-3 text-slate-900 dark:text-white font-extrabold">
                        {isBn ? 'মোট (সর্বমোট)' : 'Total'}
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-700 dark:text-emerald-400 font-extrabold">
                        ৳{totalYearIncome.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right text-rose-700 dark:text-rose-400 font-extrabold">
                        ৳{totalYearExpense.toLocaleString()}
                      </td>
                      <td className={`py-3 px-3 text-right font-extrabold ${
                        yearNetBalance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'
                      }`}>
                        ৳{yearNetBalance.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {isBn ? 'বার্ষিক সামারি' : 'Summary'}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          6. DEVELOPMENT VIEW (উন্নয়ন ও প্রজেক্ট ফান্ড)
         ======================================================== */}
      {activeMenuTab === 'development' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Hammer className="w-5 h-5 text-indigo-600" />
                <span>{isBn ? 'উন্নয়ন কাজ, সংস্কার ও প্রজেক্ট খতিয়ান' : 'Development & Projects Log'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'মোট প্রকল্প:' : 'Total Projects:'} {tripProjects.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ প্রজেক্ট যোগ' : '+ Add Project'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {tripProjects.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                      {p.title}
                    </h4>
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : p.status === 'ongoing'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {p.status === 'completed'
                        ? (isBn ? 'সম্পন্ন' : 'Completed')
                        : p.status === 'ongoing'
                        ? (isBn ? 'চলমান' : 'Ongoing')
                        : (isBn ? 'পরিকল্পনা' : 'Planned')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {p.contractorOrLead && `${isBn ? 'দায়িত্বে:' : 'Lead:'} ${p.contractorOrLead} • `}
                    {p.startDate && `${isBn ? 'শুরু:' : 'Started:'} ${formatDisplayDate(p.startDate)}`}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">{isBn ? 'বাজেট/ব্যয়:' : 'Cost:'}</span>
                    <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                      ৳{p.cost.toLocaleString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteProject(p.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5"
                    title={isBn ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Project Modal */}
          {isProjectModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-md shadow-xl">
                <h3 className="font-bold text-base mb-3">
                  {isBn ? 'নতুন উন্নয়ন প্রকল্প যুক্ত করুন' : 'Add Development Project'}
                </h3>
                <form onSubmit={handleSaveProject} className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'প্রকল্পের নাম:' : 'Title:'}</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder={isBn ? 'যেমন: নতুন সাইনবোর্ড, ডেকোরেশন, সংস্কার' : 'Project title'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'আনুমানিক ব্যয়:' : 'Cost:'}</label>
                    <input
                      type="number"
                      value={projectCost}
                      onChange={(e) => setProjectCost(e.target.value)}
                      placeholder="৳ 0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'বর্তমান অবস্থা:' : 'Status:'}</label>
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    >
                      <option value="planning">{isBn ? 'পরিকল্পনাধীন' : 'Planning'}</option>
                      <option value="ongoing">{isBn ? 'চলমান' : 'Ongoing'}</option>
                      <option value="completed">{isBn ? 'সম্পন্ন' : 'Completed'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'দায়িত্বপ্রাপ্ত ব্যক্তি/ভেন্ডর:' : 'Lead / Vendor:'}</label>
                    <input
                      type="text"
                      value={projectLead}
                      onChange={(e) => setProjectLead(e.target.value)}
                      placeholder={isBn ? 'ভেন্ডর বা দায়িত্বপ্রাপ্ত ব্যক্তি' : 'Lead person'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsProjectModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    >
                      {isBn ? 'সংরক্ষণ' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          7. PHOTOS VIEW (ভাউচার ও ফটো গ্যালারি)
         ======================================================== */}
      {activeMenuTab === 'photos' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <span>{isBn ? 'ভাউচার, রসিদ ও ফটো গ্যালারি' : 'Photos & Receipts Gallery'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'সংরক্ষিত ছবি:' : 'Saved photos:'} {tripPhotos.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ ফটো যোগ' : '+ Add Photo'}</span>
            </button>
          </div>

          {tripPhotos.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                {isBn ? 'কোনো ভাউচার বা ছবি যুক্ত করা হয়নি।' : 'No photos or receipts attached yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tripPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs group relative"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-2.5">
                    <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {photo.title}
                    </h5>
                    <span className="text-2xs text-slate-400 block mt-0.5">
                      {formatDisplayDate(photo.date)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={isBn ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Photo Modal */}
          {isPhotoModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-md shadow-xl">
                <h3 className="font-bold text-base mb-3">
                  {isBn ? 'ফটো বা ভাউচার রসিদ যুক্ত করুন' : 'Attach Photo or Receipt'}
                </h3>
                <form onSubmit={handleSavePhoto} className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'শিরোনাম / বিবরণ:' : 'Title:'}</label>
                    <input
                      type="text"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder={isBn ? 'যেমন: হোটেল ক্যাশ মেমো, গাড়ি ভাড়া ভাউচার' : 'Title'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'ছবির লিংক (URL):' : 'Image URL:'}</label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <p className="text-2xs text-slate-400 mt-1">
                      {isBn ? 'ফাঁকা রাখলে স্বয়ংক্রিয় ডিফল্ট ভাউচার ছবি নেওয়া হবে।' : 'Leave blank for default voucher image.'}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    >
                      {isBn ? 'যুক্ত করুন' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
