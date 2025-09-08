/**
 * Mapping utilities for VirusTotal API responses
 */

import { VirusTotalResponse, ScanResult, ScanVerdict, ScanMode, ScanType } from '../types';

/**
 * Maps VirusTotal response to internal ScanResult format
 */
export const mapVirusTotalResponse = (
  response: VirusTotalResponse,
  targetName: string,
  targetType: ScanType,
  scanMode: ScanMode,
  targetUrl?: string
): ScanResult => {
  const { stats, last_analysis_results } = response.data.attributes;
  
  // Calculate verdict based on detection stats
  const verdict = calculateVerdict(stats);
  
  // Calculate risk score (0-100)
  const totalEngines = Object.keys(last_analysis_results).length;
  const maliciousCount = stats.malicious;
  const suspiciousCount = stats.suspicious;
  const riskScore = Math.round(((maliciousCount * 2 + suspiciousCount) / (totalEngines * 2)) * 100);
  
  // Calculate confidence based on number of engines that detected
  const detectedCount = maliciousCount + suspiciousCount;
  const confidence = totalEngines > 0 ? Math.round((detectedCount / totalEngines) * 100) : 0;
  
  // Extract threat types
  const threatTypes = extractThreatTypes(last_analysis_results);
  
  // Generate recommendations
  const recommendations = generateRecommendations(verdict, threatTypes);
  
  return {
    id: response.data.id,
    targetName,
    targetType,
    targetUrl,
    verdict,
    riskScore,
    confidence,
    threatTypes,
    recommendations,
    createdAt: new Date().toISOString(),
    scanMode,
    vtReportId: response.data.id,
  };
};

/**
 * Calculates verdict based on detection statistics
 */
const calculateVerdict = (stats: VirusTotalResponse['data']['attributes']['stats']): ScanVerdict => {
  const { malicious, suspicious, harmless, undetected } = stats;
  
  if (malicious > 0) return 'malicious';
  if (suspicious > 0) return 'suspicious';
  if (harmless > 0 || undetected > 0) return 'harmless';
  
  return 'unknown';
};

/**
 * Extracts threat types from analysis results
 */
const extractThreatTypes = (results: Record<string, { category: string; result: string | null }>): string[] => {
  const threatTypes = new Set<string>();
  
  Object.values(results).forEach(result => {
    if (result.result && result.result !== 'Clean' && result.result !== 'Undetected') {
      // Extract common threat types from result strings
      const resultLower = result.result.toLowerCase();
      
      if (resultLower.includes('trojan')) threatTypes.add('Trojan');
      if (resultLower.includes('virus')) threatTypes.add('Virus');
      if (resultLower.includes('malware')) threatTypes.add('Malware');
      if (resultLower.includes('adware')) threatTypes.add('Adware');
      if (resultLower.includes('spyware')) threatTypes.add('Spyware');
      if (resultLower.includes('ransomware')) threatTypes.add('Ransomware');
      if (resultLower.includes('phishing')) threatTypes.add('Phishing');
      if (resultLower.includes('suspicious')) threatTypes.add('Suspicious Activity');
    }
  });
  
  return Array.from(threatTypes);
};

/**
 * Generates recommendations based on verdict and threat types
 */
const generateRecommendations = (verdict: ScanVerdict, threatTypes: string[]): string[] => {
  const recommendations: string[] = [];
  
  switch (verdict) {
    case 'malicious':
      recommendations.push('🚨 Do not open or execute this file');
      recommendations.push('🗑️ Delete the file immediately');
      recommendations.push('🛡️ Run a full system scan');
      recommendations.push('🔄 Update your antivirus software');
      break;
      
    case 'suspicious':
      recommendations.push('⚠️ Exercise extreme caution');
      recommendations.push('🔍 Scan with additional security tools');
      recommendations.push('🚫 Avoid opening in production environments');
      recommendations.push('👥 Consult with security team if available');
      break;
      
    case 'harmless':
      recommendations.push('✅ File appears to be safe');
      recommendations.push('🔄 Keep security software updated');
      recommendations.push('📊 Monitor for any unusual behavior');
      break;
      
    default:
      recommendations.push('❓ Unable to determine threat level');
      recommendations.push('🔍 Consider additional scanning');
      recommendations.push('⚠️ Proceed with caution');
  }
  
  // Add specific recommendations based on threat types
  if (threatTypes.includes('Phishing')) {
    recommendations.push('🎣 Verify sender authenticity before taking action');
  }
  
  if (threatTypes.includes('Ransomware')) {
    recommendations.push('💾 Ensure backups are current and isolated');
  }
  
  return recommendations;
};

/**
 * Creates mock scan result for testing
 */
export const createMockScanResult = (
  targetName: string,
  targetType: ScanType,
  scanMode: ScanMode
): ScanResult => {
  const mockVerdicts: ScanVerdict[] = ['harmless', 'suspicious', 'malicious'];
  const verdict = mockVerdicts[Math.floor(Math.random() * mockVerdicts.length)];
  
  return {
    id: `mock-${Date.now()}`,
    targetName,
    targetType,
    verdict,
    riskScore: Math.floor(Math.random() * 100),
    confidence: Math.floor(Math.random() * 100),
    threatTypes: verdict === 'harmless' ? [] : ['Mock Threat', 'Test Detection'],
    recommendations: generateRecommendations(verdict, []),
    createdAt: new Date().toISOString(),
    scanMode,
    isTestData: true,
  };
};
