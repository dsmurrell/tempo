"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

interface AddEventTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEventTypeModal({
  isOpen,
  onClose,
}: AddEventTypeModalProps) {
  const { addEventType, getAllEventTypes } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    category: "outbound-message" as "meeting" | "outbound-message" | "inbound-message",
    followUpDays: 7,
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check for uniqueness
    const existingTypes = getAllEventTypes();
    const nameExists = existingTypes.some(
      (t) => t.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (nameExists) {
      setError("An event type with this name already exists");
      return;
    }

    // Validate
    if (formData.followUpDays < 1 || formData.followUpDays > 365) {
      setError("Follow-up days must be between 1 and 365");
      return;
    }

    addEventType(formData.name, formData.category, formData.followUpDays);
    setFormData({
      name: "",
      category: "outbound-message",
      followUpDays: 7,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Add Event Type
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
              placeholder="e.g., WhatsApp Message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: "outbound-message" })}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                  formData.category === "outbound-message"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    formData.category === "outbound-message"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span
                  className={`text-xs font-medium ${
                    formData.category === "outbound-message"
                      ? "text-emerald-900 dark:text-emerald-100"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Outbound
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: "inbound-message" })}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                  formData.category === "inbound-message"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    formData.category === "inbound-message"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                <span
                  className={`text-xs font-medium ${
                    formData.category === "inbound-message"
                      ? "text-emerald-900 dark:text-emerald-100"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Inbound
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: "meeting" })}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                  formData.category === "meeting"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    formData.category === "meeting"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span
                  className={`text-xs font-medium ${
                    formData.category === "meeting"
                      ? "text-emerald-900 dark:text-emerald-100"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Meeting
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Default Follow-up Days *
            </label>
            <input
              type="number"
              required
              min="1"
              max="365"
              value={formData.followUpDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  followUpDays: parseInt(e.target.value) || 1,
                })
              }
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Range: 1-365 days
            </p>
          </div>

          <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-lg">
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              Preview: After a <strong>{formData.name || "[name]"}</strong>,
              follow up in <strong>{formData.followUpDays} days</strong>
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
              disabled={!formData.name.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Event Type
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

