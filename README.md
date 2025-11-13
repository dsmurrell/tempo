# Tempo - Outreach CRM

A client-only CRM application built with Next.js, TypeScript, and Tailwind CSS to help you track outreach, manage contacts, and never miss a follow-up.

## Features

- 📋 **Smart Follow-ups**: Automatic follow-up suggestions based on event types and timing
- 🎯 **Three-tier Prioritization**: Overdue, Due Today, and On Track sections
- 👥 **Contact Management**: Track people with detailed profiles, job titles, and companies
- 🏢 **Company Organization**: Manage companies and their associated contacts
- 📅 **Event Tracking**: Log interactions like emails, meetings, LinkedIn messages, and phone calls
- ⚙️ **Custom Event Types**: Create your own event types with custom follow-up thresholds
- 🔄 **Contact Status Management**: Active, Parked, or Closed status for each person
- 📥 **CSV Import/Export**: Move your data between devices with ease
- 🔍 **Smart Search**: Filter follow-ups by name, company, event type, or notes
- 💾 **Local Storage**: All data persists locally in your browser (no backend required)
- 🎨 **Professional Design**: Clean, modern UI with emerald-first design system
- 🌗 **Dark Mode**: Full dark mode theming throughout the application

## Event Categories & Default Types

Events are organized into three categories:

### Outbound Messages
Messages and connection requests you send to others:
- **Email** → 5 days follow-up
- **LinkedIn Connection Request** → 7 days follow-up
- **LinkedIn InMail** → 7 days follow-up

### Inbound Messages
Messages and replies received from others:
- **Reply Received** → 2 days follow-up
- **Message Received** → 2 days follow-up

### Meetings
Real-time conversations and scheduled meetings:
- **Phone Call** → 7 days follow-up
- **Meeting** → 14 days follow-up

**Note**: Only meeting-type events can be scheduled in the future. All message events must be logged as past or present.

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
tempo/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home (Follow-ups Dashboard)
│   ├── people/              # People list and detail pages
│   ├── companies/           # Companies list and detail pages
│   ├── settings/            # Settings page for event type management
│   └── layout.tsx           # Root layout with navigation
├── components/              # React components
│   ├── Navigation.tsx       # Main navigation bar
│   ├── Badge.tsx           # Status badge component
│   ├── PersonCard.tsx      # Person list card
│   ├── CompanyCard.tsx     # Company list card
│   ├── EventTimeline.tsx   # Event history display
│   ├── ToDoItem.tsx        # Follow-up task item with quick actions
│   ├── FollowUpBadge.tsx   # Follow-up status indicator
│   ├── CompanyAutocomplete.tsx  # Company search/create component
│   └── *Modal.tsx          # Form modals for adding/editing data
├── store/                   # Zustand state management
│   └── useStore.ts         # Global store with localStorage persistence
├── types/                   # TypeScript definitions
│   └── index.ts            # Data models (Person, Company, Event, EventTypeDefinition)
├── utils/                   # Utility functions
│   └── csvHelpers.ts       # CSV import/export functionality
└── design-system.md        # Design system documentation
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with localStorage persistence
- **Design**: Custom emerald-first design system

## Key Features Explained

### Follow-up Dashboard

The home page shows three prioritized sections:

1. **Overdue** (Red/Orange/Yellow): Follow-ups that are past due
   - Critical: 7+ days overdue (Red)
   - High: 3-7 days overdue (Orange)
   - Medium: 1-3 days overdue (Yellow)

2. **Due Today** (Blue): Follow-ups that need attention today

3. **On Track** (Green): Contacts with upcoming follow-ups still in the safe zone

### Contact Status Management

Each person can have one of three statuses:

- **Active**: Show on follow-up dashboard (default)
- **Parked**: Temporarily hidden from dashboard
- **Closed**: Removed from active tracking

Click the status badge on a person's detail page to cycle through statuses.

### Custom Event Types

In the Settings page, you can:

- Create custom event types (e.g., "WhatsApp Message", "Slack DM")
- Choose category: Outbound Message, Inbound Message, or Meeting
- Set default follow-up thresholds (1-365 days)
- Edit follow-up days for default event types
- Delete custom event types (with conflict resolution)

### Custom Follow-up Overrides

When logging an event, you can:

- Use the default follow-up threshold for that event type
- Override with a custom number of days for this specific event
- Edit the follow-up days later if plans change

### Quick Actions on Follow-ups

Each follow-up card on the home page includes action buttons:

- **They Replied**: Quick-log an inbound response (only for outbound messages)
- **Add Event**: Log any new interaction
- **Park**: Temporarily remove from dashboard
- **Close**: Mark contact as closed

### Search & Filter

The home page search bar filters across:
- Person names
- Company names
- Email addresses
- Job titles
- Event types
- Notes (both person and event notes)

### Company Management

- Autocomplete search when adding/editing people
- Inline company creation during person creation
- Automatic linking of people to companies
- Company detail pages show all associated contacts

### CSV Import/Export

Access from the Settings page:

**Export**:
- Downloads a single CSV file with all data
- Includes people, companies, events, and custom event types
- One event per row (person/company info repeats)
- Filename includes current date

**Import**:
- Upload a previously exported CSV file
- Recreates all data including custom event types
- Replaces existing data (backup first!)
- Handles data migration automatically

## Usage Tips

1. **Start by adding companies** - Makes contact organization easier
2. **Create people and link to companies** - Use autocomplete for quick linking
3. **Log events with proper timing** - Include time for same-day events
4. **Check the home page daily** - Stay on top of overdue and due-today items
5. **Use quick actions** - "They Replied" button speeds up common workflows
6. **Customize event types** - Add types that match your outreach channels
7. **Park inactive contacts** - Keep your dashboard focused on active outreach
8. **Export regularly** - Back up your data or move between devices
9. **Search when needed** - Quickly find specific contacts or event types
10. **Adjust follow-up thresholds** - Fine-tune timing in Settings

## Data Model

### Person
- Basic info: name, email, job title, LinkedIn URL, notes
- Company association (optional)
- Status: active, parked, or closed
- Events: chronological interaction history

### Company
- Basic info: name, LinkedIn URL, website URL, notes
- Associated people list

### Event
- Date and time (time required for same-day events)
- Event type (links to EventTypeDefinition)
- Optional notes
- Optional custom follow-up days override

### EventTypeDefinition
- Name and category (outbound-message, inbound-message, meeting)
- Default follow-up threshold in days
- System default vs. user-custom flag

## Design System

This project follows a professional emerald-first design system:

- **Primary Color**: Emerald (#10b981) for actions and primary elements
- **Status Colors**: 
  - Green for success/on-track
  - Blue for due-today
  - Yellow/Orange for warnings
  - Red for errors/critical overdue
- **Neutral Colors**: Gray scale for backgrounds and text
- **Dark Mode**: Complete dark mode support with proper contrast
- **Typography**: Clear hierarchy with sans-serif fonts
- **Spacing**: Consistent 4px/8px grid system
- **Accessibility**: WCAG AA compliant contrast ratios

See `design-system.md` for complete guidelines.

## Browser Compatibility

- Modern browsers with localStorage support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Privacy

All data is stored locally in your browser's localStorage. No data is sent to any server. Your contacts and outreach data remain completely private on your device.

## License

MIT

---

Built with ❤️ to help you maintain tempo in your outreach
