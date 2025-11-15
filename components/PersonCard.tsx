"use client";

import Link from "next/link";
import { Person, Company, FollowUpStatus } from "@/types";
import FollowUpBadge from "./FollowUpBadge";
import Badge from "./Badge";

interface PersonCardProps {
  person: Person;
  company?: Company;
  followUpStatus?: FollowUpStatus;
}

export default function PersonCard({
  person,
  company,
  followUpStatus,
}: PersonCardProps) {
  return (
    <Link href={`/people/${person.id}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all duration-200 cursor-pointer p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
              {person.name}
            </h3>
            {person.jobTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {person.jobTitle}
              </p>
            )}
          </div>
          {followUpStatus && followUpStatus.lastEvent && (
            <FollowUpBadge
              urgency={followUpStatus.urgency}
              daysOverdue={followUpStatus.daysOverdue}
              isFutureEvent={followUpStatus.isFutureEvent}
            />
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          {company && <Badge variant="soft">{company.name}</Badge>}
          <Badge 
            variant={
              person.status === "active" 
                ? "success" 
                : person.status === "parked"
                ? "warning"
                : "soft"
            }
          >
            {person.status ? person.status.charAt(0).toUpperCase() + person.status.slice(1) : "Active"}
          </Badge>
        </div>

        {person.email && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {person.email}
          </p>
        )}

        {followUpStatus?.lastEvent && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span>
              {followUpStatus.isFutureEvent ? (
                <>
                  Next: {followUpStatus.lastEvent.type} •{" "}
                  in {Math.abs(followUpStatus.daysSinceLastEvent)} day
                  {Math.abs(followUpStatus.daysSinceLastEvent) !== 1 ? "s" : ""}
                </>
              ) : (
                <>
                  Last: {followUpStatus.lastEvent.type} •{" "}
                  {followUpStatus.daysSinceLastEvent} day
                  {followUpStatus.daysSinceLastEvent !== 1 ? "s" : ""} ago
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}


