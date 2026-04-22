import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { EventCategory, EventStatus, EventFilters } from '../../lib/database.types';

const CATEGORIES: (EventCategory | 'All')[] = ['All', 'Technical', 'Cultural', 'Robotics', 'Workshop', 'Seminar', 'Other'];
const STATUSES: (EventStatus | 'All')[] = ['All', 'Upcoming', 'Completed'];

interface EventFiltersProps {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
}

export default function EventFiltersBar({ filters, onChange }: EventFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  const clearFilters = () => {
    onChange({ search: '', category: 'All', status: 'All', dateFrom: '', dateTo: '' });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <SlidersHorizontal className="w-4 h-4 text-blue-500" />
        Filter Events
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto h-7 text-xs text-slate-500 hover:text-red-600 gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by title, venue, or keyword..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9 h-10 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {/* Category */}
        <Select
          value={filters.category}
          onValueChange={(val) => onChange({ ...filters, category: val as EventCategory | 'All' })}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="text-sm">{c === 'All' ? 'All Categories' : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(val) => onChange({ ...filters, status: val as EventStatus | 'All' })}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-sm">{s === 'All' ? 'All Status' : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date From */}
        <div className="relative">
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="h-9 text-sm"
            placeholder="From"
          />
        </div>

        {/* Date To */}
        <div className="relative">
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="h-9 text-sm"
            placeholder="To"
          />
        </div>
      </div>
    </div>
  );
}
