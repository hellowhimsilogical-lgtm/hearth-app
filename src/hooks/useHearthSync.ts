import { useState, useEffect, useCallback, useRef } from 'react'

import { supabase } from '../supabase'




// ════════════════════════════════════════════════════════════════════════════

// SYNC STRATEGY

// ════════════════════════════════════════════════════════════════════════════

// 1. IndexedDB is PRIMARY — all local changes happen there first

// 2. On save to IndexedDB, queue changes for Supabase sync

// 3. Sync happens in background (debounced, batched)

// 4. Supabase acts as backup/restore point

// 5. On app load, if no IndexedDB data, restore from Supabase

// 6. Real-time subscriptions keep data fresh across tabs




interface SyncChange {

  table: string

  action: 'insert' | 'update' | 'delete'

  id: string

  data?: any

}




export function useHearthSync(userId: string | undefined) {

  const [syncing, setSyncing] = useState(false)

  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)

  const [syncError, setSyncError] = useState<string | null>(null)




  const syncQueueRef = useRef<SyncChange[]>([])

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)




  // ── Debounced sync to Supabase ───────────────────────────────────

  const flushSyncQueue = useCallback(async () => {

                                         if (!userId || syncQueueRef.current.length === 0) return




                                         setSyncing(true)

                                         setSyncError(null)




                                         try {

          for (const change of syncQueueRef.current) {

                                                   const { table, action, id, data } = change




                                                   if (action === 'insert' || action === 'update') {

                      const { error } = await supabase

                        .from(table)

                        .upsert({ ...data, user_id: userId, id }, { onConflict: 'id' })

                      if (error) throw new Error(`${table} upsert failed: ${error.message}`)

                                                   } else if (action === 'delete') {

                      const { error } = await supabase

                        .from(table)

                        .delete()

                        .eq('id', id)

                        .eq('user_id', userId)

                      if (error) throw new Error(`${table} delete failed: ${error.message}`)

                                                   }

          }




          syncQueueRef.current = []

                  setLastSyncTime(Date.now())

                                         } catch (err: any) {

          setSyncError(err.message)

          console.error('Sync error:', err)

                                         } finally {

          setSyncing(false)

                                         }

  }, [userId])




  // ── Queue a change for sync ──────────────────────────────────────

  const queueChange = useCallback(

        (change: SyncChange) => {

          syncQueueRef.current.push(change)




          // Debounce: sync after 2 seconds of inactivity

          if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)

          syncTimeoutRef.current = setTimeout(() => flushSyncQueue(), 2000)

        },

        [flushSyncQueue]

      )




  // ── Fetch all items from Supabase for a category ──────────────────

  const fetchItemsFromSupabase = useCallback(

        async (category: string) => {

          if (!userId) return []

                  try {

                  const { data, error } = await supabase

                    .from('hearth_items')

                    .select('*')

                    .eq('user_id', userId)

                    .eq('category', category)

                    .is('archived_at', null)

                  if (error) throw error

                  return data || []

                  } catch (err) {

                  console.error(`Fetch ${category} error:`, err)

                  return []

                  }

        },

        [userId]

      )




  // ── Restore all data from Supabase (for first-time load) ─────────

  const restoreFromSupabase = useCallback(async () => {

                                              if (!userId) return null

                                              try {

          setSyncing(true)




          const categories = ['today', 'thisweek', 'month', 'someday']

          const restored: any = { alice: { explore: [], todo: [], learning: [] } }




                  for (const cat of categories) {

                                                        const { data, error } = await supabase

                                                          .from('hearth_items')

                                                          .select('*')

                                                          .eq('user_id', userId)

                                                          .eq('category', cat)

                                                          .is('archived_at', null)

                                                        if (error) throw error

                                                        restored[cat] = data || []

                  }




          setLastSyncTime(Date.now())

          return restored

                                              } catch (err: any) {

          setSyncError(err.message)

          console.error('Restore error:', err)

          return null

                                              } finally {

          setSyncing(false)

                                              }

  }, [userId])




  // ── Set up real-time subscriptions ──────────────────────────────

  useEffect(() => {

                if (!userId) return




                const categories = ['today', 'thisweek', 'month', 'someday']

                const subscriptions: any[] = []




                      for (const cat of categories) {

          const sub = supabase

            .channel(`hearth_items:${cat}`)

            .on(

                      'postgres_changes',

              {

                          event: '*',

                            schema: 'public',

                            table: 'hearth_items',

                            filter: `category=eq.${cat}&user_id=eq.${userId}`,

              },

                        (payload) => {

                          console.log(`Real-time update: ${cat}`, payload)

                          // App can listen for these updates and refresh if needed

                        }

                      )

            .subscribe()




          subscriptions.push(sub)

                      }




                return () => {

                        subscriptions.forEach((sub) => supabase.removeChannel(sub))

                }

  }, [userId])




  // ── Clean up timeout on unmount ──────────────────────────────────

  useEffect(() => {

                return () => {

                        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)

                }

  }, [])




  // ── Manually trigger sync (e.g., on visibility change) ───────────

  const syncNow = useCallback(() => {

                                  if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)

                                  return flushSyncQueue()

  }, [flushSyncQueue])




  return {

        syncing,

        lastSyncTime,

        syncError,

        queueChange,

        fetchItemsFromSupabase,

        restoreFromSupabase,

        syncNow,

  }

}
