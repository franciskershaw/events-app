// Users
export interface User {
  _id: string;
  name: string;
  email: string;
  accessToken: string;
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
