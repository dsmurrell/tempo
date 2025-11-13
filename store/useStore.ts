import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Person,
  Company,
  Event,
  EventType,
  FollowUpStatus,
  EventTypeDefinition,
  DEFAULT_EVENT_TYPES,
} from "@/types";

interface TempoState {
  // Data
  people: Person[];
  companies: Company[];
  events: Event[];
  customEventTypes: EventTypeDefinition[]; // User-created event types
  _hasHydrated?: boolean; // Migration flag

  // People actions
  addPerson: (person: Omit<Person, "id" | "createdAt" | "updatedAt">) => string;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;

  // Company actions
  addCompany: (company: Omit<Company, "id" | "createdAt" | "updatedAt">) => string;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  getCompany: (id: string) => Company | undefined;
  getPeopleByCompany: (companyId: string) => Person[];

  // Event actions
  addEvent: (event: Omit<Event, "id" | "createdAt" | "updatedAt">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsByPerson: (personId: string) => Event[];

  // Event Type actions
  getAllEventTypes: () => EventTypeDefinition[];
  getEventTypeById: (id: string) => EventTypeDefinition | undefined;
  addEventType: (name: string, category: "meeting" | "outbound-message" | "inbound-message", followUpDays: number) => string;
  updateEventType: (id: string, updates: Partial<EventTypeDefinition>) => void;
  deleteEventType: (id: string) => { success: boolean; eventsUsingType?: Event[] };
  getEventsUsingEventType: (typeId: string) => Event[];

  // Import/Export actions
  exportData: () => { people: Person[]; companies: Company[]; events: Event[]; customEventTypes: EventTypeDefinition[] };
  importData: (data: { people: Person[]; companies: Company[]; events: Event[]; customEventTypes: EventTypeDefinition[] }) => void;

  // Follow-up logic
  getFollowUpStatus: (personId: string) => FollowUpStatus;
  getAllFollowUpStatuses: () => FollowUpStatus[];
}

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getTimestamp = () => new Date().toISOString();

// Migration: Convert old EventType enum values to new event type IDs
const migrateEventTypes = (events: Event[]): Event[] => {
  const typeMapping: Record<string, string> = {
    "LinkedIn Connection Request": "linkedin-connection",
    "LinkedIn InMail": "linkedin-inmail",
    "Email": "email",
    "Meeting Invite": "meeting", // Deprecated, but map to meeting
    "Meeting": "meeting",
    "Phone Call": "phone-call",
    "Follow-up Email": "email", // Deprecated, but map to email
    "Reply Received": "reply-received",
  };

  return events.map((event) => {
    // If the event type is already an ID (starts with lowercase or has hyphen), leave it
    if (event.type.includes("-") || event.type[0] === event.type[0].toLowerCase()) {
      return event;
    }

    // Otherwise, migrate it
    const newType = typeMapping[event.type] || "email"; // Default to email if unknown
    return {
      ...event,
      type: newType,
    };
  });
};

export const useStore = create<TempoState>()(
  persist(
    (set, get) => ({
      // Initial state
      people: [],
      companies: [],
      events: [],
      customEventTypes: [],

      // Run migrations on hydration
      _hasHydrated: false,

      // People actions
      addPerson: (person) => {
        const id = generateId();
        set((state) => ({
          people: [
            ...state.people,
            {
              ...person,
              id,
              status: person.status || "active", // Default to active
              createdAt: getTimestamp(),
              updatedAt: getTimestamp(),
            },
          ],
        }));
        return id;
      },

      updatePerson: (id, updates) =>
        set((state) => ({
          people: state.people.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: getTimestamp() } : p
          ),
        })),

      deletePerson: (id) =>
        set((state) => ({
          people: state.people.filter((p) => p.id !== id),
          // Also delete all events for this person
          events: state.events.filter((e) => e.personId !== id),
        })),

      getPerson: (id) => get().people.find((p) => p.id === id),

      // Company actions
      addCompany: (company) => {
        const id = generateId();
        set((state) => ({
          companies: [
            ...state.companies,
            {
              ...company,
              id,
              createdAt: getTimestamp(),
              updatedAt: getTimestamp(),
            },
          ],
        }));
        return id;
      },

      updateCompany: (id, updates) =>
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: getTimestamp() } : c
          ),
        })),

      deleteCompany: (id) =>
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
          // Optionally remove company association from people
          people: state.people.map((p) =>
            p.companyId === id
              ? { ...p, companyId: undefined, updatedAt: getTimestamp() }
              : p
          ),
        })),

      getCompany: (id) => get().companies.find((c) => c.id === id),

      getPeopleByCompany: (companyId) =>
        get().people.filter((p) => p.companyId === companyId),

      // Event actions
      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...event,
              id: generateId(),
              createdAt: getTimestamp(),
              updatedAt: getTimestamp(),
            },
          ],
        })),

      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: getTimestamp() } : e
          ),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      getEventsByPerson: (personId) =>
        get()
          .events.filter((e) => e.personId === personId)
          .sort((a, b) => {
            // Combine date and time for accurate sorting
            const aDateTime = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
            const bDateTime = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
            return bDateTime - aDateTime; // Most recent first
          }),

      // Event Type actions
      getAllEventTypes: () => {
        const customTypes = get().customEventTypes;
        const allTypes = [...DEFAULT_EVENT_TYPES, ...customTypes];
        
        // Deduplicate by ID - items from customEventTypes override defaults
        const typeMap = new Map<string, EventTypeDefinition>();
        DEFAULT_EVENT_TYPES.forEach((type) => {
          typeMap.set(type.id, type);
        });
        // Custom types and overrides take precedence
        customTypes.forEach((type) => {
          typeMap.set(type.id, type);
        });
        
        return Array.from(typeMap.values());
      },

      getEventTypeById: (id) => {
        const allTypes = get().getAllEventTypes();
        return allTypes.find((type) => type.id === id);
      },

      addEventType: (name, category, followUpDays) => {
        const id = `custom-${generateId()}`;
        const newType: EventTypeDefinition = {
          id,
          name,
          category,
          defaultFollowUpDays: followUpDays,
          isCustom: true,
          createdAt: getTimestamp(),
        };
        set((state) => ({
          customEventTypes: [...state.customEventTypes, newType],
        }));
        return id;
      },

      updateEventType: (id, updates) => {
        // Can update both default and custom types
        const allTypes = get().getAllEventTypes();
        const typeToUpdate = allTypes.find((t) => t.id === id);
        
        if (!typeToUpdate) return;
        
        if (typeToUpdate.isCustom) {
          // Update custom type
          set((state) => ({
            customEventTypes: state.customEventTypes.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          }));
        } else {
          // For default types, store overrides in custom types but keep isCustom: false
          const existingOverride = get().customEventTypes.find((t) => t.id === id);
          if (existingOverride) {
            set((state) => ({
              customEventTypes: state.customEventTypes.map((t) =>
                t.id === id ? { ...t, ...updates, isCustom: false } : t
              ),
            }));
          } else {
            // Create override - keep isCustom: false so it appears in default section
            const override: EventTypeDefinition = {
              ...typeToUpdate,
              ...updates,
              isCustom: false, // Keep as false so it shows in default types section
            };
            set((state) => ({
              customEventTypes: [...state.customEventTypes, override],
            }));
          }
        }
      },

      deleteEventType: (id) => {
        const eventsUsingType = get().getEventsUsingEventType(id);
        
        if (eventsUsingType.length > 0) {
          return { success: false, eventsUsingType };
        }
        
        set((state) => ({
          customEventTypes: state.customEventTypes.filter((t) => t.id !== id),
        }));
        
        return { success: true };
      },

      getEventsUsingEventType: (typeId) => {
        return get().events.filter((e) => e.type === typeId);
      },

      // Follow-up logic
      getFollowUpStatus: (personId): FollowUpStatus => {
        const person = get().getPerson(personId);
        const events = get().getEventsByPerson(personId);
        const lastEvent = events[0]; // Already sorted by date descending
        const lastEventType = lastEvent ? get().getEventTypeById(lastEvent.type) : undefined;

        // Calculate days since/until last event
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const eventDate = lastEvent ? new Date(lastEvent.date) : null;
        if (eventDate) eventDate.setHours(0, 0, 0, 0);
        
        const daysSinceLastEvent = eventDate
          ? Math.floor((today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24))
          : Infinity;
        
        const isFutureEvent = eventDate ? eventDate > today : false;

        // If manual override is set, use that
        if (person?.nextFollowUpDate) {
          const nextFollowUpDate = new Date(person.nextFollowUpDate);
          nextFollowUpDate.setHours(0, 0, 0, 0);
          const daysUntilFollowUp = Math.ceil(
            (nextFollowUpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          const daysOverdue = -daysUntilFollowUp;

          return {
            personId,
            lastEvent,
            lastEventType,
            daysSinceLastEvent,
            suggestedFollowUpDays: 0, // Manual override
            daysOverdue: daysOverdue,
            isOverdue: daysOverdue > 0,
            isFutureEvent,
            urgency:
              daysOverdue > 7
                ? "critical"
                : daysOverdue > 3
                ? "high"
                : daysOverdue > 0
                ? "medium"
                : daysOverdue > -3
                ? "low"
                : "none",
          };
        }

        // Calculate based on last event
        if (!lastEvent || !lastEventType) {
          return {
            personId,
            lastEvent: undefined,
            lastEventType: undefined,
            daysSinceLastEvent: Infinity,
            suggestedFollowUpDays: 7, // Default
            daysOverdue: -999, // Special value to indicate no events
            isOverdue: false,
            isFutureEvent: false,
            urgency: "none",
          };
        }

        // Use custom follow-up days if set, otherwise use event type default
        const suggestedFollowUpDays = lastEvent.customFollowUpDays || lastEventType.defaultFollowUpDays;
        
        // For future events, calculate from the future date
        let daysOverdue = 0;
        if (isFutureEvent) {
          // Event is in the future, so we're not overdue yet
          daysOverdue = 0;
        } else {
          // Event is in the past, calculate overdue normally
          daysOverdue = daysSinceLastEvent - suggestedFollowUpDays;
        }

        return {
          personId,
          lastEvent,
          lastEventType,
          daysSinceLastEvent,
          suggestedFollowUpDays,
          daysOverdue: daysOverdue,
          isOverdue: daysOverdue > 0,
          isFutureEvent,
          urgency:
            daysOverdue > 7
              ? "critical"
              : daysOverdue > 3
              ? "high"
              : daysOverdue > 0
              ? "medium"
              : daysOverdue > -3
              ? "low"
              : "none",
        };
      },

      getAllFollowUpStatuses: () => {
        const people = get().people;
        return people
          .filter((person) => person.status === "active") // Only show active people with events
          .map((person) => ({
            person,
            status: get().getFollowUpStatus(person.id),
          }))
          .filter(({ person, status }) => {
            // Always show if they have at least one event
            const events = get().getEventsByPerson(person.id);
            return events.length > 0;
          })
          .map(({ status }) => status)
          .sort((a, b) => b.daysOverdue - a.daysOverdue);
      },

      // Export all data
      exportData: () => {
        const state = get();
        return {
          people: state.people,
          companies: state.companies,
          events: state.events,
          customEventTypes: state.customEventTypes,
        };
      },

      // Import data (replaces existing data)
      importData: (data) => {
        set({
          people: data.people,
          companies: data.companies,
          events: data.events,
          customEventTypes: data.customEventTypes || [],
        });
      },
    }),
    {
      name: "tempo-storage",
      onRehydrateStorage: () => (state) => {
        if (state && !state._hasHydrated) {
          // Run migration
          const migratedEvents = migrateEventTypes(state.events);
          state.events = migratedEvents;
          state._hasHydrated = true;
        }
      },
    }
  )
);

