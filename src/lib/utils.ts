// ============================================================
// MUKTUBI — Utility Functions
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isPast, differenceInDays } from 'date-fns';
import { RISK_THRESHOLDS } from './constants';

/** Merge Tailwind classes safely (shadcn/ui helper) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to display format */
export function formatDate(date: string | Date, fmt: string = 'MMM d, yyyy'): string {
  return format(new Date(date), fmt);
}

/** Get relative time from now */
export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/** Check if a date is in the past */
export function isOverdue(dueDate: string | Date): boolean {
  return isPast(new Date(dueDate));
}

/** Days until due (negative = overdue) */
export function daysUntilDue(dueDate: string | Date): number {
  return differenceInDays(new Date(dueDate), new Date());
}

/** Risk score to label + color */
export function getRiskLevel(score: number | null): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score === null || score === undefined) {
    return { label: 'N/A', color: 'text-slate-500', bgColor: 'bg-slate-100' };
  }
  if (score < RISK_THRESHOLDS.low) {
    return { label: 'Low', color: 'text-green-700', bgColor: 'bg-green-100' };
  }
  if (score < RISK_THRESHOLDS.medium) {
    return { label: 'Medium', color: 'text-amber-700', bgColor: 'bg-amber-100' };
  }
  return { label: 'High', color: 'text-red-700', bgColor: 'bg-red-100' };
}

/** Generate a random barcode string */
export function generateBarcode(): string {
  const prefix = 'MOHI';
  const num = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${num}`;
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

/** Get initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Format a number with commas */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/** Capitalize first letter */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Sleep for async operations */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
