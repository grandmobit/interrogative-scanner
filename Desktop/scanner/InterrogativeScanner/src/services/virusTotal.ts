/**
 * VirusTotal API service for Interrogative Scanner
 * Handles file and URL scanning with Express and Comprehensive modes
 */

import { VT_API_KEY, TEST_MODE } from '@env';
import { ScanResult, ScanMode, ScanType, VirusTotalResponse } from '../types';
import { mapVirusTotalResponse, createMockScanResult } from '../utils/mapping';

const VT_BASE_URL = 'https://www.virustotal.com/api/v3';
const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_POLLING_ATTEMPTS = 30; // 60 seconds total

/**
 * VirusTotal API service class
 */
class VirusTotalService {
  private apiKey: string;
  private testMode: boolean;

  constructor() {
    this.apiKey = VT_API_KEY;
    this.testMode = TEST_MODE === 'true';
  }

  /**
   * Express file scan - quick analysis with minimal fields
   */
  async scanFileExpress(fileUri: string, fileName: string): Promise<ScanResult> {
    if (this.testMode) {
      return createMockScanResult(fileName, 'file', 'express');
    }

    try {
      const uploadResponse = await this.uploadFile(fileUri, fileName);
      const analysisId = uploadResponse.data.id;
      
      // For express mode, wait briefly then return basic results
      await this.delay(3000);
      
      const report = await this.getAnalysisReport(analysisId, false);
      return mapVirusTotalResponse(report, fileName, 'file', 'express');
    } catch (error) {
      console.error('Express file scan failed:', error);
      throw new Error('Failed to scan file. Please check your connection and try again.');
    }
  }

  /**
   * Comprehensive file scan - full analysis with detailed results
   */
  async scanFileComprehensive(fileUri: string, fileName: string): Promise<ScanResult> {
    if (this.testMode) {
      return createMockScanResult(fileName, 'file', 'comprehensive');
    }

    try {
      const uploadResponse = await this.uploadFile(fileUri, fileName);
      const analysisId = uploadResponse.data.id;
      
      // For comprehensive mode, wait for full analysis
      const report = await this.getAnalysisReport(analysisId, true);
      return mapVirusTotalResponse(report, fileName, 'file', 'comprehensive');
    } catch (error) {
      console.error('Comprehensive file scan failed:', error);
      throw new Error('Failed to scan file comprehensively. Please try again.');
    }
  }

  /**
   * Express URL scan - quick URL analysis
   */
  async scanUrlExpress(url: string): Promise<ScanResult> {
    if (this.testMode) {
      return createMockScanResult(url, 'url', 'express');
    }

    try {
      const submitResponse = await this.submitUrl(url);
      const analysisId = submitResponse.data.id;
      
      // For express mode, wait briefly then return basic results
      await this.delay(3000);
      
      const report = await this.getAnalysisReport(analysisId, false);
      return mapVirusTotalResponse(report, url, 'url', 'express', url);
    } catch (error) {
      console.error('Express URL scan failed:', error);
      throw new Error('Failed to scan URL. Please check the URL and try again.');
    }
  }

  /**
   * Comprehensive URL scan - full URL analysis
   */
  async scanUrlComprehensive(url: string): Promise<ScanResult> {
    if (this.testMode) {
      return createMockScanResult(url, 'url', 'comprehensive');
    }

    try {
      const submitResponse = await this.submitUrl(url);
      const analysisId = submitResponse.data.id;
      
      // For comprehensive mode, wait for full analysis
      const report = await this.getAnalysisReport(analysisId, true);
      return mapVirusTotalResponse(report, url, 'url', 'comprehensive', url);
    } catch (error) {
      console.error('Comprehensive URL scan failed:', error);
      throw new Error('Failed to scan URL comprehensively. Please try again.');
    }
  }

  /**
   * Upload file to VirusTotal
   */
  private async uploadFile(fileUri: string, fileName: string): Promise<{ data: { id: string } }> {
    const formData = new FormData();
    
    // Create file object for React Native
    const fileObject = {
      uri: fileUri,
      type: 'application/octet-stream',
      name: fileName,
    } as any;
    
    formData.append('file', fileObject);

    const response = await fetch(`${VT_BASE_URL}/files`, {
      method: 'POST',
      headers: {
        'x-apikey': this.apiKey,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Submit URL for analysis
   */
  private async submitUrl(url: string): Promise<{ data: { id: string } }> {
    const formData = new FormData();
    formData.append('url', url);

    const response = await fetch(`${VT_BASE_URL}/urls`, {
      method: 'POST',
      headers: {
        'x-apikey': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${encodeURIComponent(url)}`,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`URL submission failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get analysis report with optional polling
   */
  private async getAnalysisReport(analysisId: string, waitForCompletion: boolean): Promise<VirusTotalResponse> {
    let attempts = 0;
    
    while (attempts < MAX_POLLING_ATTEMPTS) {
      const response = await fetch(`${VT_BASE_URL}/analyses/${analysisId}`, {
        headers: {
          'x-apikey': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Analysis retrieval failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if analysis is complete
      if (data.data.attributes.status === 'completed') {
        // Get the actual file/URL report
        const resourceId = data.data.attributes.resource_id || data.data.id;
        return this.getResourceReport(resourceId);
      }
      
      // If not waiting for completion (express mode), return partial results
      if (!waitForCompletion && attempts >= 1) {
        const resourceId = data.data.attributes.resource_id || data.data.id;
        try {
          return this.getResourceReport(resourceId);
        } catch {
          // If resource report not ready, create minimal response
          return this.createMinimalResponse(analysisId);
        }
      }
      
      attempts++;
      await this.delay(POLLING_INTERVAL);
    }
    
    throw new Error('Analysis timed out. Please try again later or check results in Dashboard.');
  }

  /**
   * Get resource report (file or URL)
   */
  private async getResourceReport(resourceId: string): Promise<VirusTotalResponse> {
    // Try file report first, then URL report
    let response = await fetch(`${VT_BASE_URL}/files/${resourceId}`, {
      headers: {
        'x-apikey': this.apiKey,
      },
    });

    if (!response.ok) {
      // Try URL report
      response = await fetch(`${VT_BASE_URL}/urls/${resourceId}`, {
        headers: {
          'x-apikey': this.apiKey,
        },
      });
    }

    if (!response.ok) {
      throw new Error(`Resource report retrieval failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create minimal response for incomplete analysis
   */
  private createMinimalResponse(analysisId: string): VirusTotalResponse {
    return {
      data: {
        id: analysisId,
        type: 'analysis',
        attributes: {
          stats: {
            harmless: 0,
            malicious: 0,
            suspicious: 0,
            undetected: 1,
          },
          last_analysis_results: {
            'Pending': {
              category: 'undetected',
              engine_name: 'Analysis',
              result: 'Analysis in progress',
            },
          },
          reputation: 0,
        },
      },
    };
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check API connectivity
   */
  async checkApiStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${VT_BASE_URL}/users/${this.apiKey}`, {
        headers: {
          'x-apikey': this.apiKey,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const virusTotalService = new VirusTotalService();
