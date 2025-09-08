/**
 * Scan Store - Manages scanning statistics and activity
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ScanResult {
  id: string;
  fileName?: string | undefined;
  url?: string | undefined;
  scanType: 'file' | 'url';
  status: 'safe' | 'threat' | 'warning' | 'scanning' | 'pending';
  threatType?: string | undefined;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  duration?: number;
  details?: string;
  engineResults?: {
    engine: string;
    result: string;
    confidence: number;
  }[];
}

export interface ScanStats {
  totalScans: number;
  threatsDetected: number;
  safeScans: number;
  pendingScans: number;
  lastScanTime?: string;
  todayScans: number;
  weeklyScans: number;
  monthlyScans: number;
}

interface ScanStore {
  // State
  scanStats: ScanStats;
  recentScans: ScanResult[];
  isScanning: boolean;
  currentScan: ScanResult | undefined;
  scanProgress: number;
  scanPhase: string;

  // Actions
  startScan: (scanData: Omit<ScanResult, 'id' | 'timestamp' | 'status'>) => string;
  updateScanProgress: (scanId: string, progress: number, phase: string) => void;
  completeScan: (scanId: string, result: Partial<ScanResult>) => void;
  addScanResult: (result: ScanResult) => void;
  clearScanHistory: () => void;
  getScanById: (id: string) => ScanResult | undefined;
  getTodayScans: () => ScanResult[];
  getThreatsToday: () => ScanResult[];
  resetStats: () => void;
}

const useScanStore = create<ScanStore>()(
  persist(
    (set, get) => ({
      // Initial state
      scanStats: {
        totalScans: 0,
        threatsDetected: 0,
        safeScans: 0,
        pendingScans: 0,
        todayScans: 0,
        weeklyScans: 0,
        monthlyScans: 0,
      },
      recentScans: [
        {
          id: 'scan_demo_1',
          fileName: 'document.pdf',
          scanType: 'file' as const,
          status: 'safe' as const,
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
          duration: 1250,
          details: 'File scanned successfully. No threats detected.'
        },
        {
          id: 'scan_demo_2',
          url: 'suspicious-link.com',
          scanType: 'url' as const,
          status: 'threat' as const,
          threatType: 'phishing',
          riskLevel: 'high' as const,
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
          duration: 890,
          details: 'Phishing website detected. Site attempts to steal login credentials.'
        },
        {
          id: 'scan_demo_3',
          fileName: 'image.jpg',
          scanType: 'file' as const,
          status: 'safe' as const,
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
          duration: 650,
          details: 'Image file is clean and safe to use.'
        },
        {
          id: 'scan_demo_4',
          fileName: 'malware.exe',
          scanType: 'file' as const,
          status: 'threat' as const,
          threatType: 'trojan',
          riskLevel: 'critical' as const,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          duration: 2100,
          details: 'Trojan malware detected. File has been quarantined for security.'
        }
      ],
      isScanning: false,
      currentScan: undefined,
      scanProgress: 0,
      scanPhase: '',

      // Actions
      startScan: (scanData) => {
        const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newScan: ScanResult = {
          ...scanData,
          id: scanId,
          status: 'scanning',
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          currentScan: newScan,
          isScanning: true,
          scanProgress: 0,
          scanPhase: 'Initializing scan...',
          scanStats: {
            ...state.scanStats,
            pendingScans: state.scanStats.pendingScans + 1,
          },
        }));

        return scanId;
      },

      updateScanProgress: (scanId, progress, phase) => {
        set((state) => ({
          scanProgress: progress,
          scanPhase: phase,
          currentScan: state.currentScan?.id === scanId 
            ? { ...state.currentScan, status: 'scanning' as const }
            : state.currentScan,
        }));
      },

      completeScan: (scanId, result) => {
        const state = get();
        if (!state.currentScan || state.currentScan.id !== scanId) return;

        const completedScan: ScanResult = {
          ...state.currentScan,
          ...result,
          status: result.status || 'safe',
        };

        const today = new Date().toDateString();
        const scanDate = new Date(completedScan.timestamp).toDateString();
        const isToday = today === scanDate;

        set((prevState) => ({
          currentScan: undefined,
          isScanning: false,
          scanProgress: 100,
          scanPhase: 'Scan completed',
          recentScans: [completedScan, ...prevState.recentScans.slice(0, 19)], // Keep 20 recent scans
          scanStats: {
            ...prevState.scanStats,
            totalScans: prevState.scanStats.totalScans + 1,
            threatsDetected: completedScan.status === 'threat' 
              ? prevState.scanStats.threatsDetected + 1 
              : prevState.scanStats.threatsDetected,
            safeScans: completedScan.status === 'safe' 
              ? prevState.scanStats.safeScans + 1 
              : prevState.scanStats.safeScans,
            pendingScans: Math.max(0, prevState.scanStats.pendingScans - 1),
            lastScanTime: completedScan.timestamp,
            todayScans: isToday ? prevState.scanStats.todayScans + 1 : prevState.scanStats.todayScans,
            weeklyScans: prevState.scanStats.weeklyScans + 1,
            monthlyScans: prevState.scanStats.monthlyScans + 1,
          },
        }));
      },

      addScanResult: (result) => {
        set((state) => ({
          recentScans: [result, ...state.recentScans.slice(0, 19)],
          scanStats: {
            ...state.scanStats,
            totalScans: state.scanStats.totalScans + 1,
            threatsDetected: result.status === 'threat' 
              ? state.scanStats.threatsDetected + 1 
              : state.scanStats.threatsDetected,
            safeScans: result.status === 'safe' 
              ? state.scanStats.safeScans + 1 
              : state.scanStats.safeScans,
            lastScanTime: result.timestamp,
          },
        }));
      },

      clearScanHistory: () => {
        set({
          recentScans: [],
        });
      },

      getScanById: (id) => {
        const state = get();
        return state.recentScans.find(scan => scan.id === id);
      },

      getTodayScans: () => {
        const state = get();
        const today = new Date().toDateString();
        return state.recentScans.filter(scan => 
          new Date(scan.timestamp).toDateString() === today
        );
      },

      getThreatsToday: () => {
        const state = get();
        const today = new Date().toDateString();
        return state.recentScans.filter(scan => 
          new Date(scan.timestamp).toDateString() === today && 
          scan.status === 'threat'
        );
      },

      resetStats: () => {
        set({
          scanStats: {
            totalScans: 0,
            threatsDetected: 0,
            safeScans: 0,
            pendingScans: 0,
            todayScans: 0,
            weeklyScans: 0,
            monthlyScans: 0,
          },
          recentScans: [],
        });
      },
    }),
    {
      name: 'scan-store',
      partialize: (state) => ({
        scanStats: state.scanStats,
        recentScans: state.recentScans,
      }),
    }
  )
);

export default useScanStore;
