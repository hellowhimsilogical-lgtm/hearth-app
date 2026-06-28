import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { db } from '../lib/db';
import { useAuth } from './useAuth';

export function useSync() {
    const { user } = useAuth();
    const [syncing, setSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(null);
    const [error, setError] = useState(null);

  const syncDown = useCallback(async () => {
        if (!user) return;
        setSyncing(true);
        setError(null);
        try {
                const { data: tasks, error: tasksErr } = await supabase
                  .from('tasks')
                  .select('*')
                  .eq('family_id', user.user_metadata?.family_id);
                if (tasksErr) throw tasksErr;

          const { data: events, error: eventsErr } = await supabase
                  .from('events')
                  .select('*')
                  .eq('family_id', user.user_metadata?.family_id);
                if (eventsErr) throw eventsErr;

          await db.transaction('rw', db.tasks, db.events, async () => {
                    if (tasks?.length) await db.tasks.bulkPut(tasks);
                    if (events?.length) await db.events.bulkPut(events);
          });

          setLastSynced(new Date());
        } catch (err) {
                setError(err.message);
        } finally {
                setSyncing(false);
        }
  }, [user]);

  useEffect(() => {
        if (!user) return;

                syncDown();

                const tasksChannel = supabase
          .channel('tasks-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, syncDown)
          .subscribe();

                const eventsChannel = supabase
          .channel('events-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, syncDown)
          .subscribe();

                return () => {
                        supabase.removeChannel(tasksChannel);
                        supabase.removeChannel(eventsChannel);
                };
  }, [user, syncDown]);

  return { syncing, lastSynced, error, syncDown };
}
