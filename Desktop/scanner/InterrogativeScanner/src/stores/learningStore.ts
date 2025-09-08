/**
 * Learning Store - Manages videos, documents, bookmarks, and search functionality
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  channel: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  views: string;
  publishedAt: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'Guide' | 'Whitepaper' | 'Checklist';
  downloadUrl: string;
  fileSize: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  author: string;
  pages?: number;
}

interface LearningStore {
  videos: Video[];
  documents: Document[];
  bookmarkedVideos: string[];
  bookmarkedDocuments: string[];
  searchQuery: string;
  selectedFilter: 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
  activeTab: 'Videos' | 'Documents' | 'My Library';
  isLoading: boolean;
  error: string | null;

  // Actions
  setVideos: (videos: Video[]) => void;
  setDocuments: (documents: Document[]) => void;
  toggleVideoBookmark: (videoId: string) => void;
  toggleDocumentBookmark: (documentId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: 'All' | 'Beginner' | 'Intermediate' | 'Advanced') => void;
  setActiveTab: (tab: 'Videos' | 'Documents' | 'My Library') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getFilteredVideos: () => Video[];
  getFilteredDocuments: () => Document[];
  getBookmarkedVideos: () => Video[];
  getBookmarkedDocuments: () => Document[];
  
  // Initialize data
  initializeData: () => void;
}

const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      videos: [],
      documents: [],
      bookmarkedVideos: [],
      bookmarkedDocuments: [],
      searchQuery: '',
      selectedFilter: 'All',
      activeTab: 'Videos',
      isLoading: false,
      error: null,

      setVideos: (videos) => set({ videos }),
      setDocuments: (documents) => set({ documents }),

      toggleVideoBookmark: (videoId) => {
        const { bookmarkedVideos } = get();
        const isBookmarked = bookmarkedVideos.includes(videoId);
        
        set({
          bookmarkedVideos: isBookmarked
            ? bookmarkedVideos.filter(id => id !== videoId)
            : [...bookmarkedVideos, videoId]
        });
      },

      toggleDocumentBookmark: (documentId) => {
        const { bookmarkedDocuments } = get();
        const isBookmarked = bookmarkedDocuments.includes(documentId);
        
        set({
          bookmarkedDocuments: isBookmarked
            ? bookmarkedDocuments.filter(id => id !== documentId)
            : [...bookmarkedDocuments, documentId]
        });
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedFilter: (selectedFilter) => set({ selectedFilter }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      getFilteredVideos: () => {
        const { videos, searchQuery, selectedFilter } = get();
        
        return videos.filter(video => {
          const matchesSearch = searchQuery === '' || 
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          
          const matchesFilter = selectedFilter === 'All' || video.difficulty === selectedFilter;
          
          return matchesSearch && matchesFilter;
        });
      },

      getFilteredDocuments: () => {
        const { documents, searchQuery, selectedFilter } = get();
        
        return documents.filter(document => {
          const matchesSearch = searchQuery === '' || 
            document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            document.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            document.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          
          const matchesFilter = selectedFilter === 'All' || document.difficulty === selectedFilter;
          
          return matchesSearch && matchesFilter;
        });
      },

      getBookmarkedVideos: () => {
        const { videos, bookmarkedVideos } = get();
        return videos.filter(video => bookmarkedVideos.includes(video.id));
      },

      getBookmarkedDocuments: () => {
        const { documents, bookmarkedDocuments } = get();
        return documents.filter(document => bookmarkedDocuments.includes(document.id));
      },

      initializeData: () => {
        const mockVideos: Video[] = [
          {
            id: '1',
            title: 'Ethical Hacking Full Course - Learn Ethical Hacking in 10 Hours',
            description: 'Complete ethical hacking course covering penetration testing, vulnerability assessment, and security tools.',
            youtubeId: 'fNzpcB7ODxQ',
            thumbnail: 'https://img.youtube.com/vi/fNzpcB7ODxQ/maxresdefault.jpg',
            channel: 'Edureka!',
            duration: '10:15:30',
            difficulty: 'Beginner',
            tags: ['ethical hacking', 'penetration testing', 'cybersecurity'],
            views: '2.1M',
            publishedAt: '2021-03-15'
          },
          {
            id: '2',
            title: 'you need to learn Cybersecurity RIGHT NOW!! (2024)',
            description: 'NetworkChuck explains why cybersecurity is crucial and how to get started in the field.',
            youtubeId: 'nzZkKoREEGo',
            thumbnail: 'https://img.youtube.com/vi/nzZkKoREEGo/maxresdefault.jpg',
            channel: 'NetworkChuck',
            duration: '15:42',
            difficulty: 'Beginner',
            tags: ['cybersecurity career', 'getting started', 'security basics'],
            views: '1.8M',
            publishedAt: '2024-01-10'
          },
          {
            id: '3',
            title: 'Malware Analysis for Beginners',
            description: 'John Hammond walks through basic malware analysis techniques and tools.',
            youtubeId: 'p7f4dOE4pXE',
            thumbnail: 'https://img.youtube.com/vi/p7f4dOE4pXE/maxresdefault.jpg',
            channel: 'John Hammond',
            duration: '28:15',
            difficulty: 'Intermediate',
            tags: ['malware analysis', 'reverse engineering', 'security research'],
            views: '456K',
            publishedAt: '2023-09-22'
          },
          {
            id: '4',
            title: 'Complete Python Ethical Hacking Course',
            description: 'Learn to build ethical hacking tools with Python programming.',
            youtubeId: 'WnN6dbos5u4',
            thumbnail: 'https://img.youtube.com/vi/WnN6dbos5u4/maxresdefault.jpg',
            channel: 'Tech With Tim',
            duration: '3:45:20',
            difficulty: 'Intermediate',
            tags: ['python', 'ethical hacking', 'programming', 'security tools'],
            views: '892K',
            publishedAt: '2023-06-08'
          },
          {
            id: '5',
            title: 'Advanced Penetration Testing Techniques',
            description: 'The Cyber Mentor covers advanced pentesting methodologies and real-world scenarios.',
            youtubeId: 'xl2Xx5YOKcI',
            thumbnail: 'https://img.youtube.com/vi/xl2Xx5YOKcI/maxresdefault.jpg',
            channel: 'The Cyber Mentor',
            duration: '1:52:30',
            difficulty: 'Advanced',
            tags: ['penetration testing', 'advanced techniques', 'red team'],
            views: '324K',
            publishedAt: '2023-11-15'
          },
          {
            id: '6',
            title: 'Network Security Fundamentals',
            description: 'Comprehensive guide to network security concepts and implementation.',
            youtubeId: 'qiQR5rTSshw',
            thumbnail: 'https://img.youtube.com/vi/qiQR5rTSshw/maxresdefault.jpg',
            channel: 'Professor Messer',
            duration: '45:18',
            difficulty: 'Beginner',
            tags: ['network security', 'fundamentals', 'networking'],
            views: '678K',
            publishedAt: '2023-04-12'
          },
          {
            id: '7',
            title: 'Social Engineering Attacks Explained',
            description: 'Understanding social engineering tactics and how to defend against them.',
            youtubeId: 'lc7scxvKQOo',
            thumbnail: 'https://img.youtube.com/vi/lc7scxvKQOo/maxresdefault.jpg',
            channel: 'NetworkChuck',
            duration: '22:35',
            difficulty: 'Intermediate',
            tags: ['social engineering', 'phishing', 'human factor'],
            views: '543K',
            publishedAt: '2023-08-20'
          },
          {
            id: '8',
            title: 'Bug Bounty Hunting for Beginners',
            description: 'Complete guide to getting started in bug bounty hunting and ethical disclosure.',
            youtubeId: 'CU9Iafc-Igs',
            thumbnail: 'https://img.youtube.com/vi/CU9Iafc-Igs/maxresdefault.jpg',
            channel: 'STÖK',
            duration: '1:15:45',
            difficulty: 'Intermediate',
            tags: ['bug bounty', 'web security', 'vulnerability research'],
            views: '287K',
            publishedAt: '2023-07-03'
          },
          {
            id: '9',
            title: 'Incident Response and Digital Forensics',
            description: 'Learn incident response procedures and digital forensics techniques.',
            youtubeId: '2MHspM_a6w4',
            thumbnail: 'https://img.youtube.com/vi/2MHspM_a6w4/maxresdefault.jpg',
            channel: '13Cubed',
            duration: '58:22',
            difficulty: 'Advanced',
            tags: ['incident response', 'digital forensics', 'investigation'],
            views: '198K',
            publishedAt: '2023-10-08'
          },
          {
            id: '10',
            title: 'Cloud Security Best Practices',
            description: 'Essential cloud security practices for AWS, Azure, and Google Cloud.',
            youtubeId: 'hiKPPy584Mg',
            thumbnail: 'https://img.youtube.com/vi/hiKPPy584Mg/maxresdefault.jpg',
            channel: 'Cloud Security Podcast',
            duration: '42:18',
            difficulty: 'Advanced',
            tags: ['cloud security', 'AWS', 'Azure', 'best practices'],
            views: '156K',
            publishedAt: '2023-12-01'
          }
        ];

        const mockDocuments: Document[] = [
          {
            id: '1',
            title: 'NIST Cybersecurity Framework Guide',
            description: 'Comprehensive guide to implementing the NIST Cybersecurity Framework in organizations.',
            type: 'Guide',
            downloadUrl: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.04162018.pdf',
            fileSize: '3.2 MB',
            difficulty: 'Intermediate',
            tags: ['NIST', 'framework', 'compliance', 'governance'],
            author: 'NIST',
            pages: 41
          },
          {
            id: '2',
            title: 'CISA Phishing Prevention Guide',
            description: 'Essential guide for preventing phishing attacks in your organization.',
            type: 'Guide',
            downloadUrl: 'https://www.cisa.gov/sites/default/files/publications/Phishing_Guide_2021_508.pdf',
            fileSize: '1.8 MB',
            difficulty: 'Beginner',
            tags: ['phishing', 'prevention', 'email security', 'awareness'],
            author: 'CISA',
            pages: 12
          },
          {
            id: '3',
            title: 'SANS Malware Analysis Fundamentals',
            description: 'Fundamental techniques for malware analysis and reverse engineering.',
            type: 'Whitepaper',
            downloadUrl: 'https://www.sans.org/white-papers/2040/',
            fileSize: '2.1 MB',
            difficulty: 'Advanced',
            tags: ['malware analysis', 'reverse engineering', 'threat intelligence'],
            author: 'SANS Institute',
            pages: 28
          },
          {
            id: '4',
            title: 'NIST Incident Response Guide',
            description: 'Computer security incident handling guide from NIST.',
            type: 'Guide',
            downloadUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf',
            fileSize: '4.1 MB',
            difficulty: 'Intermediate',
            tags: ['incident response', 'NIST', 'procedures', 'team coordination'],
            author: 'NIST',
            pages: 79
          },
          {
            id: '5',
            title: 'OWASP Testing Guide',
            description: 'Comprehensive web application security testing methodology.',
            type: 'PDF',
            downloadUrl: 'https://owasp.org/www-project-web-security-testing-guide/assets/archive/OWASP_Testing_Guide_v4.pdf',
            fileSize: '2.9 MB',
            difficulty: 'Advanced',
            tags: ['penetration testing', 'OWASP', 'web security', 'assessment'],
            author: 'OWASP',
            pages: 264
          },
          {
            id: '6',
            title: 'Cloud Security Best Practices',
            description: 'Security guidance for cloud computing environments.',
            type: 'Guide',
            downloadUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-144.pdf',
            fileSize: '1.2 MB',
            difficulty: 'Intermediate',
            tags: ['cloud security', 'NIST', 'best practices', 'guidelines'],
            author: 'NIST',
            pages: 80
          },
          {
            id: '7',
            title: 'Social Engineering Awareness',
            description: 'Understanding and defending against social engineering attacks.',
            type: 'Whitepaper',
            downloadUrl: 'https://www.cisa.gov/sites/default/files/publications/Social_Engineering_Awareness_508.pdf',
            fileSize: '1.5 MB',
            difficulty: 'Beginner',
            tags: ['social engineering', 'awareness', 'training', 'CISA'],
            author: 'CISA',
            pages: 16
          },
          {
            id: '8',
            title: 'Zero Trust Architecture',
            description: 'NIST guidance on Zero Trust security architecture.',
            type: 'Guide',
            downloadUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf',
            fileSize: '3.8 MB',
            difficulty: 'Advanced',
            tags: ['zero trust', 'NIST', 'architecture', 'implementation'],
            author: 'NIST',
            pages: 59
          }
        ];

        set({ videos: mockVideos, documents: mockDocuments });
      }
    }),
    {
      name: 'learning-store',
      partialize: (state) => ({
        bookmarkedVideos: state.bookmarkedVideos,
        bookmarkedDocuments: state.bookmarkedDocuments,
        videos: state.videos,
        documents: state.documents,
      }),
    }
  )
);

export default useLearningStore;
