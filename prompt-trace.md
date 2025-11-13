PROMPT 1

I'd like to create a service called Tempo which is client only. We want to build it in React, in Next.js, in TypeScript. And we want it to track outreach and people as you contact them and what company they belong to and what events that you have done with them.

We have the concept of a person which has a name, email, job title, LinkedIn, URL, and notes. And then a company which has a name, LinkedIn URL, website URL, and notes. And then the events have a date, time, a type, and notes. And the types of events, which could be another data structure, is LinkedIn connection request, LinkedIn in-mail, email, meeting invite, and meeting.

Can you set up the React Next.js with Tailwind installed? And let's have the landing page be the list of contacts. And there should be a contacts list which stores the people. And the data structure should be called person. The other data structure should be called company. And the other data structure should be called events.

Then there should be a list of people, that's the landing page, a list of companies, the ability to click on a company, and go to the company page and everything should be linked up. And then when you click on a person, you can go to their person detail page and you'll see a list of the events that you did with them.

The main point of this is to, so that you don't lose track of people and you want to know when to follow up with them and what the next thing you should do with them is. So the whole platform should be centred around a list of to-do's which prioritise the next to-do based on when you wanted to reach out to someone and how far you've let that slip. And how important that is. So that's something we can work out. But that's the whole point of this. It's called tempo for that reason.

Please create a plan to create this website and I'm dropping in a design system file for you to use. Let me know if you have any questions. @design-system.md 

Questions:

I'll help you create a plan for the Tempo application! Before I finalize the plan, I have a few clarifying questions to ensure we build this correctly:
Data Storage - Since this is client-only, where should we store the data?
a) LocalStorage (simple, works immediately)
b) IndexedDB (more robust, better for larger datasets)
c) Set up a simple backend later
Person-Company Relationship - Can a person belong to multiple companies?
a) One company per person
b) Multiple companies per person
To-do/Follow-up System - How should we determine when someone needs follow-up?
a) Add a "next follow-up date" field to each person that you manually set
b) Create a separate "Task" data structure with due dates
c) Automatically suggest based on days since last event (e.g., 7 days = overdue)
Priority System - Should people/companies have an importance level?
a) Yes, add a priority field (High/Medium/Low)
b) No, priority is just based on timing
Navigation Structure - What should the main navigation include?
a) Home (To-dos), People, Companies
b) People (landing page), Companies, To-dos (separate page)
c) Just People and Companies (to-dos embedded in People list)
These answers will help me create a precise implementation plan for you!

Answers to questions:

1. a, let's use zustand
2. a
3. let's do c by default but you can override with a
4. let's forget about priotiries for now and use the same priority for everyone but just make reasonable reach back durations for different events (feel free to suggest additional event types if you think I've missed any out)
5. a

PROMPT 2

Great, everything is working... it's currently showing in lightmode... let's make sure everything is in dark mode as that's what the design system is designed for.

When you create a new person, in the company field... as you type it should search companies to pick and then you can pick one of those... or if you don't happen to find a company... then whatever you type should create a new company with this name which can have its details filled in at a later time (so we might need to make all but the name field in company optional)

Once the person is made, let's add the ability to edit them.

Once an event is made, there should also be an option to edit it. Same for company.

PROMPT 3

I have two events here... should I expect to see following up on the email here?

I added the phone call at the current time, and then the email 11 days into the past?

How does one track when an event has been taken care of, it is when either another event gets added to the list, or the person's status is marked as closed instead of open, did we add the status field in person? If not, can we add it and make it easily changed without having to go into the edit view

(also added two images)

PROMPT 4

That looks good. 

On the home page with the follow ups, can we do the following:

- have a search bar so that we can search for events/people where anything that matches in the name/other fields/notes filters down to these people / people with these events only
- use phrashing like "Sent email to John Doe 6 days ago"
- then each item can be a card where this message is on the left, the days overdue or days until you need to do something about it is in the middle, and then on the right of this card we should have two/three buttons... one for closing the person active -> closed... and another for adding an event to this person where when finishing the event creation doesn't take you off the page, it just means that this person is put further down in the list because another action has been taken, then yet another for when you want to mark the person as having replied to your reachout as that might make the timing chage (e.g. you want to follow up in 1 or 2 days minimum instead of waiting 7 to send a followup email)... when clicking the they replied button, it should open the new event creation modal... where it defaults to them replying now, but you can also have an option to set the datetime manually, or pick from a few convinient options

PROMPT 5 (Plan mode)

Ok, there are a few things we need to improve:

