// Users
export interface User {
  _id: string;
  name: string;
  email: string;
  connections: {
    _id: string;
    name: string;
    email: string;
    hideEvents: boolean;
  }[];
  connectionId?: {
    id: string;
    expiry: string;
  };
  accessToken: string;
}

// Events
export type Frequency = "daily" | "weekly" | "monthly" | "yearly";
export interface Event {
  _id: string;
  title: string;
  date: EventDate;
  location?: {
    venue: string;
    city: string;
  };
  category: EventCategory;
  additionalAttributes?: Record<string, string>;
  createdBy: {
    _id: string;
    name: string;
  };
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  unConfirmed: boolean;
  private: boolean;
  copiedFrom?: string | null;
  recurrence?: {
    isRecurring: boolean;
    pattern?: {
      frequency: Frequency;
      interval: number;
      startDate: Date;
      endDate?: Date;
    };
  };
}

export interface EventCategory {
  _id: string;
  name: string;
  icon: string;
}

export interface EventDate {
  start: string;
  end: string;
}

export interface EventLocation {
  venue: string;
  city: string;
}
