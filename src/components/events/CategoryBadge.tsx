import { Badge } from '../ui/badge';
import type { EventCategory } from '../../lib/database.types';

const CATEGORY_STYLES: Record<EventCategory, string> = {
  Technical: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50',
  Cultural: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-50',
  Robotics: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50',
  Workshop: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  Seminar: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-50',
  Other: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100',
};

interface CategoryBadgeProps {
  category: EventCategory;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${CATEGORY_STYLES[category]} font-medium border ${size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'}`}
    >
      {category}
    </Badge>
  );
}
