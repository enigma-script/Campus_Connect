import { useState } from 'react';
import { CalendarDays, Loader as Loader2 } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import EventFiltersBar from '../components/events/EventFilters';
import { useEvents } from '../hooks/useEvents';
import type { EventFilters } from '../lib/database.types';

const DEFAULT_FILTERS: EventFilters = {
  search: '',
  category: 'All',
  status: 'All',
  dateFrom: '',
  dateTo: '',
};

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);
  const { events, loading } = useEvents(filters);

  const upcomingCount = events.filter((e) => e.status === 'Upcoming').length;
  const completedCount = events.filter((e) => e.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900">All Events</h1>
          <p className="text-slate-500 mt-1">
            Discover workshops, hackathons, cultural fests, and more
          </p>

          {/* Quick stats */}
          {!loading && events.length > 0 && (
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{events.length}</span> events found
              </span>
              {upcomingCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  {upcomingCount} Upcoming
                </span>
              )}
              {completedCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5">
                  {completedCount} Completed
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <EventFiltersBar filters={filters} onChange={setFilters} />
            </div>
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <CalendarDays className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-1">No events found</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Try adjusting your filters or search terms to find events.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <p className="text-center text-sm text-slate-400 mt-8">
                  Showing {events.length} event{events.length !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
