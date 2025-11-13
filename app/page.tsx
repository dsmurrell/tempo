"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import ToDoItem from "@/components/ToDoItem";
import AddPersonModal from "@/components/AddPersonModal";
import AddCompanyModal from "@/components/AddCompanyModal";

export default function Home() {
  const { people, companies, getAllFollowUpStatuses, getCompany, getEventsByPerson } = useStore();
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const followUpStatuses = getAllFollowUpStatuses();
  
  // Filter based on search query
  const filteredStatuses = followUpStatuses.filter((status) => {
    if (!searchQuery) return true;
    
    const person = people.find((p) => p.id === status.personId);
    if (!person) return false;
    
    const query = searchQuery.toLowerCase();
    const company = person.companyId ? getCompany(person.companyId) : undefined;
    const events = getEventsByPerson(person.id);
    
    // Search in person fields
    const nameMatch = person.name.toLowerCase().includes(query);
    const emailMatch = person.email?.toLowerCase().includes(query);
    const jobTitleMatch = person.jobTitle?.toLowerCase().includes(query);
    const notesMatch = person.notes?.toLowerCase().includes(query);
    const companyMatch = company?.name.toLowerCase().includes(query);
    
    // Search in event types and notes
    const eventMatch = events.some(
      (e) =>
        e.type.toLowerCase().includes(query) ||
        e.notes?.toLowerCase().includes(query)
    );
    
    return nameMatch || emailMatch || jobTitleMatch || notesMatch || companyMatch || eventMatch;
  });
  
  const overdueFollowUps = filteredStatuses.filter((status) => status.isOverdue);
  const upcomingFollowUps = filteredStatuses.filter(
    (status) => !status.isOverdue && status.lastEvent
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Follow-ups
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay on top of your outreach with prioritized follow-ups
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            >
              Add Company
            </button>
            <button
              onClick={() => setIsPersonModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Person
            </button>
          </div>
        </div>

        {people.length > 0 && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, company, event type, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
            />
          </div>
        )}

        {people.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900 mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No contacts yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by adding your first person or company
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              >
                Add Company
              </button>
              <button
                onClick={() => setIsPersonModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Add Person
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {overdueFollowUps.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Overdue ({overdueFollowUps.length})
                </h2>
                <div className="space-y-4">
                  {overdueFollowUps.map((status) => {
                    const person = people.find((p) => p.id === status.personId);
                    if (!person) return null;
                    const company = person.companyId
                      ? getCompany(person.companyId)
                      : undefined;
                    return (
                      <ToDoItem
                        key={person.id}
                        person={person}
                        company={company}
                        followUpStatus={status}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {upcomingFollowUps.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  On Track ({upcomingFollowUps.length})
                </h2>
                <div className="space-y-4">
                  {upcomingFollowUps.map((status) => {
                    const person = people.find((p) => p.id === status.personId);
                    if (!person) return null;
                    const company = person.companyId
                      ? getCompany(person.companyId)
                      : undefined;
                    return (
                      <ToDoItem
                        key={person.id}
                        person={person}
                        company={company}
                        followUpStatus={status}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {overdueFollowUps.length === 0 && upcomingFollowUps.length === 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900 mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  All caught up!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  No follow-ups needed right now. Add events to your contacts to
                  start tracking.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <AddPersonModal
        isOpen={isPersonModalOpen}
        onClose={() => setIsPersonModalOpen(false)}
      />
      <AddCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
    </div>
  );
}

