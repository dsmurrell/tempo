// Event types with their suggested follow-up durations (in days)
export enum EventType {
  LINKEDIN_CONNECTION_REQUEST = "LinkedIn Connection Request",
  LINKEDIN_INMAIL = "LinkedIn InMail",
  EMAIL = "Email",
  MEETING_INVITE = "Meeting Invite",
  MEETING = "Meeting",
  PHONE_CALL = "Phone Call",
  FOLLOW_UP_EMAIL = "Follow-up Email",
}

// Suggested follow-up durations for each event type (in days)
export const EVENT_FOLLOW_UP_DAYS: Record<EventType, number> = {
  [EventType.LINKEDIN_CONNECTION_REQUEST]: 7,
  [EventType.LINKEDIN_INMAIL]: 7,
  [EventType.EMAIL]: 5,
  [EventType.MEETING_INVITE]: 3,
  [EventType.MEETING]: 14,
  [EventType.PHONE_CALL]: 7,
  [EventType.FOLLOW_UP_EMAIL]: 5,
};

export interface Company {
  id: string;
  name: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  name: string;
  email?: string;
  jobTitle?: string;
  linkedinUrl?: string;
  notes?: string;
  companyId?: string; // Reference to Company
  nextFollowUpDate?: string; // Manual override for follow-up date (ISO string)
  status: "active" | "closed"; // Track if person is active or closed
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  personId: string; // Reference to Person
  date: string; // ISO date string
  time?: string; // Time in HH:MM format
  type: EventType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper type for follow-up status calculation
export interface FollowUpStatus {
  personId: string;
  lastEvent?: Event;
  daysSinceLastEvent: number;
  suggestedFollowUpDays: number;
  daysOverdue: number;
  isOverdue: boolean;
  urgency: "critical" | "high" | "medium" | "low" | "none";
}

