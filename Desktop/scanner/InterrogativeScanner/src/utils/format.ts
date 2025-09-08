/**
 * Formatting utilities for Interrogative Scanner
 */

import { ScanVerdict } from '../types';

/**
 * Formats file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formats date in relative time format
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

/**
 * Formats risk score with color coding
 */
export const getRiskScoreColor = (score: number): string => {
  if (score <= 30) return '#4CAF50'; // Green
  if (score <= 70) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

/**
 * Gets verdict display properties
 */
export const getVerdictDisplay = (verdict: ScanVerdict): { color: string; icon: string; label: string } => {
  switch (verdict) {
    case 'harmless':
      return { color: '#4CAF50', icon: 'shield-check', label: 'Harmless' };
    case 'suspicious':
      return { color: '#FF9800', icon: 'shield-alert', label: 'Suspicious' };
    case 'malicious':
      return { color: '#F44336', icon: 'shield-remove', label: 'Malicious' };
    default:
      return { color: '#757575', icon: 'shield-question', label: 'Unknown' };
  }
};

/**
 * Truncates text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Formats confidence percentage
 */
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence)}%`;
};
