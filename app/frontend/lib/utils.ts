// app/frontend/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes with proper precedence
 * Standard ShadCN utility function
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency in SGD
 * @param amount - Numeric amount to format
 * @returns Formatted string like "S$1,234.56"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date for display
 * @param dateStr - ISO date string
 * @param options - Intl.DateTimeFormatOptions overrides
 * @returns Formatted date string like "20 Jan 2025"
 */
export function formatDate(
  dateStr: string, 
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
  return new Intl.DateTimeFormat('en-SG', { 
    ...defaultOptions, 
    ...options 
  }).format(new Date(dateStr))
}

/**
 * Generate invoice number in format YYYY-XXXX
 * @param year - Year for the invoice
 * @param sequence - Sequence number
 * @returns Formatted invoice number like "2025-0001"
 */
export function generateInvoiceNumber(year: number, sequence: number): string {
  return `${year}-${String(sequence).padStart(4, '0')}`
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param dateStr - ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(dateStr)
}
