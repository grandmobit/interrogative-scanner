/**
 * Community Store - Manages crowdsourced threat reports and community features
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThreatReport {
  id: string;
  title: string;
  description: string;
  threatType: 'Malware' | 'Phishing' | 'Scam' | 'Suspicious URL' | 'Fake App' | 'Data Breach' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  url?: string;
  fileHash?: string;
  fileName?: string;
  reportedBy: string;
  reportedAt: string;
  location?: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  verified: boolean;
  status: 'pending' | 'verified' | 'rejected' | 'investigating';
  comments: ThreatComment[];
  evidence?: {
    screenshots?: string[];
    logs?: string;
    additionalInfo?: string;
  };
}

export interface ThreatComment {
  id: string;
  reportId: string;
  author: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface CommunityStats {
  totalReports: number;
  verifiedReports: number;
  activeUsers: number;
  threatsBlocked: number;
  topContributors: Array<{
    username: string;
    reportsCount: number;
    reputation: number;
  }>;
}

interface CommunityStore {
  // State
  threatReports: ThreatReport[];
  myReports: string[];
  upvotedReports: string[];
  downvotedReports: string[];
  followedUsers: string[];
  communityStats: CommunityStats;
  isLoading: boolean;
  error: string | null;
  
  // Filters and search
  searchQuery: string;
  selectedThreatType: string;
  selectedSeverity: string;
  sortBy: 'recent' | 'popular' | 'severity' | 'verified';
  
  // Actions
  addThreatReport: (report: Omit<ThreatReport, 'id' | 'reportedAt' | 'upvotes' | 'downvotes' | 'verified' | 'status' | 'comments'>) => void;
  updateThreatReport: (id: string, updates: Partial<ThreatReport>) => void;
  deleteThreatReport: (id: string) => void;
  upvoteReport: (reportId: string) => void;
  downvoteReport: (reportId: string) => void;
  addComment: (reportId: string, content: string, author: string) => void;
  setSearchQuery: (query: string) => void;
  setThreatTypeFilter: (type: string) => void;
  setSeverityFilter: (severity: string) => void;
  setSortBy: (sort: 'recent' | 'popular' | 'severity' | 'verified') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getFilteredReports: () => ThreatReport[];
  getMyReports: () => ThreatReport[];
  getVerifiedReports: () => ThreatReport[];
  getTrendingReports: () => ThreatReport[];
  
  // Initialize data
  initializeCommunityData: () => void;
}

const useCommunityStore = create<CommunityStore>()(
  persist(
    (set, get) => ({
      // Initial state
      threatReports: [],
      myReports: [],
      upvotedReports: [],
      downvotedReports: [],
      followedUsers: [],
      communityStats: {
        totalReports: 0,
        verifiedReports: 0,
        activeUsers: 0,
        threatsBlocked: 0,
        topContributors: []
      },
      isLoading: false,
      error: null,
      searchQuery: '',
      selectedThreatType: 'All',
      selectedSeverity: 'All',
      sortBy: 'recent',

      // Actions
      addThreatReport: (reportData) => {
        const newReport: ThreatReport = {
          ...reportData,
          id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          reportedAt: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
          verified: false,
          status: 'pending',
          comments: []
        };

        set((state) => ({
          threatReports: [newReport, ...state.threatReports],
          myReports: [newReport.id, ...state.myReports],
          communityStats: {
            ...state.communityStats,
            totalReports: state.communityStats.totalReports + 1
          }
        }));
      },

      updateThreatReport: (id, updates) => {
        set((state) => ({
          threatReports: state.threatReports.map(report =>
            report.id === id ? { ...report, ...updates } : report
          )
        }));
      },

      deleteThreatReport: (id) => {
        set((state) => ({
          threatReports: state.threatReports.filter(report => report.id !== id),
          myReports: state.myReports.filter(reportId => reportId !== id)
        }));
      },

      upvoteReport: (reportId) => {
        const { upvotedReports, downvotedReports } = get();
        
        set((state) => {
          const wasUpvoted = upvotedReports.includes(reportId);
          const wasDownvoted = downvotedReports.includes(reportId);
          
          return {
            threatReports: state.threatReports.map(report => {
              if (report.id === reportId) {
                return {
                  ...report,
                  upvotes: wasUpvoted ? report.upvotes - 1 : report.upvotes + 1,
                  downvotes: wasDownvoted ? report.downvotes - 1 : report.downvotes
                };
              }
              return report;
            }),
            upvotedReports: wasUpvoted 
              ? upvotedReports.filter(id => id !== reportId)
              : [...upvotedReports, reportId],
            downvotedReports: wasDownvoted
              ? downvotedReports.filter(id => id !== reportId)
              : downvotedReports
          };
        });
      },

      downvoteReport: (reportId) => {
        const { upvotedReports, downvotedReports } = get();
        
        set((state) => {
          const wasUpvoted = upvotedReports.includes(reportId);
          const wasDownvoted = downvotedReports.includes(reportId);
          
          return {
            threatReports: state.threatReports.map(report => {
              if (report.id === reportId) {
                return {
                  ...report,
                  upvotes: wasUpvoted ? report.upvotes - 1 : report.upvotes,
                  downvotes: wasDownvoted ? report.downvotes - 1 : report.downvotes + 1
                };
              }
              return report;
            }),
            upvotedReports: wasUpvoted 
              ? upvotedReports.filter(id => id !== reportId)
              : upvotedReports,
            downvotedReports: wasDownvoted
              ? downvotedReports.filter(id => id !== reportId)
              : [...downvotedReports, reportId]
          };
        });
      },

      addComment: (reportId, content, author) => {
        const newComment: ThreatComment = {
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          reportId,
          author,
          content,
          createdAt: new Date().toISOString(),
          upvotes: 0
        };

        set((state) => ({
          threatReports: state.threatReports.map(report =>
            report.id === reportId 
              ? { ...report, comments: [...report.comments, newComment] }
              : report
          )
        }));
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setThreatTypeFilter: (selectedThreatType) => set({ selectedThreatType }),
      setSeverityFilter: (selectedSeverity) => set({ selectedSeverity }),
      setSortBy: (sortBy) => set({ sortBy }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Getters
      getFilteredReports: () => {
        const { threatReports, searchQuery, selectedThreatType, selectedSeverity, sortBy } = get();
        
        let filtered = threatReports.filter(report => {
          const matchesSearch = searchQuery === '' || 
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          
          const matchesType = selectedThreatType === 'All' || report.threatType === selectedThreatType;
          const matchesSeverity = selectedSeverity === 'All' || report.severity === selectedSeverity;
          
          return matchesSearch && matchesType && matchesSeverity;
        });

        // Sort results
        switch (sortBy) {
          case 'popular':
            filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
            break;
          case 'severity':
            const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
            filtered.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
            break;
          case 'verified':
            filtered.sort((a, b) => Number(b.verified) - Number(a.verified));
            break;
          default: // recent
            filtered.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
        }

        return filtered;
      },

      getMyReports: () => {
        const { threatReports, myReports } = get();
        return threatReports.filter(report => myReports.includes(report.id));
      },

      getVerifiedReports: () => {
        const { threatReports } = get();
        return threatReports.filter(report => report.verified);
      },

      getTrendingReports: () => {
        const { threatReports } = get();
        return threatReports
          .filter(report => {
            const reportDate = new Date(report.reportedAt);
            const daysSinceReport = (Date.now() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceReport <= 7; // Last 7 days
          })
          .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
          .slice(0, 10);
      },

      initializeCommunityData: () => {
        const mockReports: ThreatReport[] = [
          {
            id: 'report_1',
            title: 'Fake Banking App Stealing Credentials',
            description: 'Discovered a fake mobile banking app that perfectly mimics Chase Bank. It steals login credentials and sends them to external servers.',
            threatType: 'Fake App',
            severity: 'Critical',
            reportedBy: 'SecurityExpert_2024',
            reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            location: 'Google Play Store',
            tags: ['banking', 'credentials', 'mobile', 'phishing'],
            upvotes: 47,
            downvotes: 2,
            verified: true,
            status: 'verified',
            comments: [
              {
                id: 'comment_1',
                reportId: 'report_1',
                author: 'CyberAnalyst',
                content: 'Confirmed! Found the same app. Already reported to Google.',
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                upvotes: 12
              }
            ],
            evidence: {
              additionalInfo: 'App package name: com.chase.bank.fake - Server IP: 185.234.72.45'
            }
          },
          {
            id: 'report_2',
            title: 'Phishing Campaign Targeting Office 365 Users',
            description: 'Large-scale phishing campaign using fake Microsoft login pages. Emails appear to come from IT department requesting password updates.',
            threatType: 'Phishing',
            severity: 'High',
            url: 'https://microsft-office365-login.tk',
            reportedBy: 'ITAdmin_Pro',
            reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            tags: ['office365', 'microsoft', 'email', 'credentials'],
            upvotes: 34,
            downvotes: 1,
            verified: true,
            status: 'verified',
            comments: [
              {
                id: 'comment_2',
                reportId: 'report_2',
                author: 'EmailSecurity',
                content: 'We blocked this domain on our email gateway. Thanks for the report!',
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                upvotes: 8
              }
            ]
          },
          {
            id: 'report_3',
            title: 'Cryptocurrency Scam on Social Media',
            description: 'Fake Elon Musk accounts promoting Bitcoin giveaway scams. Users send crypto to receive double back but never get anything.',
            threatType: 'Scam',
            severity: 'Medium',
            reportedBy: 'CryptoWatcher',
            reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
            location: 'Twitter/X',
            tags: ['cryptocurrency', 'bitcoin', 'social media', 'scam'],
            upvotes: 28,
            downvotes: 3,
            verified: false,
            status: 'investigating',
            comments: []
          },
          {
            id: 'report_4',
            title: 'Malicious Browser Extension',
            description: 'Chrome extension "AdBlock Plus Pro" is actually malware that steals browsing data and injects ads.',
            threatType: 'Malware',
            severity: 'High',
            reportedBy: 'BrowserSec',
            reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            location: 'Chrome Web Store',
            tags: ['browser', 'extension', 'adware', 'data theft'],
            upvotes: 56,
            downvotes: 0,
            verified: true,
            status: 'verified',
            comments: [
              {
                id: 'comment_3',
                reportId: 'report_4',
                author: 'ChromeUser',
                content: 'Just removed this from my browser. Thanks for the warning!',
                createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
                upvotes: 15
              }
            ]
          },
          {
            id: 'report_5',
            title: 'Suspicious URL Shortener Campaign',
            description: 'Multiple shortened URLs (bit.ly/xxx) leading to fake antivirus download pages. Claims computer is infected.',
            threatType: 'Suspicious URL',
            severity: 'Medium',
            url: 'bit.ly/secure-scan-now',
            reportedBy: 'URLAnalyzer',
            reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            tags: ['url shortener', 'fake antivirus', 'scareware'],
            upvotes: 19,
            downvotes: 1,
            verified: false,
            status: 'pending',
            comments: []
          }
        ];

        const mockStats: CommunityStats = {
          totalReports: 1247,
          verifiedReports: 892,
          activeUsers: 3456,
          threatsBlocked: 15678,
          topContributors: [
            { username: 'SecurityExpert_2024', reportsCount: 89, reputation: 2340 },
            { username: 'CyberAnalyst', reportsCount: 67, reputation: 1890 },
            { username: 'ITAdmin_Pro', reportsCount: 54, reputation: 1567 },
            { username: 'BrowserSec', reportsCount: 43, reputation: 1234 },
            { username: 'URLAnalyzer', reportsCount: 38, reputation: 1098 }
          ]
        };

        set({ 
          threatReports: mockReports,
          communityStats: mockStats
        });
      }
    }),
    {
      name: 'community-store',
      partialize: (state) => ({
        threatReports: state.threatReports,
        myReports: state.myReports,
        upvotedReports: state.upvotedReports,
        downvotedReports: state.downvotedReports,
        followedUsers: state.followedUsers,
        communityStats: state.communityStats
      })
    }
  )
);

export default useCommunityStore;
