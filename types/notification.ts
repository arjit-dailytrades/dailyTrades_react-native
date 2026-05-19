// types/notification.types.ts

export type BadgeVariant = "paid" | "free" | "segment" | "type" | "default";

export type PriceLabel = "Paid" | "Free" | string;

export type NotificationType = "SCRIPT_PUBLISHED" | string;

export interface NotificationData {
  scriptId: string;
  type: NotificationType;
  title: string;
  segment: string;
  sType: string;
  advisorName: string;
  publishedAt: string;
  symbol: string;
  priceLabel: PriceLabel;
  click_action: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  data: NotificationData;
  isRead: boolean;
  readAt: string | null;
  source: string;
  type: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

// List items include both Notification and section header rows
export interface SectionHeaderItem {
  _id: string;
  type: "header";
  label: string;
  count: number;
}

export type ListItem = Notification | SectionHeaderItem;

// Type guard to distinguish header from notification
export const isSectionHeader = (item: ListItem): item is SectionHeaderItem =>
  (item as SectionHeaderItem).type === "header";
