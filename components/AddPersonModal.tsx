"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import CompanyAutocomplete from "./CompanyAutocomplete";

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPersonModal({
  isOpen,
  onClose,
}: AddPersonModalProps) {
  const { addPerson, addCompany, companies } = useStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobTitle: "",
    linkedinUrl: "",
    companyId: "",
    notes: "",
  });
  const [companyInputText, setCompanyInputText] = useState("");

  if (!isOpen) return null;

  const handleCreateCompany = (name: string): string => {
    return addCompany({ name });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalCompanyId = formData.companyId;
    
    // If there's company text but no ID, create the company
    if (companyInputText && !finalCompanyId) {
      const existingCompany = companies.find(
        (c) => c.name.toLowerCase() === companyInputText.toLowerCase()
      );
      if (existingCompany) {
        finalCompanyId = existingCompany.id;
      } else {
        finalCompanyId = handleCreateCompany(companyInputText);
      }
    }
    
    const personId = addPerson({
      name: formData.name,
      email: formData.email || undefined,
      jobTitle: formData.jobTitle || undefined,
      linkedinUrl: formData.linkedinUrl || undefined,
      companyId: finalCompanyId || undefined,
      notes: formData.notes || undefined,
      status: "active",
    });
    setFormData({
      name: "",
      email: "",
      jobTitle: "",
      linkedinUrl: "",
      companyId: "",
      notes: "",
    });
    setCompanyInputText("");
    onClose();
    
    // Navigate to the person's detail page
    router.push(`/people/${personId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Add New Person
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
              placeholder="CEO"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company
            </label>
            <CompanyAutocomplete
              companies={companies}
              selectedCompanyId={formData.companyId}
              onSelectCompany={(companyId) =>
                setFormData({ ...formData, companyId: companyId || "" })
              }
              onCreateCompany={handleCreateCompany}
              onInputChange={setCompanyInputText}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) =>
                setFormData({ ...formData, linkedinUrl: e.target.value })
              }
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
              placeholder="https://linkedin.com/in/johndoe"
            />
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
              placeholder="Additional notes..."
            />
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
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Add Person
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

