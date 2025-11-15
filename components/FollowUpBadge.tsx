import Badge from "./Badge";

interface FollowUpBadgeProps {
  urgency: "critical" | "high" | "medium" | "low" | "none";
  daysOverdue: number;
  isFutureEvent?: boolean;
}

export default function FollowUpBadge({
  urgency,
  daysOverdue,
  isFutureEvent = false,
}: FollowUpBadgeProps) {
  const getVariant = () => {
    if (daysOverdue > 0) {
      // Overdue
      switch (urgency) {
        case "critical":
          return "error";
        case "high":
          return "warning";
        case "medium":
          return "warning";
        default:
          return "error";
      }
    } else if (daysOverdue === 0) {
      // Due today
      return "info";
    } else {
      // On track (negative daysOverdue)
      return "success";
    }
  };

  const getText = () => {
    if (daysOverdue > 0) {
      // Overdue
      return `${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} overdue`;
    } else if (daysOverdue === 0) {
      // Due today
      return "Due Today";
    } else {
      // On track (negative means days remaining)
      const daysRemaining = Math.abs(daysOverdue);
      if (isFutureEvent) {
        return `Follow up in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`;
      } else {
        return `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} to go`;
      }
    }
  };

  return <Badge variant={getVariant()}>{getText()}</Badge>;
}


