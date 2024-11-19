import { produce } from 'immer'

import { setAppPollingInterval } from '~/atoms/app'
import type { DB_Notification } from '~/database/schemas'
import { MetaKey, MetaService } from '~/database/services/meta'
import { NotificationService } from '~/database/services/notification'
import { appLog } from '~/lib/log'
import { octokit } from '~/lib/octokit'

import { createTransaction, createZustandStore } from '../utils/helper'

interface NotificationStoreState {
  notifications: Record<string, DB_Notification>

  syncingAll: boolean
  syncingDelta: boolean

  syncAt: Nullable<Date>
  lastModified: Nullable<Date>
}

export const useNotificationStore = createZustandStore<NotificationStoreState>(
  'notification',
)(() => ({
  notifications: {},
  syncingAll: false,
  syncingDelta: false,
  syncAt: null,
  lastModified: null,
}))

const LOOP_FETCH_MAX_PAGE = 100
const PRE_PAGE_SIZE = 50

const get = useNotificationStore.getState
const set = useNotificationStore.setState

class NotificationStoreActionsStatic {
  upsertMany(data: DB_Notification[]) {
    set((state) => {
      const map = { ...state.notifications }
      for (const n of data) {
        map[n.id] = n
      }

      return { ...state, notifications: map }
    })
  }

  async markAsRead(id: string) {
    const snapshot = get().notifications[id]
    if (!snapshot) return

    const tx = createTransaction(snapshot)
    tx.optimistic(() => {
      const nextState = produce(get(), (draft) => {
        const n = draft.notifications[id]
        if (n) {
          n.last_read_at = new Date().toISOString()
          n.unread = false
        }
      })
      set(nextState)
    })
    tx.execute(async () => {
      await octokit.rest.activity.markThreadAsRead({
        thread_id: +snapshot.id,
      })
    })

    tx.persist(() => {
      return NotificationService.markRead(id)
    })

    tx.rollback((snapshot) => {
      set((state) => {
        const map = { ...state.notifications }
        map[id] = snapshot
        return { ...state, notifications: map }
      })
    })
    await tx.run()
  }

  async markAllAsRead() {
    //  TODO
  }
}

export const NotificationStoreActions = new NotificationStoreActionsStatic()
class NotificationRequestsStatic {
  async fetch() {
    const since = await MetaService.get(MetaKey.LastModified)
    if (since) {
      return this.fetchDelta(since)
    }
    return this.fetchAll()
  }

  private async _processNotifications(
    notifications: Awaited<
      ReturnType<
        typeof octokit.rest.activity.listNotificationsForAuthenticatedUser
      >
    >,
  ) {
    const data = await NotificationService.upsertMany(notifications.data)
    NotificationStoreActions.upsertMany(data)

    const lastModified = notifications.headers['last-modified']
    const pollingInterval = notifications.headers['x-poll-interval']
    if (pollingInterval) {
      setAppPollingInterval(Number(pollingInterval) * 1000)
    }

    if (lastModified) {
      const date = new Date(lastModified)
      MetaService.set(MetaKey.LastModified, date.toISOString())

      set((state) => ({
        ...state,
        lastModified: date,
        syncAt: new Date(),
      }))
    }

    return { data, notifications }
  }

  private async fetchDelta(since: string) {
    const notifications =
      await octokit.rest.activity.listNotificationsForAuthenticatedUser({
        since,
        per_page: PRE_PAGE_SIZE,
        all: true,
      })

    const { data } = await this._processNotifications(notifications)

    if (notifications.data.length >= PRE_PAGE_SIZE) {
      set((state) => ({ ...state, syncingDelta: true }))
      this.asyncLoopfetch({ since }).finally(() => {
        set((state) => ({ ...state, syncingDelta: false }))
      })
    }
    return data
  }

  private async fetchAll() {
    const notifications =
      await octokit.rest.activity.listNotificationsForAuthenticatedUser({
        all: true,
        per_page: PRE_PAGE_SIZE,
      })

    const { notifications: result } =
      await this._processNotifications(notifications)

    if (result.data.length >= PRE_PAGE_SIZE) {
      set((state) => ({ ...state, syncingAll: true }))
      this.asyncLoopfetch({ all: true }).finally(() => {
        set((state) => ({ ...state, syncingAll: false }))
      })
    }
    return result
  }

  private async asyncLoopfetch(
    params: Parameters<
      typeof octokit.rest.activity.listNotificationsForAuthenticatedUser
    >[0],
  ) {
    let page = 2
    let hasMore = true

    while (hasMore && page < LOOP_FETCH_MAX_PAGE) {
      appLog(`Fetching page ${page}...`)
      const notifications =
        await octokit.rest.activity.listNotificationsForAuthenticatedUser({
          ...params,
          page,
          per_page: PRE_PAGE_SIZE,
        })

      const data = await NotificationService.upsertMany(notifications.data)
      NotificationStoreActions.upsertMany(data)
      hasMore = notifications.data.length >= PRE_PAGE_SIZE
      page++
    }
  }
}

export const NotificationRequests = new NotificationRequestsStatic()
