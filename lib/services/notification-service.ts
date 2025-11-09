// Mock notification service
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  timestamp: string
  actionUrl?: string
  actionLabel?: string
}

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Document Approved',
    message: 'KYC Form for GlobalInnovations Inc. has been approved.',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    actionUrl: '/compliance/documents',
    actionLabel: 'View Document',
  },
  {
    id: 'notif-2',
    title: 'High-Risk Client Detected',
    message: 'New client "Apex Holdings" flagged as high-risk. Review required.',
    type: 'warning',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
    actionUrl: '/compliance/risk-assessment',
    actionLabel: 'Review',
  },
  {
    id: 'notif-3',
    title: 'New Lead Assigned',
    message: 'Lead "TechVentures Capital" has been assigned to you.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    actionUrl: '/leads/lead-002',
    actionLabel: 'View Lead',
  },
  {
    id: 'notif-4',
    title: 'Document Upload Required',
    message: 'Client is waiting for feedback on uploaded Bank Statement.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    actionUrl: '/compliance/documents',
  },
  {
    id: 'notif-5',
    title: 'Meeting Reminder',
    message: 'Demo scheduled with CloudFirst Technologies tomorrow at 2 PM.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actionUrl: '/leads/lead-007',
  },
]

class NotificationService {
  private notifications: Notification[] = [...MOCK_NOTIFICATIONS]
  private listeners: Array<(notifications: Notification[]) => void> = []

  getNotifications(): Notification[] {
    return this.notifications
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true))
    this.notifyListeners()
  }

  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId)
    this.notifyListeners()
  }

  addNotification(notification: Omit<Notification, 'id' | 'read' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString(),
    }
    this.notifications.unshift(newNotification)
    this.notifyListeners()
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener)
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.notifications))
  }
}

export const notificationService = new NotificationService()

