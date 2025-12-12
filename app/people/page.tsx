"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/store/useStore";
import PersonCard from "@/components/PersonCard";
import AddPersonModal from "@/components/AddPersonModal";
import AddCompanyModal from "@/components/AddCompanyModal";

type StatusTab = "active" | "parked" | "closed";

export default function PeoplePage() {
  const { people, getCompany, getFollowUpStatus } = useStore();
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("active");

  // Filter people based on search query
  const filteredPeople = people.filter((person) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = person.name.toLowerCase().includes(query);
    const emailMatch = person.email?.toLowerCase().includes(query);
    const jobTitleMatch = person.jobTitle?.toLowerCase().includes(query);
    const company = person.companyId ? getCompany(person.companyId) : undefined;
    const companyMatch = company?.name.toLowerCase().includes(query);

    return nameMatch || emailMatch || jobTitleMatch || companyMatch;
  });

  // Group and sort people by status
  const { activePeople, parkedPeople, closedPeople } = useMemo(() => {
    // Sort by daysOverdue descending (same as follow-up home page)
    const sortByFollowUp = (personList: typeof people) => {
      return [...personList].sort((a, b) => {
        const statusA = getFollowUpStatus(a.id);
        const statusB = getFollowUpStatus(b.id);
        return statusB.daysOverdue - statusA.daysOverdue;
      });
    };

    return {
      activePeople: sortByFollowUp(filteredPeople.filter((p) => p.status === "active")),
      parkedPeople: sortByFollowUp(filteredPeople.filter((p) => p.status === "parked")),
      closedPeople: sortByFollowUp(filteredPeople.filter((p) => p.status === "closed")),
    };
  }, [filteredPeople, getFollowUpStatus]);

  const currentPeople = activeTab === "active"
    ? activePeople
    : activeTab === "parked"
      ? parkedPeople
      : closedPeople;

  const tabs = [
    { id: "active" as StatusTab, label: "Active", count: activePeople.length },
    { id: "parked" as StatusTab, label: "Parked", count: parkedPeople.length },
    { id: "closed" as StatusTab, label: "Closed", count: closedPeople.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              People
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your contacts and relationships
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
          <>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by name, email, job title, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id
                        ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
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
              No people yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by adding your first contact
            </p>
            <button
              onClick={() => setIsPersonModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Add Person
            </button>
          </div>
        ) : currentPeople.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? "No results found" : `No ${activeTab} contacts`}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery
                ? "Try adjusting your search query"
                : activeTab === "active"
                  ? "Add a new contact or change the status of an existing one"
                  : `No contacts are currently ${activeTab}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentPeople.map((person) => {
              const company = person.companyId
                ? getCompany(person.companyId)
                : undefined;
              const followUpStatus = getFollowUpStatus(person.id);
              return (
                <PersonCard
                  key={person.id}
                  person={person}
                  company={company}
                  followUpStatus={followUpStatus}
                />
              );
            })}
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


