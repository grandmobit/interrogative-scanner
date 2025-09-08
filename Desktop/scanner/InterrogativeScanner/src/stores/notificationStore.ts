/**
 * Notification Store - Zustand state management for notifications
 * Handles notification CRUD operations, unread counts, and real-time updates
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'safe' | 'threat' | 'warning' | 'info';
  isRead: boolean;
  createdAt: number;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
  
  // Predefined notifications for demo
  initializeDemoNotifications: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: generateId(),
          createdAt: Date.now(),
        };

        set((state) => {
          const updatedNotifications = [newNotification, ...state.notifications];
          const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(notification =>
            notification.id === id ? { ...notification, isRead: true } : notification
          );
          const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            isRead: true,
          })),
          unreadCount: 0,
        }));
      },

      deleteNotification: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.filter(n => n.id !== id);
          const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.isRead).length;
      },

      initializeDemoNotifications: () => {
        const demoNotifications: Omit<Notification, 'id' | 'createdAt'>[] = [
          {
            title: 'Security Scan Completed',
            message: 'Full system scan completed successfully. No threats detected.',
            time: '2 minutes ago',
            type: 'safe',
            isRead: false,
          },
          {
            title: 'Threat Detected',
            message: 'Malicious file detected and quarantined. Review recommended.',
            time: '15 minutes ago',
            type: 'threat',
            isRead: false,
          },
          {
            title: 'System Update Available',
            message: 'New security definitions available. Update recommended.',
            time: '1 hour ago',
            type: 'warning',
            isRead: false,
          },
          {
            title: 'Scan Schedule Updated',
            message: 'Your automatic scan schedule has been updated successfully.',
            time: '3 hours ago',
            type: 'info',
            isRead: true,
          },
          {
            title: 'Network Scan Alert',
            message: 'Suspicious network activity detected on your network.',
            time: '5 hours ago',
            type: 'warning',
            isRead: false,
          },
        ];

        // Only initialize if no notifications exist
        const currentNotifications = get().notifications;
        if (currentNotifications.length === 0) {
          demoNotifications.forEach((notification) => {
            get().addNotification(notification);
          });
        }
      },
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

export default useNotificationStore;
