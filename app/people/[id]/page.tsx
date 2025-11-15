"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import EventTimeline from "@/components/EventTimeline";
import AddEventModal from "@/components/AddEventModal";
import EditPersonModal from "@/components/EditPersonModal";
import Badge from "@/components/Badge";
import FollowUpBadge from "@/components/FollowUpBadge";

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const personId = params.id as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    getPerson,
    getCompany,
    getEventsByPerson,
    getFollowUpStatus,
    deletePerson,
    updatePerson,
  } = useStore();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Prevent hydration mismatch by only rendering after client mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  const person = getPerson(personId);
  const company = person?.companyId ? getCompany(person.companyId) : undefined;
  const events = getEventsByPerson(personId);
  const followUpStatus = getFollowUpStatus(personId);

  if (!person) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Person not found
          </h2>
          <Link
            href="/people"
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Back to People
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deletePerson(personId);
    router.push("/people");
  };

  const getNextStatus = (currentStatus: string | undefined) => {
    if (currentStatus === "active") return "parked";
    if (currentStatus === "parked") return "closed";
    return "active"; // closed -> active or undefined -> active
  };

  const toggleStatus = () => {
    if (person) {
      updatePerson(person.id, {
        status: getNextStatus(person.status),
      });
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (status === "active") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50";
    if (status === "parked") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50";
    return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";
  };

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return "Active";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/people"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to People
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {person.name}
                        </h1>
                              <button
                                onClick={toggleStatus}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${getStatusColor(person.status)}`}
                                title={`Click to change status (currently ${person.status || "active"})`}
                              >
                                {getStatusLabel(person.status)}
                              </button>
                              {(person.status === "active" || !person.status) && followUpStatus.lastEvent && (
                                <FollowUpBadge
                                  urgency={followUpStatus.urgency}
                                  daysOverdue={followUpStatus.daysOverdue}
                                  isFutureEvent={followUpStatus.isFutureEvent}
                                />
                              )}
                      </div>
              {person.jobTitle && (
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {person.jobTitle}
                  {company && ` at ${company.name}`}
                </p>
              )}
              {!person.jobTitle && company && (
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {company.name}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {person.email && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </label>
                <a
                  href={`mailto:${person.email}`}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {person.email}
                </a>
              </div>
            )}
            {person.linkedinUrl && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  LinkedIn
                </label>
                <a
                  href={person.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View Profile
                </a>
              </div>
            )}
            {company && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Company
                </label>
                <Link
                  href={`/companies/${company.id}`}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {company.name}
                </Link>
              </div>
            )}
          </div>

          {person.notes && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Notes
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {person.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Events ({events.length})
          </h2>
          <button
            onClick={() => setIsEventModalOpen(true)}
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
            Add Event
          </button>
        </div>

        <EventTimeline events={events} />
      </div>

      <AddEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        personId={personId}
      />

      {person && (
        <EditPersonModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          person={person}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Person
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete {person.name}? This will also
              delete all associated events. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

