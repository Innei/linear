import type { DB_Notification } from '~/database/schemas'
import { MetaKey, MetaService } from '~/database/services/meta'
import { NotificationService } from '~/database/services/notification'
import { octokit } from '~/lib/octokit'

import { createZustandStore } from '../utils/helper'

interface NotificationStoreState {
  notifications: Record<string, DB_Notification>
}
export const useNotificationStore = createZustandStore<NotificationStoreState>(
  'notification',
)(() => ({
  notifications: {},
}))

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
}

export const NotificationStoreActions = new NotificationStoreActionsStatic()
class NotificationRequestsStatic {
  async fetchDelta() {
    const lastModified = await MetaService.get(MetaKey.LastModified)
    if (!lastModified) {
      return this.fetchAll()
    }

    const notifications =
      await octokit.rest.activity.listNotificationsForAuthenticatedUser({
        since: lastModified,
      })

    const data = await NotificationService.upsertMany(notifications.data)
    NotificationStoreActions.upsertMany(data)
    {
      const lastModified = notifications.headers['last-modified']
      if (lastModified) {
        MetaService.set(MetaKey.LastModified, lastModified)
      }
    }
    return data
  }

  async fetchAll() {
    const notifications =
      await octokit.rest.activity.listNotificationsForAuthenticatedUser({
        all: true,
      })

    const data = await NotificationService.upsertMany(notifications.data)
    NotificationStoreActions.upsertMany(data)

    const lastModified = notifications.headers['last-modified']
    if (lastModified) {
      MetaService.set(
        MetaKey.LastModified,
        new Date(lastModified).toISOString(),
      )
    }

    return notifications
  }
}

export const NotificationRequests = new NotificationRequestsStatic()
