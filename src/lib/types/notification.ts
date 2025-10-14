export interface Notification {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  autoClose?: boolean;
  loading?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, "id">) => string;
  hideNotification: (id: string) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  clearAll: () => void;
}
