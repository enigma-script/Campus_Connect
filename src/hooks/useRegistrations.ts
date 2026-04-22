import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Registration, Event } from '../lib/database.types';

export function useUserRegistrations(userId: string | null) {
  const [registrations, setRegistrations] = useState<(Registration & { event: Event })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('registrations')
      .select(`
        *,
        event:events(*)
      `)
      .eq('user_id', userId)
      .order('registered_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setRegistrations((data as (Registration & { event: Event })[]) ?? []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return { registrations, loading, error, refetch: fetchRegistrations };
}

export function useEventRegistration(eventId: string | null, userId: string | null) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrantCount, setRegistrantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const [countResult, userResult] = await Promise.all([
      supabase
        .from('registrations')
        .select('id', { count: 'exact', head: true })
        .eq('event_id', eventId),
      userId
        ? supabase
            .from('registrations')
            .select('id')
            .eq('event_id', eventId)
            .eq('user_id', userId)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    setRegistrantCount(countResult.count ?? 0);
    setIsRegistered(!!userResult.data);
    setLoading(false);
  }, [eventId, userId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const register = async () => {
    if (!eventId || !userId) return { error: 'Not authenticated' };
    setActionLoading(true);

    const { error } = await supabase
      .from('registrations')
      .insert({ event_id: eventId, user_id: userId });

    if (!error) {
      setIsRegistered(true);
      setRegistrantCount((c) => c + 1);
    }

    setActionLoading(false);
    return { error: error?.message ?? null };
  };

  const unregister = async () => {
    if (!eventId || !userId) return { error: 'Not authenticated' };
    setActionLoading(true);

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (!error) {
      setIsRegistered(false);
      setRegistrantCount((c) => Math.max(0, c - 1));
    }

    setActionLoading(false);
    return { error: error?.message ?? null };
  };

  return { isRegistered, registrantCount, loading, actionLoading, register, unregister, refetch: fetchStatus };
}
