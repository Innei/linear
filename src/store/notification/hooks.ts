import { useCallback } from 'react'

import type { DB_Notification } from '~/database'
import { ALL_REPO } from '~/hooks/biz/useRouter'

import { selectNotificationLength, selectSortedNotification } from './selectors'
import { useNotificationStore } from './store'

export const useSortedNotifications = (
  filter?: (notification: DB_Notification) => boolean,
) => {
  const notifications = useNotificationStore(
    useCallback(selectSortedNotification(filter), [filter]),
  )

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

export const useNotificationLengthByRepoId = (repoId: string) => {
  return useNotificationStore((state) => {
    if (repoId === ALL_REPO) {
      return selectNotificationLength(state)
    }
    return Object.values(state.notifications).filter(
      (n) => n.repositoryId.toString() === repoId,
    ).length
  })
}

export const useNotificationSyncAt = () => {
  return useNotificationStore((state) => state.syncAt)
}

export const useNotificationUpdatedAt = () => {
  return useNotificationStore((state) => state.lastModified)
}
