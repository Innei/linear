import { create } from 'zustand'

import type { DB_Notification } from '~/database/schemas'
import { NotificationService } from '~/database/services/notification'
import { octokit } from '~/lib/octokit'

export const useNotificationStore = create(() => ({
  notifications: {} as Record<string, DB_Notification>,
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
  async fetch() {
    const notifications =
      await octokit.rest.activity.listNotificationsForAuthenticatedUser()

    const data = await NotificationService.upsertMany(notifications.data)
    NotificationStoreActions.upsertMany(data)
    return notifications
  }
}

export const NotificationRequests = new NotificationRequestsStatic()
