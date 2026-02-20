import { getRelationshipText } from "@/lib/utils";

export default function DayCounter() {
  const startDate = new Date(process.env.RELATIONSHIP_START_DATE || "2024-08-25");
  const daysText = getRelationshipText(startDate);

  return <span>{daysText}</span>;
}
