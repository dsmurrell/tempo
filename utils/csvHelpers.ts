import { Person, Company, Event, EventTypeDefinition, EventTypeCategory } from "@/types";

export interface CSVRow {
  personId: string;
  personName: string;
  personEmail: string;
  personJobTitle: string;
  personLinkedIn: string;
  personNotes: string;
  personStatus: string;
  companyId: string;
  companyName: string;
  companyLinkedIn: string;
  companyWebsite: string;
  companyNotes: string;
  eventId: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  eventNotes: string;
  eventCustomFollowUpDays: string;
}

export interface CSVEventType {
  id: string;
  name: string;
  category: string;
  defaultFollowUpDays: string;
}

export function exportToCSV(
  people: Person[],
  companies: Company[],
  events: Event[],
  customEventTypes: EventTypeDefinition[]
): string {
  const rows: CSVRow[] = [];

  // Create a map of companies for quick lookup
  const companyMap = new Map(companies.map((c) => [c.id, c]));

  // Group events by person
  const eventsByPerson = new Map<string, Event[]>();
  events.forEach((event) => {
    const personEvents = eventsByPerson.get(event.personId) || [];
    personEvents.push(event);
    eventsByPerson.set(event.personId, personEvents);
  });

  // For each person, create rows (one per event, or one if no events)
  people.forEach((person) => {
    const company = person.companyId ? companyMap.get(person.companyId) : undefined;
    const personEvents = eventsByPerson.get(person.id) || [];

    if (personEvents.length === 0) {
      // Person with no events - still need one row
      rows.push({
        personId: person.id,
        personName: person.name,
        personEmail: person.email || "",
        personJobTitle: person.jobTitle || "",
        personLinkedIn: person.linkedinUrl || "",
        personNotes: person.notes || "",
        personStatus: person.status,
        companyId: company?.id || "",
        companyName: company?.name || "",
        companyLinkedIn: company?.linkedinUrl || "",
        companyWebsite: company?.websiteUrl || "",
        companyNotes: company?.notes || "",
        eventId: "",
        eventDate: "",
        eventTime: "",
        eventType: "",
        eventNotes: "",
        eventCustomFollowUpDays: "",
      });
    } else {
      // Person with events - one row per event
      personEvents.forEach((event) => {
        rows.push({
          personId: person.id,
          personName: person.name,
          personEmail: person.email || "",
          personJobTitle: person.jobTitle || "",
          personLinkedIn: person.linkedinUrl || "",
          personNotes: person.notes || "",
          personStatus: person.status,
          companyId: company?.id || "",
          companyName: company?.name || "",
          companyLinkedIn: company?.linkedinUrl || "",
          companyWebsite: company?.websiteUrl || "",
          companyNotes: company?.notes || "",
          eventId: event.id,
          eventDate: event.date,
          eventTime: event.time || "",
          eventType: event.type,
          eventNotes: event.notes || "",
          eventCustomFollowUpDays: event.customFollowUpDays?.toString() || "",
        });
      });
    }
  });

  // Convert to CSV format
  const headers = [
    "PersonId",
    "PersonName",
    "PersonEmail",
    "PersonJobTitle",
    "PersonLinkedIn",
    "PersonNotes",
    "PersonStatus",
    "CompanyId",
    "CompanyName",
    "CompanyLinkedIn",
    "CompanyWebsite",
    "CompanyNotes",
    "EventId",
    "EventDate",
    "EventTime",
    "EventType",
    "EventNotes",
    "EventCustomFollowUpDays",
  ];

  const csvLines = [headers.join(",")];

  // Add custom event types as a special header section
  if (customEventTypes.length > 0) {
    csvLines.push("# CUSTOM_EVENT_TYPES_START");
    customEventTypes.forEach((type) => {
      const eventTypeLine = [
        "EVENTTYPE",
        escapeCsvField(type.id),
        escapeCsvField(type.name),
        escapeCsvField(type.category),
        type.defaultFollowUpDays.toString(),
      ].join(",");
      csvLines.push(eventTypeLine);
    });
    csvLines.push("# CUSTOM_EVENT_TYPES_END");
  }

  rows.forEach((row) => {
    const line = [
      escapeCsvField(row.personId),
      escapeCsvField(row.personName),
      escapeCsvField(row.personEmail),
      escapeCsvField(row.personJobTitle),
      escapeCsvField(row.personLinkedIn),
      escapeCsvField(row.personNotes),
      escapeCsvField(row.personStatus),
      escapeCsvField(row.companyId),
      escapeCsvField(row.companyName),
      escapeCsvField(row.companyLinkedIn),
      escapeCsvField(row.companyWebsite),
      escapeCsvField(row.companyNotes),
      escapeCsvField(row.eventId),
      escapeCsvField(row.eventDate),
      escapeCsvField(row.eventTime),
      escapeCsvField(row.eventType),
      escapeCsvField(row.eventNotes),
      escapeCsvField(row.eventCustomFollowUpDays),
    ].join(",");
    csvLines.push(line);
  });

  return csvLines.join("\n");
}