Can we make it so that people can add their own event types and we start with a core set... then the eventtypes they add are stored in their local storage but still respected as types in the service. Let's also add 'Reply received' to the default set that we have now. Can we remove "Meeting Invite" from the default list. Let's also remove "Follow-up Email" from the default set as that could just be another email.

Now, let's add a type to the meeting types, and that type should be one of two values. meeting or message. Everything that's currently in the default list is a message except for the default meeting. And when you create a new eventtype, you should be able to pick between meeting and message.

Then on the todo home page, if the eventtype is of type meeting, we shouldn't add the "They Replied" button.

Can we add a setting page with a Nav icon in the top right side of the top bar which let's you get to a setting page where you can add new event types.

On the settings page you should also be able to modify the default thresholds for when your next action should be for a person after each event type.

On the image above, we added a future event (meeting in the future) and it still says days ago and 'had' we need to handle the situation of setting some event in the future with the right language.

Can we create a plan for all of these updates... please let me know if you have questions.

Questions:

Custom Event Type Defaults - When a user creates a custom event type, should it have a default follow-up threshold (e.g., 7 days), or should they be required to set it?
Event Type Deletion - Should users be able to delete custom event types they've created? What happens to existing events with that type?
Future Events in Timeline - Should future events appear in the person's event timeline, or only past/present events?
Settings Page Access - Should there be a way to get to settings from other pages, or just the nav icon?

Answers:

1. Default with the ability to set it on creation. And then later in settings.
2. Yes, but only if there are no events of that type, and if there are the user should see a list of those and who they are marked against so that they can go and delete them.
3. Future events should appear but it's likely they'll come near the bottom so it doesn't matter.
4. Just the nav icon

Please update the plan

Instead of hitting build, we prompted: "Ok, let's build the plan, but remember to stick to the design system: @design-system.md" to remind it to use the design system.

PROMPT 6:

Getting this error

PASTE ERROR FROM APP

and now when I have an event on someone, we aren't seeing that show up on the home page... once an event is on someone we should always see them on the home page until they are closed or parked... and let's create a new state that is called parked which you can switch to from active or closed (and update the UI/UX to change this accordingly)

PROMPT 7:

We used to create the company if you couldn't find it in the list you were searching for when creating a person... this seems to have broken... can we make sure that if we put a company that we don't pick from the search for companies on the person creation, that the company gets created and the person gets linked to them.

Also, let's allow you to edit the follow up days for an event as well as set it on creation, and give the user the ability to pick a date as an extra option for setting the follow up days as they might want to specify a fixed date and then we can work out and update follow up days from that.

On the person page... if they have a follow up listed on the todo's home page, then we should also see it on the person page.

Also, can we add the functionality to export your data to a single CSV file (that you download) that caters for this structure (maybe with repeating info on rows if required - one event per row), and then allow import of a CSV in this format so that we can move someone's data from one device to another.

PROMPT 8:

Yes, let's implement the CSV import/export functionality.

And in the same go, can we split the message category into outbound message and inbound message categories, but the default 'Reply Received' as an inbound message and don't show 'They Replied' on inbound messages as well as meetings.

PROMPT 9:

I did import CSV, refresh, and it errors

PASTE ERROR FROM APP

can we fix

PROMPT 10:

can you run npm run build and fix

PROMPT 11:

but now I can't edit the default follow up days for a default eventtype

PROMPT 12:

Nope, not what I wanted... this isn't due today it's already overdue... so it should appear in the overdue section

(adding picture of problem)

PROMPT 13:

wait, if something is due in the future then it should be in on track, if it's due today, it should be in due today and if it's due yesterday or before it should be in overdue

PROMPT 14:

I'm still seeing this event as due today when it's follow up time is 3 days so it should be in on track!

(adding picture of problem)

PROMPT 15:

for these, it doesn't seem to be ordering the events by time if they are on the same day, also, on the home page, it's not considering the right one maybe becuase of this ordering bug.

(adding two images)

PROMPT 16:

the first picture is correct, but on the person page it's showing -2 days overdue... but that means that it's on track! (because it's not overdue!)

(adding two images)

PROMPT 17:

Don't take it away from that page, just fix it so that it says still 2 days to sort or something! the problem also exists on the cards.

While you fix this go over the logic and make sure it's going to show the right thing for on track, due today, and overdue

PROMPT 18:

If a user has no events their card on the people page shows due today and on the person detail page shows due today, but that pill shouldn't show when there are no events

PROMPT 19:

Can we move phone call into the meetings category... also can we add a message received default eventype in the inbound message category

PROMPT 20:

Can we drop the user on the person detail page after a person is created... same for the creation of a company from the company creation dialog.


