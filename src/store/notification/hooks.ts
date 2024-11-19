import type { DB_Notification } from '~/database'

import { selectNotificationLength } from './selectors'
import { useNotificationStore } from './store'

export const useSortedNotifications = () => {
  const notifications = useNotificationStore((state) => {
    return Object.values(state.notifications).sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  })

  return notifications
}

export const useIsSyncingNotifications = () => {
  return useNotificationStore((state) => state.syncingAll || state.syncingDelta)
}

export function useNotification(id: string): DB_Notification
export function useNotification<T>(
  id: string,
  selector?: (notification?: DB_Notification) => T,
): T
export function useNotification<T>(
  id: string,
  selector?: (notification?: DB_Notification) => T,
) {
  return useNotificationStore(
    (state) => selector?.(state.notifications[id]) ?? state.notifications[id],
  )
}

export const useNotificationLength = () => {
  return useNotificationStore(selectNotificationLength)
}

export const useNotificationSyncAt = () => {
  return useNotificationStore((state) => state.syncAt)
}

export const useNotificationUpdatedAt = () => {
  return useNotificationStore((state) => state.lastModified)
}
