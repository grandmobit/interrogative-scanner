/**
 * Core application types for Interrogative Scanner
 */

export type ScanType = 'file' | 'url';
export type ScanMode = 'express' | 'comprehensive';
export type ScanVerdict = 'harmless' | 'suspicious' | 'malicious' | 'unknown';

export interface ScanResult {
  id: string;
  targetName: string;
  targetType: ScanType;
  targetUrl?: string;
  verdict: ScanVerdict;
  riskScore: number; // 0-100
  confidence: number; // 0-100
  threatTypes: string[];
  recommendations: string[];
  createdAt: string;
  scanMode: ScanMode;
  vtReportId?: string;
  isTestData?: boolean;
}

export interface VirusTotalResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      stats: {
        harmless: number;
        malicious: number;
        suspicious: number;
        undetected: number;
      };
      last_analysis_results: Record<string, {
        category: string;
        engine_name: string;
        result: string | null;
      }>;
      reputation: number;
    };
  };
}

export interface AppMetrics {
  totalScans: number;
  threatsFound: number;
  averageRiskScore: number;
  averageConfidence: number;
  scansByType: Record<ScanType, number>;
  threatsByType: Record<string, number>;
  recentScansRisk: number[];
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'article';
  url: string;
  category: 'getting-started' | 'phishing' | 'mobile-safety' | 'malware';
  duration?: string;
  fileSize?: string;
}
