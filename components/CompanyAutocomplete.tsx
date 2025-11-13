"use client";

import { useState, useRef, useEffect } from "react";
import { Company } from "@/types";

interface CompanyAutocompleteProps {
  companies: Company[];
  selectedCompanyId?: string;
  onSelectCompany: (companyId: string | undefined) => void;
  onCreateCompany: (name: string) => string; // Returns new company ID
  onInputChange?: (value: string) => void; // Track input text for manual company creation
}

export default function CompanyAutocomplete({
  companies,
  selectedCompanyId,
  onSelectCompany,
  onCreateCompany,
  onInputChange,
}: CompanyAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set initial value from selected company
  useEffect(() => {
    if (selectedCompanyId) {
      const company = companies.find((c) => c.id === selectedCompanyId);
      if (company) {
        setInputValue(company.name);
      }
    }
  }, [selectedCompanyId, companies]);

  // Filter companies based on input
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const exactMatch = filteredCompanies.find(
    (c) => c.name.toLowerCase() === inputValue.toLowerCase()
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);
    setHighlightedIndex(0);
    
    // Notify parent of input text change
    if (onInputChange) {
      onInputChange(value);
    }
    
    // Clear selection if input is cleared
    if (!value) {
      onSelectCompany(undefined);
    }
  };

  // Handle company selection
  const handleSelectCompany = (company: Company) => {
    setInputValue(company.name);
    onSelectCompany(company.id);
    setIsOpen(false);
  };

  // Handle creating new company
  const handleCreateCompany = () => {
    if (inputValue.trim() && !exactMatch) {
      const newCompanyId = onCreateCompany(inputValue.trim());
      setInputValue(inputValue.trim());
      onSelectCompany(newCompanyId);
      setIsOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
      }
      return;
    }

    const totalOptions = filteredCompanies.length + (inputValue && !exactMatch ? 1 : 0);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % totalOptions);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + totalOptions) % totalOptions);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex < filteredCompanies.length) {
          handleSelectCompany(filteredCompanies[highlightedIndex]);
        } else if (inputValue && !exactMatch) {
          handleCreateCompany();
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder="Type to search or create..."
        className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm"
      />

      {isOpen && (inputValue || filteredCompanies.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {filteredCompanies.length > 0 ? (
            <>
              {filteredCompanies.map((company, index) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => handleSelectCompany(company)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    index === highlightedIndex
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100"
                      : "text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {company.name}
                </button>
              ))}
            </>
          ) : (
            inputValue && (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No companies found
              </div>
            )
          )}

          {inputValue && !exactMatch && (
            <button
              type="button"
              onClick={handleCreateCompany}
              className={`w-full text-left px-3 py-2 text-sm border-t border-gray-200 dark:border-gray-700 transition-colors ${
                highlightedIndex === filteredCompanies.length
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100"
                  : "text-emerald-600 dark:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="font-medium">Create:</span> {inputValue}
            </button>
          )}
        </div>
      )}
    </div>
  );
}


