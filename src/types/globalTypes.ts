// Users
export interface User {
  _id: string;
  name: string;
  email: string;
  accessToken: string;
}

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
  sharedWith: string;
  createdBy: string;
  extraInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Events
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
