// ============================================================
// MUKTUBI — Type Definitions
// Library Management System for Missions of Hope International
// ============================================================

export type Role = 'super_admin' | 'center_librarian' | 'teacher' | 'student';

export type CopyCondition = 'new' | 'good' | 'fair' | 'worn' | 'lost';
export type CopyStatus = 'available' | 'borrowed' | 'reserved' | 'maintenance';
export type LoanStatus = 'active' | 'returned' | 'overdue' | 'lost';
export type ReservationStatus = 'pending' | 'fulfilled' | 'cancelled' | 'expired';

// ---- Database Models ----

export interface Center {
  id: string;
  name: string;
  location: string;
  region: string;
  total_books: number;
  active_members: number;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  center_id: string | null;
  grade_level: number | null;
  reading_level: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  cover_url: string | null;
  description: string | null;
  category: string;
  subject: string | null;
  language: string;
  reading_level: string | null;
  grade_range: string | null;
  publisher: string | null;
  published_year: number | null;
  ai_summary: string | null;
  ai_tags: string[] | null;
  created_at: string;
}

export interface BookCopy {
  id: string;
  book_id: string;
  center_id: string;
  copy_number: number;
  condition: CopyCondition;
  status: CopyStatus;
  barcode: string;
  acquired_date: string | null;
  created_at: string;
  // Joined fields
  book?: Book;
  center?: Center;
}

export interface Loan {
  id: string;
  copy_id: string;
  book_id: string;
  member_id: string;
  center_id: string;
  borrowed_date: string;
  due_date: string;
  returned_date: string | null;
  status: LoanStatus;
  renewal_count: number;
  overdue_risk_score: number | null;
  created_at: string;
  // Joined fields
  book?: Book;
  member?: Profile;
  copy?: BookCopy;
}

export interface Reservation {
  id: string;
  book_id: string;
  center_id: string;
  member_id: string;
  reserved_date: string;
  status: ReservationStatus;
  // Joined fields
  book?: Book;
  member?: Profile;
}

export interface ReadingLog {
  id: string;
  member_id: string;
  book_id: string;
  started_date: string | null;
  finished_date: string | null;
  rating: number | null;
  notes: string | null;
  pages_read: number | null;
  // Joined fields
  book?: Book;
}

export interface AIRecommendation {
  id: string;
  member_id: string;
  book_id: string;
  reason: string;
  score: number;
  generated_at: string;
  shown: boolean;
  // Joined fields
  book?: Book;
}

// ---- UI / Component types ----

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface StatsCardData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// ---- AI Feature types ----

export interface AIBookFillRequest {
  title?: string;
  isbn?: string;
}

export interface AIBookFillResponse {
  author: string;
  description: string;
  category: string;
  subject: string;
  reading_level: string;
  grade_range: string;
  ai_summary: string;
  ai_tags: string[];
}

export interface AIRecommendationRequest {
  member_id: string;
}

export interface AISearchRequest {
  query: string;
  center_id: string;
}

export interface AISearchResult {
  book_id: string;
  relevance_explanation: string;
  score: number;
  book?: Book;
}

export interface AIReportRequest {
  month: string; // e.g. "2026-06"
}