function escapeCsvField(field: string): string {
  // If field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (field.includes(",") || field.includes("\n") || field.includes('"')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function parseCSV(csvContent: string): {
  people: Person[];
  companies: Company[];
  events: Event[];
  customEventTypes: EventTypeDefinition[];
} {
  const lines = csvContent.split("\n").filter((line) => line.trim() !== "");
  if (lines.length < 2) {
    throw new Error("CSV file is empty or invalid");
  }

  const people = new Map<string, Person>();
  const companies = new Map<string, Company>();
  const events: Event[] = [];
  const customEventTypes: EventTypeDefinition[] = [];

  let i = 1; // Skip header line
  let inEventTypeSection = false;

  while (i < lines.length) {
    const line = lines[i];

    // Check for event type section markers
    if (line.startsWith("# CUSTOM_EVENT_TYPES_START")) {
      inEventTypeSection = true;
      i++;
      continue;
    }

    if (line.startsWith("# CUSTOM_EVENT_TYPES_END")) {
      inEventTypeSection = false;
      i++;
      continue;
    }

    // Parse event type lines
    if (inEventTypeSection) {
      const fields = parseCsvLine(line);
      if (fields.length >= 5 && fields[0] === "EVENTTYPE") {
        const [, id, name, category, followUpDays] = fields;
        customEventTypes.push({
          id,
          name,
          category: category as EventTypeCategory,
          defaultFollowUpDays: parseInt(followUpDays, 10),
          isCustom: true,
          createdAt: new Date().toISOString(),
        });
      }
      i++;
      continue;
    }

    // Parse regular data lines
    const fields = parseCsvLine(line);
    if (fields.length < 18) {
      console.warn("Skipping invalid line:", line);
      i++;
      continue;
    }

    const [
      personId,
      personName,
      personEmail,
      personJobTitle,
      personLinkedIn,
      personNotes,
      personStatus,
      companyId,
      companyName,
      companyLinkedIn,
      companyWebsite,
      companyNotes,
      eventId,
      eventDate,
      eventTime,
      eventType,
      eventNotes,
      eventCustomFollowUpDays,
    ] = fields;

    // Add company if not already added
    if (companyId && companyName && !companies.has(companyId)) {
      companies.set(companyId, {
        id: companyId,
        name: companyName,
        linkedinUrl: companyLinkedIn || undefined,
        websiteUrl: companyWebsite || undefined,
        notes: companyNotes || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Add person if not already added
    if (personId && !people.has(personId)) {
      people.set(personId, {
        id: personId,
        name: personName,
        email: personEmail || undefined,
        jobTitle: personJobTitle || undefined,
        linkedinUrl: personLinkedIn || undefined,
        notes: personNotes || undefined,
        companyId: companyId || undefined,
        status: (personStatus as "active" | "parked" | "closed") || "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Add event if present
    if (eventId && eventDate && eventType) {
      events.push({
        id: eventId,
        personId: personId,
        date: eventDate,
        time: eventTime || undefined,
        type: eventType,
        notes: eventNotes || undefined,
        customFollowUpDays: eventCustomFollowUpDays
          ? parseInt(eventCustomFollowUpDays, 10)
          : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    i++;
  }

  return {
    people: Array.from(people.values()),
    companies: Array.from(companies.values()),
    events,
    customEventTypes,
  };
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      fields.push(currentField);
      currentField = "";
    } else {
      currentField += char;
    }
  }

  // Add last field
  fields.push(currentField);

  return fields;
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

