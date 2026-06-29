import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

const INIT_DATA = {
  familyName: 'Our Family',
  members: [
    { id: '1', name: 'Admin', ci: 0, emoji: "🌸", role: 'admin', pin: null },
    { id: '2', name: 'Partner', ci: 5, emoji: "⚓", role: 'admin', pin: null },
  ],
  events: [],
  chores: [],
  maintenance: [],
  shoppingLists: [],
  announcements: [],
  businesses: [],
  gifts: [],
  settings: { showHolidays: true },
};

export function useHearthSync(userId) {
  const [data, setData] = useState(INIT_DATA);
  const [syncing, setSyncing] = useState(false);

  const syncData = useCallback(async (updates) => {
    if (updates) {
      setData(prev => ({ ...prev, ...updates }));
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    setSyncing(true);
    supabase
      .from('family_data')
      .select('*')
      .eq('user_id', userId)
      .single()
      .then(({ data: row, error }) => {
        if (!error && row && row.data) {
          setData(prev => ({ ...INIT_DATA, ...row.data }));
        }
        setSyncing(false);
      });
  }, [userId]);

  return { data, syncData, syncing };
}
