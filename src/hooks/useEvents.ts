import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Event, EventFilters } from '../lib/database.types';

export function useEvents(filters?: Partial<EventFilters>) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,venue.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }
    if (filters?.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }
    if (filters?.dateFrom) {
      query = query.gte('date', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('date', filters.dateTo);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEvents((data as Event[]) ?? []);
    }
    setLoading(false);
  }, [
    filters?.search,
    filters?.category,
    filters?.status,
    filters?.dateFrom,
    filters?.dateTo,
  ]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

export function useEvent(id: string | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setEvent(data as Event | null);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  return { event, loading, error };
}

export async function getRegistrantCount(eventId: string): Promise<number> {
  const { count } = await supabase
    .from('registrations')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId);
  return count ?? 0;
}

export async function getAllEventsWithCounts(): Promise<Event[]> {
  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (!eventsData) return [];

  const eventsWithCounts = await Promise.all(
    eventsData.map(async (event) => {
      const count = await getRegistrantCount(event.id);
      return { ...event, registrant_count: count } as Event;
    })
  );

  return eventsWithCounts;
}
