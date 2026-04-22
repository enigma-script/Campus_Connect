import { ArrowLeft, CalendarDays, Clock, MapPin, Users, CircleCheck as CheckCircle2, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import CategoryBadge from '../components/events/CategoryBadge';
import { useEvent } from '../hooks/useEvents';
import { useEventRegistration } from '../hooks/useRegistrations';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/use-toast';

const PLACEHOLDER_IMAGE = 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg';

export default function EventDetailPage() {
  const { params, navigate } = useRouter();
  const { user, role } = useAuth();
  const eventId = params.id ?? null;

  const { event, loading: eventLoading } = useEvent(eventId);
  const { isRegistered, registrantCount, loading: regLoading, actionLoading, register, unregister } =
    useEventRegistration(eventId, user?.id ?? null);

  const formattedDate = event
    ? new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const handleRegister = async () => {
    if (!user) {
      navigate('auth');
      return;
    }
    const { error } = await register();
    if (error) {
      toast({ title: 'Registration failed', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Registered!', description: `You're registered for "${event?.title}".` });
    }
  };

  const handleUnregister = async () => {
    const { error } = await unregister();
    if (error) {
      toast({ title: 'Failed to unregister', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Unregistered', description: `You've been removed from "${event?.title}".` });
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 gap-4">
        <AlertCircle className="w-12 h-12 text-slate-300" />
        <h2 className="text-xl font-semibold">Event not found</h2>
        <Button variant="outline" onClick={() => navigate('events')}>Back to Events</Button>
      </div>
    );
  }

  const isUpcoming = event.status === 'Upcoming';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('events')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Poster */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <img
                src={event.poster_url || PLACEHOLDER_IMAGE}
                alt={event.title}
                className="w-full h-80 lg:h-96 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
              />
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <CategoryBadge category={event.category} size="md" />
                  <Badge
                    className={`font-semibold ${
                      isUpcoming
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    variant="outline"
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">{event.title}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <CalendarDays className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Date</p>
                    <p className="text-sm font-semibold text-slate-800">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Time</p>
                    <p className="text-sm font-semibold text-slate-800">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Venue</p>
                    <p className="text-sm font-semibold text-slate-800">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Registrants</p>
                    {regLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">{registrantCount} students registered</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">About This Event</h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{event.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Registration Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-lg">Registration</h3>
                {!regLoading && (
                  <span className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-800">{registrantCount}</span> joined
                  </span>
                )}
              </div>

              {!isUpcoming ? (
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-slate-500 text-sm font-medium">This event has ended</p>
                </div>
              ) : !user ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500 text-center">Sign in to register for this event</p>
                  <Button
                    onClick={() => navigate('auth')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Sign In to Register
                  </Button>
                </div>
              ) : role === 'admin' ? (
                <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
                  <p className="text-amber-700 text-sm font-medium">Admins don't register for events</p>
                </div>
              ) : isRegistered ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">You're registered!</p>
                      <p className="text-xs text-emerald-600">See you at the event</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleUnregister}
                    disabled={actionLoading}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Unregister
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Register Now
                </Button>
              )}
            </div>

            {/* Event Details Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Category</span>
                  <CategoryBadge category={event.category} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`font-semibold ${isUpcoming ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Date</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Time</span>
                  <span className="font-semibold text-slate-800">{event.time}</span>
                </div>
              </div>
            </div>

            {/* Admin Edit Button */}
            {role === 'admin' && (
              <Button
                onClick={() => navigate('admin-event-form', { id: event.id })}
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Edit This Event
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
