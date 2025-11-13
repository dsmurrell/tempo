import Badge from "./Badge";

interface FollowUpBadgeProps {
  urgency: "critical" | "high" | "medium" | "low" | "none";
  daysOverdue: number;
}

export default function FollowUpBadge({
  urgency,
  daysOverdue,
}: FollowUpBadgeProps) {
  const getVariant = () => {
    switch (urgency) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "warning";
      case "low":
        return "success";
      case "none":
        return "soft";
    }
  };

  const getText = () => {
    if (urgency === "none") {
      return "On Track";
    }
    return `${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} overdue`;
  };

  return <Badge variant={getVariant()}>{getText()}</Badge>;
}


