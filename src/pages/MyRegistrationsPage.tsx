import { CalendarDays, MapPin, Clock, BookmarkX, Loader as Loader2, BookmarkCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import CategoryBadge from '../components/events/CategoryBadge';
import { useUserRegistrations } from '../hooks/useRegistrations';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';
import { toast } from '../components/ui/use-toast';
import { useState } from 'react';

const PLACEHOLDER_IMAGE = 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg';

export default function MyRegistrationsPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const { registrations, loading, refetch } = useUserRegistrations(user?.id ?? null);
  const [unregisteringId, setUnregisteringId] = useState<string | null>(null);

  const upcoming = registrations.filter((r) => r.event?.status === 'Upcoming');
  const past = registrations.filter((r) => r.event?.status === 'Completed');

  const handleUnregister = async (_eventId: string, eventTitle: string, regId: string) => {
    setUnregisteringId(regId);

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', regId);

    if (error) {
      toast({ title: 'Failed to unregister', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Unregistered', description: `You've been removed from "${eventTitle}".` });
      await refetch();
    }

    setUnregisteringId(null);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookmarkCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Registrations</h1>
              <p className="text-slate-500 text-sm">
                {registrations.length} event{registrations.length !== 1 ? 's' : ''} registered
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarDays className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No registrations yet</h3>
            <p className="text-slate-500 mb-6 max-w-xs">
              Browse upcoming events and register to see them here.
            </p>
            <Button
              onClick={() => navigate('events')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Events
            </Button>
          </div>
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Upcoming Events</h2>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-semibold">
                    {upcoming.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {upcoming.map((reg) => {
                    const event = reg.event;
                    if (!event) return null;
                    return (
                      <RegistrationCard
                        key={reg.id}
                        reg={reg}
                        event={event}
                        onUnregister={() => handleUnregister(event.id, event.title, reg.id)}
                        unregistering={unregisteringId === reg.id}
                        onView={() => navigate('event-detail', { id: event.id })}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Past Events</h2>
                  <Badge variant="secondary" className="font-semibold">
                    {past.length}
                  </Badge>
                </div>
                <div className="space-y-3 opacity-80">
                  {past.map((reg) => {
                    const event = reg.event;
                    if (!event) return null;
                    return (
                      <RegistrationCard
                        key={reg.id}
                        reg={reg}
                        event={event}
                        onUnregister={() => handleUnregister(event.id, event.title, reg.id)}
                        unregistering={unregisteringId === reg.id}
                        onView={() => navigate('event-detail', { id: event.id })}
                        isPast
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface RegistrationCardProps {
  reg: { id: string; registered_at: string };
  event: NonNullable<ReturnType<typeof useUserRegistrations>['registrations'][0]['event']>;
  onUnregister: () => void;
  unregistering: boolean;
  onView: () => void;
  isPast?: boolean;
}

function RegistrationCard({ reg, event, onUnregister, unregistering, onView, isPast }: RegistrationCardProps) {
  const registeredAt = new Date(reg.registered_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const eventDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Event Image */}
        <div className="w-24 sm:w-32 flex-shrink-0 hidden sm:block">
          <img
            src={event.poster_url || PLACEHOLDER_IMAGE}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <CategoryBadge category={event.category} />
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${
                    isPast
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {event.status}
                </Badge>
              </div>

              <button
                onClick={onView}
                className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors text-left line-clamp-1"
              >
                {event.title}
              </button>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
                  {eventDate}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {event.venue}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Registered on {registeredAt}
              </p>
            </div>

            <div className="flex flex-col gap-2 items-end flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={onView}
                className="text-xs h-8 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                View Details
              </Button>
              {!isPast && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onUnregister}
                  disabled={unregistering}
                  className="text-xs h-8 text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                >
                  {unregistering ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <BookmarkX className="w-3 h-3" />
                  )}
                  Unregister
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
