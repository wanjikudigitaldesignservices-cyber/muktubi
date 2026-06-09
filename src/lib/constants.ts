// ============================================================
// MUKTUBI — Constants & Configuration
// ============================================================

import type { Role } from './types';

// ---- MOHI Brand Colors ----
export const BRAND = {
  green: '#1B5E20',
  greenLight: '#2E7D32',
  greenDark: '#0D3B0F',
  amber: '#F59E0B',
  amberLight: '#FBBF24',
  amberDark: '#D97706',
  white: '#FFFFFF',
  offWhite: '#F8FAFC',
  slate: '#64748B',
} as const;

// ---- Role Configuration ----
export const ROLES: Record<Role, { label: string; color: string; defaultPath: string }> = {
  super_admin: {
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-800',
    defaultPath: '/hq',
  },
  center_librarian: {
    label: 'Center Librarian',
    color: 'bg-green-100 text-green-800',
    defaultPath: '/center',
  },
  teacher: {
    label: 'Teacher',
    color: 'bg-blue-100 text-blue-800',
    defaultPath: '/teacher',
  },
  student: {
    label: 'Student',
    color: 'bg-amber-100 text-amber-800',
    defaultPath: '/student',
  },
};

// ---- Navigation per role ----
export const NAV_ITEMS: Record<Role, Array<{ title: string; href: string; icon: string }>> = {
  super_admin: [
    { title: 'Overview', href: '/hq', icon: 'LayoutDashboard' },
    { title: 'Centers', href: '/hq/centers', icon: 'Building2' },
    { title: 'Catalog', href: '/hq/catalog', icon: 'BookOpen' },
    { title: 'Reports', href: '/hq/reports', icon: 'BarChart3' },
    { title: 'Settings', href: '/hq/settings', icon: 'Settings' },
  ],
  center_librarian: [
    { title: 'Catalog', href: '/center', icon: 'BookOpen' },
    { title: 'Loans', href: '/center/loans', icon: 'ArrowLeftRight' },
    { title: 'Members', href: '/center/members', icon: 'Users' },
    { title: 'Returns', href: '/center/returns', icon: 'RotateCcw' },
    { title: 'Reservations', href: '/center/reservations', icon: 'CalendarClock' },
    { title: 'Reports', href: '/center/reports', icon: 'BarChart3' },
  ],
  teacher: [
    { title: 'Dashboard', href: '/teacher', icon: 'LayoutDashboard' },
    { title: 'Class Bookshelf', href: '/teacher/bookshelf', icon: 'Library' },
    { title: 'Reading Reports', href: '/teacher/reports', icon: 'FileText' },
    { title: 'Borrow Books', href: '/teacher/borrow', icon: 'BookPlus' },
  ],
  student: [
    { title: 'Browse Books', href: '/student', icon: 'Search' },
    { title: 'My Loans', href: '/student/loans', icon: 'BookOpen' },
    { title: 'Reading Log', href: '/student/reading-log', icon: 'NotebookPen' },
    { title: 'Recommendations', href: '/student/recommendations', icon: 'Sparkles' },
  ],
};

// ---- Loan status colors ----
export const LOAN_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  returned: 'bg-slate-100 text-slate-600 border-slate-200',
  overdue: 'bg-red-100 text-red-800 border-red-200',
  lost: 'bg-gray-100 text-gray-800 border-gray-200',
};

// ---- Copy condition colors ----
export const CONDITION_COLORS: Record<string, string> = {
  new: 'bg-emerald-100 text-emerald-800',
  good: 'bg-green-100 text-green-800',
  fair: 'bg-amber-100 text-amber-800',
  worn: 'bg-orange-100 text-orange-800',
  lost: 'bg-red-100 text-red-800',
};

// ---- Copy status colors ----
export const COPY_STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  borrowed: 'bg-blue-100 text-blue-800',
  reserved: 'bg-amber-100 text-amber-800',
  maintenance: 'bg-slate-100 text-slate-800',
};

// ---- Risk score thresholds ----
export const RISK_THRESHOLDS = {
  low: 0.3,
  medium: 0.7,
} as const;

// ---- Book categories ----
export const BOOK_CATEGORIES = [
  'English Fiction',
  'Swahili Literature',
  'Science',
  'Mathematics',
  'Christian/Spiritual',
  'Social Studies',
  'Reference',
  'Poetry',
  'Biography',
  'History',
] as const;

// ---- Languages ----
export const LANGUAGES = ['English', 'Swahili', 'French'] as const;

// ---- Grade levels ----
export const GRADE_LEVELS = Array.from({ length: 8 }, (_, i) => i + 1);

// ---- Reading levels ----
export const READING_LEVELS = [
  'Beginner',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Advanced',
] as const;

// ---- Default loan period (days) ----
export const DEFAULT_LOAN_DAYS = 14;
export const MAX_RENEWALS = 2;
