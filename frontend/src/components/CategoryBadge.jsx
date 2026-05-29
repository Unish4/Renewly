import * as Icons from "lucide-react";
import { CATEGORY_MAP } from "../utils/categories.js";

export default function CategoryBadge({ category }) {
  const meta = CATEGORY_MAP[category];
  if (!meta) return null;

  // Dynamic icon lookup — Icons["Dumbbell"] gives us the Dumbbell component
  const Icon = Icons[meta.icon];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.color}`}
    >
      {Icon && <Icon size={12} />}
      {meta.label}
    </span>
  );
}
