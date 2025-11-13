# Tempo - Outreach CRM

A client-only CRM application built with Next.js, TypeScript, and Tailwind CSS to help you track outreach, manage contacts, and never miss a follow-up.

## Features

- 📋 **Smart Follow-ups**: Automatic follow-up suggestions based on event types and timing
- 👥 **Contact Management**: Track people with detailed profiles, job titles, and companies
- 🏢 **Company Organization**: Manage companies and their associated contacts
- 📅 **Event Tracking**: Log interactions like emails, meetings, LinkedIn messages, and phone calls
- 💾 **Local Storage**: All data persists locally in your browser (no backend required)
- 🎨 **Professional Design**: Clean, modern UI with emerald-first design system
- 🌗 **Dark Mode Support**: Full dark mode theming throughout the application

## Event Types & Follow-up Durations

The system automatically suggests follow-ups based on the last interaction:

- **LinkedIn Connection Request** → 7 days
- **LinkedIn InMail** → 7 days
- **Email** → 5 days
- **Follow-up Email** → 5 days
- **Meeting Invite** → 3 days
- **Phone Call** → 7 days
- **Meeting** → 14 days

You can also manually override follow-up dates for any contact.

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
│   └── layout.tsx           # Root layout with navigation
├── components/              # React components
│   ├── Navigation.tsx       # Main navigation bar
│   ├── Badge.tsx           # Status badge component
│   ├── PersonCard.tsx      # Person list card
│   ├── CompanyCard.tsx     # Company list card
│   ├── EventTimeline.tsx   # Event history display
│   ├── ToDoItem.tsx        # Follow-up task item
│   ├── FollowUpBadge.tsx   # Urgency indicator
│   └── Add*Modal.tsx       # Form modals for adding data
├── store/                   # Zustand state management
│   └── useStore.ts         # Global store with localStorage persistence
├── types/                   # TypeScript definitions
│   └── index.ts            # Data models (Person, Company, Event)
└── design-system.md        # Design system documentation
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with localStorage persistence
- **Design**: Custom emerald-first design system

## Key Features Explained

### Follow-up Logic

The application calculates follow-up urgency automatically:

1. **Critical** (Red): 7+ days overdue
2. **High** (Orange): 3-7 days overdue
3. **Medium** (Yellow): 1-3 days overdue
4. **Low** (Green): Less than 3 days until suggested follow-up
5. **None** (Gray): No recent interaction or well within follow-up window

### Data Persistence

All data is stored locally in your browser using localStorage via Zustand's persist middleware. Your data remains private and never leaves your device.

### Navigation

- **Home**: Prioritized follow-ups dashboard showing overdue and on-track contacts
- **People**: List of all contacts with search functionality
- **Companies**: List of all companies with associated people count

## Usage Tips

1. **Start by adding companies** - This makes it easier to organize your contacts
2. **Add people to companies** - Link contacts to their organizations
3. **Log events immediately** - Track every interaction to get accurate follow-up suggestions
4. **Check the home page daily** - See who needs follow-up attention
5. **Use manual override** - Set custom follow-up dates when needed

## Design System

This project follows a professional emerald-first design system with:

- Emerald (#10b981) as the primary brand color
- Subtle backgrounds and borders
- Consistent spacing and typography
- Full dark mode support
- Accessibility-first approach

See `design-system.md` for complete guidelines.

## License

MIT

---

Built with ❤️ to help you maintain tempo in your outreach


