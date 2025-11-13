"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { EventTypeDefinition, Event } from "@/types";

interface DeleteEventTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventType: EventTypeDefinition;
}

export default function DeleteEventTypeModal({
  isOpen,
  onClose,
  eventType,
}: DeleteEventTypeModalProps) {
  const { deleteEventType, getEventsUsingEventType, deleteEvent, getPerson } =
    useStore();
  const [eventsUsingType, setEventsUsingType] = useState<Event[]>([]);
  const [showConflict, setShowConflict] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    const result = deleteEventType(eventType.id);

    if (!result.success && result.eventsUsingType) {
      setEventsUsingType(result.eventsUsingType);
      setShowConflict(true);
    } else {
      onClose();
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    // Refresh the list
    const updatedEvents = getEventsUsingEventType(eventType.id);
    setEventsUsingType(updatedEvents);

    // If no events left, close the modal
    if (updatedEvents.length === 0) {
      onClose();
    }
  };

  const handleBulkDelete = () => {
    eventsUsingType.forEach((event) => deleteEvent(event.id));
    setEventsUsingType([]);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (showConflict) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Cannot Delete "{eventType.name}"
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {eventsUsingType.length} event{eventsUsingType.length !== 1 ? "s are" : " is"} using this event type. Delete these events first.
          </p>

          <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-800 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Person
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Notes
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {eventsUsingType.map((event) => {
                  const person = getPerson(event.personId);
                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {person ? (
                          <Link
                            href={`/people/${person.id}`}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline"
                            onClick={() => onClose()}
                          >
                            {person.name}
                          </Link>
                        ) : (
                          <span className="text-gray-500">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {event.notes ? (
                          <span className="line-clamp-1">
                            {event.notes.substring(0, 50)}
                            {event.notes.length > 50 ? "..." : ""}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">No notes</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete All {eventsUsingType.length} Event{eventsUsingType.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Delete Event Type
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete "<strong>{eventType.name}</strong>"?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
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
  );
}

