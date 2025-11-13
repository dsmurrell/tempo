import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Person,
  Company,
  Event,
  EventType,
  FollowUpStatus,
  EVENT_FOLLOW_UP_DAYS,
} from "@/types";

interface TempoState {
  // Data
  people: Person[];
  companies: Company[];
  events: Event[];

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

  // Follow-up logic
  getFollowUpStatus: (personId: string) => FollowUpStatus;
  getAllFollowUpStatuses: () => FollowUpStatus[];
}

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getTimestamp = () => new Date().toISOString();

export const useStore = create<TempoState>()(
  persist(
    (set, get) => ({
      // Initial state
      people: [],
      companies: [],
      events: [],

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
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          ),

      // Follow-up logic
      getFollowUpStatus: (personId): FollowUpStatus => {
        const person = get().getPerson(personId);
        const events = get().getEventsByPerson(personId);
        const lastEvent = events[0]; // Already sorted by date descending

        // If manual override is set, use that
        if (person?.nextFollowUpDate) {
          const nextFollowUpDate = new Date(person.nextFollowUpDate);
          const today = new Date();
          const daysUntilFollowUp = Math.ceil(
            (nextFollowUpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          const daysOverdue = -daysUntilFollowUp;

          return {
            personId,
            lastEvent,
            daysSinceLastEvent: lastEvent
              ? Math.floor(
                  (new Date().getTime() - new Date(lastEvent.date).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : Infinity,
            suggestedFollowUpDays: 0, // Manual override
            daysOverdue: Math.max(0, daysOverdue),
            isOverdue: daysOverdue > 0,
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
        if (!lastEvent) {
          return {
            personId,
            lastEvent: undefined,
            daysSinceLastEvent: Infinity,
            suggestedFollowUpDays: 7, // Default
            daysOverdue: 0,
            isOverdue: false,
            urgency: "none",
          };
        }

        const daysSinceLastEvent = Math.floor(
          (new Date().getTime() - new Date(lastEvent.date).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const suggestedFollowUpDays = EVENT_FOLLOW_UP_DAYS[lastEvent.type];
        const daysOverdue = daysSinceLastEvent - suggestedFollowUpDays;

        return {
          personId,
          lastEvent,
          daysSinceLastEvent,
          suggestedFollowUpDays,
          daysOverdue: Math.max(0, daysOverdue),
          isOverdue: daysOverdue > 0,
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
          .filter((person) => person.status === "active") // Only show active people
          .map((person) => get().getFollowUpStatus(person.id))
          .sort((a, b) => b.daysOverdue - a.daysOverdue);
      },
    }),
    {
      name: "tempo-storage",
    }
  )
);

