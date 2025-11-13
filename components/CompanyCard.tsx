"use client";

import Link from "next/link";
import { Company } from "@/types";

interface CompanyCardProps {
  company: Company;
  peopleCount?: number;
}

export default function CompanyCard({
  company,
  peopleCount = 0,
}: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all duration-200 cursor-pointer p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
              {company.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
          {company.name}
        </h3>

        {company.websiteUrl && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {company.websiteUrl.replace(/^https?:\/\//, "")}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          <span>
            {peopleCount} {peopleCount === 1 ? "person" : "people"}
          </span>
        </div>
      </div>
    </Link>
  );
}


