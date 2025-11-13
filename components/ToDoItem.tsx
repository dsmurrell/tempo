"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Person, Company, FollowUpStatus } from "@/types";
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
    if (!followUpStatus.lastEvent || !followUpStatus.lastEventType) {
      return `Haven't contacted ${person.name} yet`;
    }

    const eventTypeName = followUpStatus.lastEventType.name;
    const isFuture = followUpStatus.isFutureEvent;
    const absDays = Math.abs(followUpStatus.daysSinceLastEvent);

    // Verb mapping for past tense
    const pastTenseMap: Record<string, string> = {
      "email": "Sent email to",
      "linkedin connection request": "Sent LinkedIn connection to",
      "linkedin inmail": "Sent LinkedIn InMail to",
      "meeting": "Had meeting with",
      "phone call": "Called",
      "reply received": "Reply received from",
    };

    // Verb mapping for future tense
    const futureTenseMap: Record<string, string> = {
      "meeting": "Meeting scheduled with",
      "phone call": "Call scheduled with",
    };

    const typeLower = eventTypeName.toLowerCase();

    if (isFuture) {
      const verb = futureTenseMap[typeLower] || `${eventTypeName} scheduled with`;
      return `${verb} ${person.name} in ${absDays} day${absDays !== 1 ? "s" : ""}`;
    } else {
      const verb = pastTenseMap[typeLower] || `${eventTypeName} with`;
      return `${verb} ${person.name} ${absDays} day${absDays !== 1 ? "s" : ""} ago`;
    }
  };

  const getTimingMessage = () => {
    if (followUpStatus.daysOverdue > 0) {
      // Overdue
      return `${followUpStatus.daysOverdue} day${followUpStatus.daysOverdue !== 1 ? "s" : ""} overdue`;
    } else if (followUpStatus.daysOverdue === 0) {
      // Due today
      return "Due today";
    } else {
      // On track (negative daysOverdue means days remaining)
      const daysRemaining = Math.abs(followUpStatus.daysOverdue);
      return `Follow up in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`;
    }
  };

  const getTimingColor = () => {
    if (followUpStatus.daysOverdue > 0) {
      // Overdue
      if (followUpStatus.urgency === "critical") return "text-red-600 dark:text-red-400";
      if (followUpStatus.urgency === "high") return "text-orange-600 dark:text-orange-400";
      if (followUpStatus.urgency === "medium") return "text-yellow-600 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
    } else if (followUpStatus.daysOverdue === 0) {
      // Due today - blue
      return "text-blue-600 dark:text-blue-400";
    }
    // On track - green
    return "text-emerald-600 dark:text-emerald-400";
  };

  const handlePark = () => {
    updatePerson(person.id, { status: "parked" });
  };

  const handleClose = () => {
    updatePerson(person.id, { status: "closed" });
  };

  // Show "They Replied" button only for outbound message events (not meetings or inbound)
  const showReplyButton =
    followUpStatus.lastEventType?.category === "outbound-message" &&
    !followUpStatus.isFutureEvent;

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Action message */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {/* Split message to make name clickable */}
              {(() => {
                const message = getActionMessage();
                const personNameIndex = message.indexOf(person.name);
                if (personNameIndex === -1) return message;

                const beforeName = message.substring(0, personNameIndex);
                const afterName = message.substring(personNameIndex + person.name.length);

                return (
                  <>
                    {beforeName}
                    <Link
                      href={`/people/${person.id}`}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {person.name}
                    </Link>
                    {afterName}
                  </>
                );
              })()}
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
            {showReplyButton && (
              <button
                onClick={() => setShowReplyModal(true)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                title="They replied"
              >
                They Replied
              </button>
            )}
            <button
              onClick={() => setShowEventModal(true)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
              title="Add event"
            >
              Add Event
            </button>
            <button
              onClick={handlePark}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
              title="Park contact (snooze for later)"
            >
              Park
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors duration-200"
              title="Close contact (archive)"
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
        defaultTypeId="reply-received"
        isReply={true}
      />
    </>
  );
}

