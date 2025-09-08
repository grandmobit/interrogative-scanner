/**
 * Zustand store for managing scan results and app state
 * Includes AsyncStorage persistence for offline access
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanResult, AppMetrics } from '../types';

interface ScansStore {
  // State
  scans: ScanResult[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addScan: (scan: ScanResult) => void;
  updateScan: (id: string, updates: Partial<ScanResult>) => void;
  removeScan: (id: string) => void;
  clearScans: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  getMetrics: () => AppMetrics;
  getRecentScans: (limit?: number) => ScanResult[];
  getScanById: (id: string) => ScanResult | undefined;
}

export const useScansStore = create<ScansStore>()(
  persist(
    (set, get) => ({
      // Initial state
      scans: [],
      isLoading: false,
      error: null,

      // Actions
      addScan: (scan: ScanResult) => {
        set((state) => ({
          scans: [scan, ...state.scans].slice(0, 50), // Keep max 50 scans
          error: null,
        }));
      },

      updateScan: (id: string, updates: Partial<ScanResult>) => {
        set((state) => ({
          scans: state.scans.map((scan) =>
            scan.id === id ? { ...scan, ...updates } : scan
          ),
        }));
      },

      removeScan: (id: string) => {
        set((state) => ({
          scans: state.scans.filter((scan) => scan.id !== id),
        }));
      },

      clearScans: () => {
        set({ scans: [], error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Computed values
      getMetrics: (): AppMetrics => {
        const { scans } = get();
        
        if (scans.length === 0) {
          return {
            totalScans: 0,
            threatsFound: 0,
            averageRiskScore: 0,
            averageConfidence: 0,
            scansByType: { file: 0, url: 0 },
            threatsByType: {},
            recentScansRisk: [],
          };
        }

        const threatsFound = scans.filter(
          (scan) => scan.verdict === 'malicious' || scan.verdict === 'suspicious'
        ).length;

        const totalRiskScore = scans.reduce((sum, scan) => sum + scan.riskScore, 0);
        const totalConfidence = scans.reduce((sum, scan) => sum + scan.confidence, 0);

        const scansByType = scans.reduce(
          (acc, scan) => {
            acc[scan.targetType]++;
            return acc;
          },
          { file: 0, url: 0 }
        );

        const threatsByType = scans.reduce((acc, scan) => {
          scan.threatTypes.forEach((threat) => {
            acc[threat] = (acc[threat] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>);

        const recentScansRisk = scans
          .slice(0, 7)
          .reverse()
          .map((scan) => scan.riskScore);

        return {
          totalScans: scans.length,
          threatsFound,
          averageRiskScore: Math.round(totalRiskScore / scans.length),
          averageConfidence: Math.round(totalConfidence / scans.length),
          scansByType,
          threatsByType,
          recentScansRisk,
        };
      },

      getRecentScans: (limit = 10): ScanResult[] => {
        const { scans } = get();
        return scans.slice(0, limit);
      },

      getScanById: (id: string): ScanResult | undefined => {
        const { scans } = get();
        return scans.find((scan) => scan.id === id);
      },
    }),
    {
      name: 'interrogative-scanner-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        scans: state.scans,
      }),
    }
  )
);
