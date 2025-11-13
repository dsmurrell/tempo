# Custom Event Types & Settings System

## Overview

Transform the hardcoded event type system into a flexible, user-configurable system with custom event types, adjustable follow-up thresholds, and intelligent handling of past/future events.

## 1. Data Model Changes

### Update EventType Structure

**File: `types/index.ts`**

- Change `EventType` from enum to interface
- Add `EventTypeCategory`: "meeting" | "message"
- Create `EventTypeDefinition` interface with:
  - `id`: string (unique identifier)
  - `name`: string (display name)
  - `category`: "meeting" | "message"
  - `defaultFollowUpDays`: number
  - `isCustom`: boolean (user-created vs default)

### Default Event Types (Revised)

```typescript
- Email → message, 5 days
- LinkedIn Connection Request → message, 7 days
- LinkedIn InMail → message, 7 days
- Phone Call → message, 7 days
- Meeting → meeting, 14 days
- Reply Received → message, 2 days (NEW)
```

**Removed**: Meeting Invite, Follow-up Email

## 2. Store Updates

### EventType Management in Zustand

**File: `store/useStore.ts`**

- Add `eventTypes: EventTypeDefinition[]` state
- Add `customEventTypes: EventTypeDefinition[]` (user-created, persisted)
- Actions:
  - `addEventType(name, category, followUpDays)` → creates custom type
  - `updateEventTypeThreshold(id, days)` → modify follow-up days
  - `deleteEventType(id)` → remove custom type (if no events use it)
  - `getEventTypeById(id)` → lookup
- Merge default + custom types on load
- Persist custom types in localStorage

### Update Event Interface

- Change `type: EventType` to `type: string` (event type ID)
- Update all event creation to reference event type IDs

## 3. Settings Page

### Create Settings Page

**File: `app/settings/page.tsx`**

**Sections:**

**A. Event Types Management**

- List all event types (default + custom)
- Each row shows:
  - Name
  - Category badge (Meeting/Message)
  - Follow-up threshold (editable inline)
  - Delete button (custom types only)
- "Add Event Type" button → modal

**B. Add Event Type Modal**

- Name input
- Category selector (Meeting/Message radio buttons)
- Default follow-up days (number input)
- Save/Cancel buttons

### Update Navigation

**File: `components/Navigation.tsx`**

- Add settings icon (gear/cog) in top right
- Link to `/settings`
- Design: subtle, emerald on hover

## 4. Conditional UI Logic

### Update ToDoItem Component

**File: `components/ToDoItem.tsx`**

- Get event type definition for last event
- Show "They Replied" button only if `category === "message"`
- Keep "Add Event" and "Close" for all types

### Update Event Selection UI

- All event creation modals need dropdown of event types
- Group by category: Messages / Meetings
- Sort alphabetically within groups

## 5. Future Event Handling

### Update Language Functions

**File: `components/ToDoItem.tsx`**

**New Logic:**

```typescript
getActionMessage() {
  const eventDate = new Date(lastEvent.date);
  const today = new Date();
  const isFuture = eventDate > today;
  
  if (isFuture) {
    const daysUntil = calculateDays(today, eventDate);
    return `${eventType.name} scheduled with ${person.name} in ${daysUntil} days`;
  } else {
    return `${getPastTenseVerb(eventType)} ${person.name} ${daysAgo} days ago`;
  }
}
```

**Verb Mapping:**

- Email → "Sent email to"
- Meeting → "Had meeting with" (past) / "Meeting scheduled with" (future)
- Phone Call → "Called" (past) / "Call scheduled with" (future)
- Reply Received → "Reply received from"
- etc.

### Update Follow-up Calculations

- If last event is in the future, calculate from future date
- "Meeting in 5 days" → follow up suggested 19 days from now (5 + 14)
- Adjust urgency accordingly

## 6. Migration Strategy

### Handle Existing Data

- Create migration function in store
- Map old enum values to new event type IDs
- Run on app load if needed
- Default event type if unknown

## 7. UI/UX Polish

### Event Type Selection

- Searchable dropdown in modals
- Recent event types at top
- Visual distinction between meetings/messages

### Settings Page Design

- Professional table layout
- Inline editing with save/cancel
- Confirmation for deletions
- Success/error toasts

### Validation

- Event type name uniqueness check
- Prevent deleting types with existing events
- Minimum threshold: 1 day, maximum: 365 days

## Implementation Order

1. **Data model & types** → Foundation
2. **Store event type management** → CRUD operations
3. **Settings page** → UI for configuration
4. **Navigation update** → Access point
5. **Update event creation modals** → Use new system
6. **Conditional UI logic** → Hide "They Replied" for meetings
7. **Future event language** → Better messaging
8. **Migration & testing** → Data integrity

## Key Files to Modify

- `types/index.ts` - New event type interfaces
- `store/useStore.ts` - Event type CRUD + custom types
- `app/settings/page.tsx` - New settings page
- `components/Navigation.tsx` - Settings icon
- `components/ToDoItem.tsx` - Conditional UI + future language
- `components/QuickEventModal.tsx` - Event type selection
- `components/AddEventModal.tsx` - Event type selection
- `components/EditEventModal.tsx` - Event type selection

## Assumptions Made

1. Custom event types default to 7-day follow-up if not specified
2. Users can't delete event types that have associated events
3. Future events show in timeline but with different styling
4. Settings page is accessible only via nav icon (not in main nav)
5. Event type thresholds can be edited for both default and custom types
6. Deleted custom event types are soft-deleted (archived) for data integrity