"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Person, Company, FollowUpStatus, EventType } from "@/types";
import QuickEventModal from "./QuickEventModal";

interface ToDoItemProps {
  person: Person;
  company?: Company;
  followUpStatus: FollowUpStatus;
}

export default function ToDoItem({
  person,
  company,
  followUpStatus,
}: ToDoItemProps) {
  const { updatePerson } = useStore();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const getActionMessage = () => {
    if (!followUpStatus.lastEvent) {
      return `Haven't contacted ${person.name} yet`;
    }
    
    const eventType = followUpStatus.lastEvent.type.toLowerCase();
    const verbMap: Record<string, string> = {
      "email": "Sent email to",
      "follow-up email": "Sent follow-up email to",
      "linkedin connection request": "Sent LinkedIn connection to",
      "linkedin inmail": "Sent LinkedIn InMail to",
      "meeting invite": "Sent meeting invite to",
      "meeting": "Had meeting with",
      "phone call": "Called",
    };
    
    const verb = verbMap[followUpStatus.lastEvent.type.toLowerCase()] || "Contacted";
    return `${verb} ${person.name} ${followUpStatus.daysSinceLastEvent} day${followUpStatus.daysSinceLastEvent !== 1 ? "s" : ""} ago`;
  };

  const getTimingMessage = () => {
    if (followUpStatus.isOverdue) {
      return `${followUpStatus.daysOverdue} day${followUpStatus.daysOverdue !== 1 ? "s" : ""} overdue`;
    }
    const daysUntil = followUpStatus.suggestedFollowUpDays - followUpStatus.daysSinceLastEvent;
    return `Follow up in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`;
  };

  const getTimingColor = () => {
    if (followUpStatus.urgency === "critical") return "text-red-600 dark:text-red-400";
    if (followUpStatus.urgency === "high") return "text-orange-600 dark:text-orange-400";
    if (followUpStatus.urgency === "medium") return "text-yellow-600 dark:text-yellow-400";
    return "text-emerald-600 dark:text-emerald-400";
  };

  const handleClose = () => {
    updatePerson(person.id, { status: "closed" });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Action message */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {getActionMessage()}
            </p>
            {company && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {person.jobTitle ? `${person.jobTitle} at ${company.name}` : company.name}
              </p>
            )}
          </div>

          {/* Middle: Timing */}
          <div className="text-center px-4">
            <p className={`text-sm font-semibold ${getTimingColor()}`}>
              {getTimingMessage()}
            </p>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReplyModal(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              title="They replied"
            >
              They Replied
            </button>
            <button
              onClick={() => setShowEventModal(true)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
              title="Add event"
            >
              Add Event
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
              title="Close contact"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <QuickEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        personId={person.id}
        personName={person.name}
      />

      <QuickEventModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        personId={person.id}
        personName={person.name}
        defaultType={EventType.EMAIL}
        isReply={true}
      />
    </>
  );
}

