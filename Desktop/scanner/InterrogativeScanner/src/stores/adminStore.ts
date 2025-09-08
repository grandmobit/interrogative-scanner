/**
 * Admin Store - Manages admin authentication, users, APIs, threats, and support
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'general_user' | 'security_analyst';
  isActive: boolean;
  lastLogin: string;
  registeredAt: string;
  scanCount: number;
  threatsReported: number;
}

export interface APIConfig {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  provider: string;
  status: 'active' | 'inactive' | 'error';
  lastUpdated: string;
  requestCount: number;
  errorRate: number;
  description: string;
}

export interface ThreatSignature {
  id: string;
  name: string;
  type: 'malware' | 'phishing' | 'scam' | 'suspicious';
  signature: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  isActive: boolean;
  detectionCount: number;
}

export interface FeatureUpdate {
  id: string;
  title: string;
  description: string;
  version: string;
  type: 'security_patch' | 'new_feature' | 'bug_fix' | 'threat_response';
  status: 'draft' | 'testing' | 'approved' | 'deployed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  createdAt: string;
  deployedAt?: string;
  affectedUsers: number;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'security' | 'billing' | 'feature_request' | 'bug_report';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  userId: string;
  userName: string;
  userEmail: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  sender: 'user' | 'admin';
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface AdminStore {
  // Authentication
  isAdminAuthenticated: boolean;
  currentAdmin: AdminUser | null;
  
  // Data
  appUsers: AppUser[];
  apiConfigs: APIConfig[];
  threatSignatures: ThreatSignature[];
  featureUpdates: FeatureUpdate[];
  supportTickets: SupportTicket[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  activeModule: 'dashboard' | 'users' | 'apis' | 'threats' | 'features' | 'support';
  
  // Actions - Authentication
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  
  // Actions - User Management
  addUser: (user: Omit<AppUser, 'id' | 'registeredAt'>) => void;
  updateUser: (id: string, updates: Partial<AppUser>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  
  // Actions - API Management
  addAPIConfig: (config: Omit<APIConfig, 'id' | 'lastUpdated' | 'requestCount' | 'errorRate'>) => void;
  updateAPIConfig: (id: string, updates: Partial<APIConfig>) => void;
  deleteAPIConfig: (id: string) => void;
  testAPIConnection: (id: string) => Promise<boolean>;
  
  // Actions - Threat Management
  addThreatSignature: (signature: Omit<ThreatSignature, 'id' | 'createdAt' | 'lastUpdated' | 'detectionCount'>) => void;
  updateThreatSignature: (id: string, updates: Partial<ThreatSignature>) => void;
  deleteThreatSignature: (id: string) => void;
  approveCommunityThreat: (reportId: string) => void;
  rejectCommunityThreat: (reportId: string) => void;
  
  // Actions - Feature Management
  addFeatureUpdate: (update: Omit<FeatureUpdate, 'id' | 'createdAt' | 'affectedUsers'>) => void;
  updateFeatureStatus: (id: string, status: FeatureUpdate['status']) => void;
  deployFeature: (id: string) => void;
  
  // Actions - Support Management
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  assignTicket: (id: string, adminId: string) => void;
  addSupportMessage: (ticketId: string, content: string, sender: 'user' | 'admin', senderName: string) => void;
  
  // Actions - UI
  setActiveModule: (module: AdminStore['activeModule']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Initialize data
  initializeAdminData: () => void;
}

const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAdminAuthenticated: false,
      currentAdmin: null,
      appUsers: [],
      apiConfigs: [],
      threatSignatures: [],
      featureUpdates: [],
      supportTickets: [],
      isLoading: false,
      error: null,
      activeModule: 'dashboard',

      // Authentication
      adminLogin: async (username: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock authentication - in real app, validate against backend
        const validCredentials = [
          { username: 'Eltin', password: '651155537', role: 'super_admin' as const },
          { username: 'admin', password: 'admin123', role: 'super_admin' as const },
          { username: 'moderator', password: 'mod123', role: 'moderator' as const }
        ];
        
        const admin = validCredentials.find(cred => 
          cred.username === username && cred.password === password
        );
        
        if (admin) {
          const adminUser: AdminUser = {
            id: `admin_${Date.now()}`,
            username: admin.username,
            email: `${admin.username}@secureapp.com`,
            role: admin.role,
            permissions: admin.role === 'super_admin' 
              ? ['all'] 
              : ['user_management', 'threat_management', 'support'],
            lastLogin: new Date().toISOString(),
            isActive: true,
            createdAt: new Date().toISOString()
          };
          
          set({ 
            isAdminAuthenticated: true, 
            currentAdmin: adminUser,
            isLoading: false,
            error: null 
          });
          return true;
        } else {
          set({ 
            isLoading: false, 
            error: 'Invalid credentials' 
          });
          return false;
        }
      },

      adminLogout: () => {
        set({ 
          isAdminAuthenticated: false, 
          currentAdmin: null,
          activeModule: 'dashboard'
        });
      },

      // User Management
      addUser: (userData) => {
        const newUser: AppUser = {
          ...userData,
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          registeredAt: new Date().toISOString()
        };
        
        set((state) => ({
          appUsers: [...state.appUsers, newUser]
        }));
        
        // Log the activity for admin tracking
        console.log(`New user registered: ${newUser.name} (${newUser.email})`);
      },

      updateUser: (id, updates) => {
        set((state) => ({
          appUsers: state.appUsers.map(user =>
            user.id === id ? { ...user, ...updates } : user
          )
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          appUsers: state.appUsers.filter(user => user.id !== id)
        }));
      },

      toggleUserStatus: (id) => {
        set((state) => ({
          appUsers: state.appUsers.map(user =>
            user.id === id ? { ...user, isActive: !user.isActive } : user
          )
        }));
      },

      // API Management
      addAPIConfig: (configData) => {
        const newConfig: APIConfig = {
          ...configData,
          id: `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          lastUpdated: new Date().toISOString(),
          requestCount: 0,
          errorRate: 0
        };
        
        set((state) => ({
          apiConfigs: [...state.apiConfigs, newConfig]
        }));
      },

      updateAPIConfig: (id, updates) => {
        set((state) => ({
          apiConfigs: state.apiConfigs.map(config =>
            config.id === id ? { ...config, ...updates, lastUpdated: new Date().toISOString() } : config
          )
        }));
      },

      deleteAPIConfig: (id) => {
        set((state) => ({
          apiConfigs: state.apiConfigs.filter(config => config.id !== id)
        }));
      },

      testAPIConnection: async (id) => {
        set({ isLoading: true });
        
        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const success = Math.random() > 0.3; // 70% success rate
        
        set((state) => ({
          apiConfigs: state.apiConfigs.map(config =>
            config.id === id ? { 
              ...config, 
              status: success ? 'active' : 'error',
              lastUpdated: new Date().toISOString()
            } : config
          ),
          isLoading: false
        }));
        
        return success;
      },

      // Threat Management
      addThreatSignature: (signatureData) => {
        const newSignature: ThreatSignature = {
          ...signatureData,
          id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          detectionCount: 0
        };
        
        set((state) => ({
          threatSignatures: [...state.threatSignatures, newSignature]
        }));
      },

      updateThreatSignature: (id, updates) => {
        set((state) => ({
          threatSignatures: state.threatSignatures.map(signature =>
            signature.id === id ? { ...signature, ...updates, lastUpdated: new Date().toISOString() } : signature
          )
        }));
      },

      deleteThreatSignature: (id) => {
        set((state) => ({
          threatSignatures: state.threatSignatures.filter(signature => signature.id !== id)
        }));
      },

      approveCommunityThreat: (reportId) => {
        // This would integrate with communityStore to approve reports
        console.log('Approving community threat report:', reportId);
      },

      rejectCommunityThreat: (reportId) => {
        // This would integrate with communityStore to reject reports
        console.log('Rejecting community threat report:', reportId);
      },

      // Feature Management
      addFeatureUpdate: (updateData) => {
        const newUpdate: FeatureUpdate = {
          ...updateData,
          id: `feature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          affectedUsers: 0
        };
        
        set((state) => ({
          featureUpdates: [...state.featureUpdates, newUpdate]
        }));
      },

      updateFeatureStatus: (id, status) => {
        set((state) => ({
          featureUpdates: state.featureUpdates.map(update =>
            update.id === id ? { ...update, status } : update
          )
        }));
      },

      deployFeature: (id) => {
        set((state) => ({
          featureUpdates: state.featureUpdates.map(update =>
            update.id === id ? { 
              ...update, 
              status: 'deployed',
              deployedAt: new Date().toISOString(),
              affectedUsers: Math.floor(Math.random() * 10000) + 1000
            } : update
          )
        }));
      },

      // Support Management
      createSupportTicket: (ticketData) => {
        const newTicket: SupportTicket = {
          ...ticketData,
          id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: []
        };
        
        set((state) => ({
          supportTickets: [...state.supportTickets, newTicket]
        }));
      },

      updateTicketStatus: (id, status) => {
        set((state) => ({
          supportTickets: state.supportTickets.map(ticket =>
            ticket.id === id ? { ...ticket, status, updatedAt: new Date().toISOString() } : ticket
          )
        }));
      },

      assignTicket: (id, adminId) => {
        set((state) => ({
          supportTickets: state.supportTickets.map(ticket =>
            ticket.id === id ? { ...ticket, assignedTo: adminId, updatedAt: new Date().toISOString() } : ticket
          )
        }));
      },

      addSupportMessage: (ticketId, content, sender, senderName) => {
        const newMessage: SupportMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ticketId,
          sender,
          senderName,
          content,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        
        set((state) => ({
          supportTickets: state.supportTickets.map(ticket =>
            ticket.id === ticketId ? { 
              ...ticket, 
              messages: [...ticket.messages, newMessage],
              updatedAt: new Date().toISOString()
            } : ticket
          )
        }));
      },

      // UI Actions
      setActiveModule: (activeModule) => set({ activeModule }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Initialize mock data
      initializeAdminData: () => {
        const demoAdmins = [
          {
            id: 'admin-1',
            username: 'Eltin',
            password: '651155537', // In production, this would be hashed
            role: 'super_admin',
            email: 'eltin@cybersec.com',
            name: 'Eltin Administrator',
            lastLogin: new Date().toISOString(),
            isActive: true
          },
          {
            id: 'admin-2',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            email: 'admin@cybersec.com',
            name: 'System Administrator',
            lastLogin: new Date(Date.now() - 86400000).toISOString(),
            isActive: true
          },
          {
            id: 'admin-3',
            username: 'moderator',
            password: 'mod123',
            role: 'moderator',
            email: 'moderator@cybersec.com',
            name: 'Community Moderator',
            lastLogin: new Date(Date.now() - 172800000).toISOString(),
            isActive: true
          }
        ];

        const mockUsers: AppUser[] = [
          {
            id: 'user_1',
            name: 'ndinkeh318',
            email: 'ndinkeh318@email.com',
            role: 'general_user',
            isActive: true,
            lastLogin: new Date().toISOString(),
            registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            scanCount: 12,
            threatsReported: 0
          }
        ];

        const mockAPIs: APIConfig[] = [
          {
            id: 'api_1',
            name: 'VirusTotal API',
            endpoint: 'https://www.virustotal.com/vtapi/v2/',
            apiKey: 'vt_****************************',
            provider: 'VirusTotal',
            status: 'active',
            lastUpdated: new Date().toISOString(),
            requestCount: 12,
            errorRate: 0.00,
            description: 'Primary threat detection API for file and URL scanning'
          }
        ];

        const mockThreats: ThreatSignature[] = [
          {
            id: 'threat_1',
            name: 'Banking Trojan Signature',
            type: 'malware',
            signature: 'MD5:a1b2c3d4e5f6789012345678901234567890',
            severity: 'critical',
            description: 'Detects banking trojans targeting financial institutions',
            createdBy: 'admin',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastUpdated: new Date().toISOString(),
            isActive: true,
            detectionCount: 156
          },
          {
            id: 'threat_2',
            name: 'Phishing Domain Pattern',
            type: 'phishing',
            signature: 'REGEX:.*-[a-z]{2,4}\\.(tk|ml|ga|cf)$',
            severity: 'high',
            description: 'Detects suspicious domain patterns commonly used in phishing',
            createdBy: 'security_analyst',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            detectionCount: 89
          }
        ];

        const mockFeatures: FeatureUpdate[] = [
          {
            id: 'feature_1',
            title: 'Enhanced Real-time Scanning',
            description: 'Improved real-time file system monitoring with ML-based detection',
            version: '2.1.0',
            type: 'new_feature',
            status: 'deployed',
            priority: 'high',
            createdBy: 'admin',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            deployedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            affectedUsers: 8456
          },
          {
            id: 'feature_2',
            title: 'Zero-Day Threat Response',
            description: 'Emergency patch for newly discovered zero-day vulnerability',
            version: '2.0.3',
            type: 'security_patch',
            status: 'testing',
            priority: 'critical',
            createdBy: 'admin',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            affectedUsers: 0
          }
        ];

        const mockTickets: SupportTicket[] = [];

        set({
          appUsers: mockUsers,
          apiConfigs: mockAPIs,
          threatSignatures: mockThreats,
          featureUpdates: mockFeatures,
          supportTickets: mockTickets
        });
      }
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
        currentAdmin: state.currentAdmin,
        appUsers: state.appUsers,
        apiConfigs: state.apiConfigs,
        threatSignatures: state.threatSignatures,
        featureUpdates: state.featureUpdates,
        supportTickets: state.supportTickets
      })
    }
  )
);

export default useAdminStore;
