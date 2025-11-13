"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

interface QuickEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
  personName: string;
  defaultTypeId?: string;
  isReply?: boolean;
}

export default function QuickEventModal({
  isOpen,
  onClose,
  personId,
  personName,
  defaultTypeId = "email",
  isReply = false,
}: QuickEventModalProps) {
  const { addEvent, getAllEventTypes } = useStore();
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().slice(0, 5);

  const [timeOption, setTimeOption] = useState<"now" | "custom">("now");
  const [formData, setFormData] = useState({
    date: today,
    time: now,
    type: defaultTypeId,
    notes: "",
    customFollowUpDays: null as number | null,
  });

  const eventTypes = getAllEventTypes();
  const messageTypes = eventTypes.filter((t) => t.category === "message");
  const meetingTypes = eventTypes.filter((t) => t.category === "meeting");

  const selectedEventType = eventTypes.find((t) => t.id === formData.type);
  const isMeetingType = selectedEventType?.category === "meeting";

  const selectedDate = new Date(formData.date);
  selectedDate.setHours(0, 0, 0, 0);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const isFutureDate = selectedDate > todayDate;

  const dateError = !isMeetingType && isFutureDate
    ? "Only meetings can be scheduled in the future"
    : null;

  if (!isOpen) return null;

  const handleQuickTime = (minutesAgo: number) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - minutesAgo);
    setFormData({
      ...formData,
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().slice(0, 5),
    });
    setTimeOption("custom");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      type: defaultTypeId,
      notes: "",
      customFollowUpDays: null,
    });
    setTimeOption("now");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isReply ? `${personName} Replied` : `Log Event for ${personName}`}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {isReply
            ? "Record when they responded to your outreach"
            : "Add a new interaction to track"}
        </p>

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
              {messageTypes.length > 0 && (
                <optgroup label="Messages">
                  {messageTypes.map((type) => (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              When did this happen?
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, date: today, time: now });
                  setTimeOption("now");
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${timeOption === "now"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border-2 border-emerald-500"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300"
                  }`}
              >
                Just now
              </button>
              <button
                type="button"
                onClick={() => handleQuickTime(30)}
                className="px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                30 min ago
              </button>
              <button
                type="button"
                onClick={() => handleQuickTime(60)}
                className="px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                1 hour ago
              </button>
              <button
                type="button"
                onClick={() => handleQuickTime(120)}
                className="px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                2 hours ago
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  max={isMeetingType ? undefined : today}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    setTimeOption("custom");
                  }}
                  className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => {
                    setFormData({ ...formData, time: e.target.value });
                    setTimeOption("custom");
                  }}
                  className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
                />
              </div>
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
              placeholder={
                isReply
                  ? "What did they say?"
                  : "What happened during this interaction?"
              }
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
              Days until next follow-up (leave blank for default)
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
              Log Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


