"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
}

export default function AddEventModal({
  isOpen,
  onClose,
  personId,
}: AddEventModalProps) {
  const { addEvent, getAllEventTypes } = useStore();
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().slice(0, 5);
  const eventTypes = getAllEventTypes();
  const outboundMessageTypes = eventTypes.filter((t) => t.category === "outbound-message");
  const inboundMessageTypes = eventTypes.filter((t) => t.category === "inbound-message");
  const meetingTypes = eventTypes.filter((t) => t.category === "meeting");

  const [formData, setFormData] = useState({
    date: today,
    time: now,
    type: "email",
    notes: "",
    customFollowUpDays: null as number | null,
  });

  if (!isOpen) return null;

  // Get selected event type details
  const selectedEventType = eventTypes.find((t) => t.id === formData.type);
  const isMeetingType = selectedEventType?.category === "meeting";
  
  // Check if date is in the future
  const selectedDate = new Date(formData.date);
  selectedDate.setHours(0, 0, 0, 0);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const isFutureDate = selectedDate > todayDate;
  
  // Prevent future dates for message types
  const dateError = !isMeetingType && isFutureDate 
    ? "Only meetings can be scheduled in the future" 
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if there's a date error
    if (dateError) return;
    
    addEvent({
      personId,
      date: formData.date,
      time: formData.time || undefined,
      type: formData.type,
      notes: formData.notes || undefined,
      customFollowUpDays: formData.customFollowUpDays || undefined,
    });
    setFormData({
      date: today,
      time: now,
      type: "email",
      notes: "",
      customFollowUpDays: null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Add Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {dateError && (
            <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{dateError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
            >
              {outboundMessageTypes.length > 0 && (
                <optgroup label="Outbound Messages">
                  {outboundMessageTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {inboundMessageTypes.length > 0 && (
                <optgroup label="Inbound Messages">
                  {inboundMessageTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {meetingTypes.length > 0 && (
                <optgroup label="Meetings">
                  {meetingTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
            <input
              type="date"
              required
              value={formData.date}
              max={isMeetingType ? undefined : today}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
            />
            {!isMeetingType && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Messages cannot be scheduled in the future
              </p>
            )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
              placeholder="What happened during this interaction?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Custom Follow-up Days
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={formData.customFollowUpDays || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customFollowUpDays: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
              placeholder={`Default: ${selectedEventType?.defaultFollowUpDays || "7"} days`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Leave blank to use the default ({selectedEventType?.defaultFollowUpDays || "7"} days for {selectedEventType?.name || "this event type"})
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!dateError}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


