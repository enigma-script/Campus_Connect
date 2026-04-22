import { CalendarDays, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import CategoryBadge from './CategoryBadge';
import type { Event } from '../../lib/database.types';
import { useRouter } from '../../contexts/RouterContext';

interface EventCardProps {
  event: Event;
  showCount?: boolean;
}

const PLACEHOLDER_IMAGE = 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg';

export default function EventCard({ event, showCount = false }: EventCardProps) {
  const { navigate } = useRouter();

  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card
      className="group overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white"
      onClick={() => navigate('event-detail', { id: event.id })}
    >
      {/* Poster Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={event.poster_url || PLACEHOLDER_IMAGE}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            className={`text-xs font-semibold shadow-sm ${
              event.status === 'Upcoming'
                ? 'bg-emerald-500 text-white hover:bg-emerald-500'
                : 'bg-slate-500 text-white hover:bg-slate-500'
            }`}
          >
            {event.status}
          </Badge>
        </div>

        {/* Category bottom-left */}
        <div className="absolute bottom-3 left-3">
          <CategoryBadge category={event.category} />
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <CalendarDays className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          {showCount && event.registrant_count !== undefined && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Users className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span>{event.registrant_count} registered</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 pt-1 group-hover:gap-2 transition-all">
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </CardContent>
    </Card>
  );
}
