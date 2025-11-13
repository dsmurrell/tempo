Tempo CRM Implementation Plan
1. Project Setup & Dependencies
Initialize Next.js 14 with TypeScript and install required dependencies:

npx create-next-app@latest tempo --typescript --tailwind --app --no-src-dir
Install Zustand: npm install zustand
Configure Tailwind with design system colors (emerald-first palette)
2. Data Models & Types
Create TypeScript interfaces in types/index.ts:

// Person: name, email, jobTitle, linkedinUrl, notes, companyId, nextFollowUpDate?
// Company: name, linkedinUrl, websiteUrl, notes
// Event: personId, date, time, type (enum), notes
// EventType: enum with follow-up durations
Event Types with Suggested Follow-up Durations:

LinkedIn Connection Request → 7 days
LinkedIn InMail → 7 days  
Email → 5 days
Meeting Invite → 3 days
Meeting → 14 days
Phone Call → 7 days (suggested addition)
Follow-up Email → 5 days (suggested addition)
3. Zustand Store with LocalStorage Persistence
Create store/useStore.ts with:

People slice (CRUD operations)
Companies slice (CRUD operations)
Events slice (CRUD operations)
LocalStorage persistence using Zustand's persist middleware
Helper function: getFollowUpStatus(personId) - calculates days overdue based on last event type
4. Core Pages & Routing
/app/page.tsx - To-dos Dashboard (prioritized follow-up list, sorted by days overdue)
/app/people/page.tsx - People list view
/app/people/[id]/page.tsx - Person detail with events timeline
/app/companies/page.tsx - Companies list view  
/app/companies/[id]/page.tsx - Company detail with associated people
5. Shared Layout & Navigation
Create /app/layout.tsx with:

Navigation bar: "Home (To-dos)", "People", "Companies"
Use emerald-600 design system for nav active states
Dark mode support
Consistent padding and spacing from design system
6. Key Components
Create in components/:

PersonCard.tsx - Card for person list (shows name, company, last contact, urgency indicator)
CompanyCard.tsx - Card for company list
EventTimeline.tsx - Chronological list of events for person detail page
AddPersonModal.tsx - Form to add new person (with company dropdown)
AddCompanyModal.tsx - Form to add new company
AddEventModal.tsx - Form to log new event (date, time, type selector, notes)
ToDoItem.tsx - Shows person with days overdue, last event, suggested action
FollowUpBadge.tsx - Visual urgency indicator (uses Badge from design system)
7. To-Do Logic Implementation
In the home page (/app/page.tsx):

Fetch all people and their events
For each person, calculate days since last event
Compare against event type's suggested follow-up duration
If nextFollowUpDate is set (manual override), use that instead
Sort by days overdue (descending)
Display with emerald-based urgency indicators (green = on track, red = overdue)
8. Design System Integration
Use exact emerald button classes from design-system.md
Apply card styling for lists (hover states with emerald borders)
Use Badge component variants for status indicators
Implement proper dark mode throughout
Follow spacing and typography guidelines
9. Sample Data (Optional)
Add seed data function to populate initial example people, companies, and events for demo purposes (can be triggered via button in UI).

Implementation Notes
All state managed through Zustand store
No API calls - fully client-side
LocalStorage as single source of truth
Calculate follow-ups dynamically on render
Use Next.js App Router with TypeScript
Follow emerald-first design principle strictly